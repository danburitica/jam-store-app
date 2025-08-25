// ==================================================================
// CART REDUCER TESTS
// ==================================================================

import { cartReducer, CartState } from '../../../src/state/reducers/cartReducer';
import { ACTION_TYPES } from '../../../src/shared/constants';
import { Product, CartItem } from '../../../src/shared/types';

describe('Cart Reducer', () => {
  let initialState: CartState;
  let mockProduct: Product;
  let mockCartItem: CartItem;

  beforeEach(() => {
    initialState = {
      items: [],
      total: 0,
    };

    mockProduct = {
      id: '1',
      name: 'Guitarra Acústica',
      price: 1200000,
      description: 'Guitarra acústica de cuerdas de acero',
      image: 'https://example.com/guitar.jpg'
    };

    mockCartItem = {
      product: mockProduct,
      quantity: 1
    };
  });

  describe('Initial State', () => {
    it('should return initial state when no action is provided', () => {
      const result = cartReducer(initialState, { type: 'UNKNOWN_ACTION' } as any);
      expect(result).toEqual(initialState);
    });

    it('should return initial state when state is undefined', () => {
      const result = cartReducer(undefined as any, { type: 'UNKNOWN_ACTION' } as any);
      expect(result).toEqual(initialState);
    });
  });

  describe('ADD_ITEM Action', () => {
    it('should add new item to cart', () => {
      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 2 }
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].product).toEqual(mockProduct);
      expect(result.items[0].quantity).toBe(2);
      expect(result.total).toBe(2400000); // 1200000 * 2
    });

    it('should update quantity when adding existing product', () => {
      const stateWithItem: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 3 }
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(4); // 1 + 3
      expect(result.total).toBe(4800000); // 1200000 * 4
    });

    it('should handle multiple products correctly', () => {
      const secondProduct: Product = {
        id: '2',
        name: 'Piano Digital',
        price: 3600000,
        description: 'Piano digital de 88 teclas'
      };

      const action1 = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 1 }
      };

      const action2 = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: secondProduct, quantity: 2 }
      };

      let result = cartReducer(initialState, action1);
      result = cartReducer(result, action2);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(8400000); // (1200000 * 1) + (3600000 * 2)
    });

    it('should handle zero quantity correctly', () => {
      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 0 }
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(0);
      expect(result.total).toBe(0);
    });

    it('should handle negative quantity correctly', () => {
      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: -1 }
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(-1);
      expect(result.total).toBe(-1200000);
    });

    it('should handle decimal quantities', () => {
      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 1.5 }
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(1.5);
      expect(result.total).toBe(1800000); // 1200000 * 1.5
    });
  });

  describe('REMOVE_ITEM Action', () => {
    it('should remove item from cart', () => {
      const stateWithItems: CartState = {
        items: [
          mockCartItem,
          {
            product: {
              id: '2',
              name: 'Piano Digital',
              price: 3600000
            },
            quantity: 1
          }
        ],
        total: 4800000
      };

      const action = {
        type: ACTION_TYPES.CART.REMOVE_ITEM,
        payload: '1'
      };

      const result = cartReducer(stateWithItems, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].product.id).toBe('2');
      expect(result.total).toBe(3600000);
    });

    it('should handle removing non-existent item', () => {
      const stateWithItem: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.REMOVE_ITEM,
        payload: '999'
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1200000);
    });

    it('should handle removing from empty cart', () => {
      const action = {
        type: ACTION_TYPES.CART.REMOVE_ITEM,
        payload: '1'
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle removing last item', () => {
      const stateWithItem: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.REMOVE_ITEM,
        payload: '1'
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('UPDATE_QUANTITY Action', () => {
    it('should update item quantity', () => {
      const stateWithItem: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.UPDATE_QUANTITY,
        payload: { productId: '1', quantity: 5 }
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items[0].quantity).toBe(5);
      expect(result.total).toBe(6000000); // 1200000 * 5
    });

    it('should remove item when quantity is zero', () => {
      const stateWithItem: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.UPDATE_QUANTITY,
        payload: { productId: '1', quantity: 0 }
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      const stateWithItem: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.UPDATE_QUANTITY,
        payload: { productId: '1', quantity: -5 }
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle updating non-existent item', () => {
      const action = {
        type: ACTION_TYPES.CART.UPDATE_QUANTITY,
        payload: { productId: '999', quantity: 5 }
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle decimal quantities', () => {
      const stateWithItem: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.UPDATE_QUANTITY,
        payload: { productId: '1', quantity: 2.5 }
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items[0].quantity).toBe(2.5);
      expect(result.total).toBe(3000000); // 1200000 * 2.5
    });
  });

  describe('CLEAR_CART Action', () => {
    it('should clear all items from cart', () => {
      const stateWithItems: CartState = {
        items: [
          mockCartItem,
          {
            product: {
              id: '2',
              name: 'Piano Digital',
              price: 3600000
            },
            quantity: 1
          }
        ],
        total: 4800000
      };

      const action = {
        type: ACTION_TYPES.CART.CLEAR_CART
      };

      const result = cartReducer(stateWithItems, action);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle clearing empty cart', () => {
      const action = {
        type: ACTION_TYPES.CART.CLEAR_CART
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('Total Calculation', () => {
    it('should calculate total correctly with multiple items', () => {
      const stateWithItems: CartState = {
        items: [
          { product: mockProduct, quantity: 2 },
          {
            product: {
              id: '2',
              name: 'Piano Digital',
              price: 3600000
            },
            quantity: 1
          },
          {
            product: {
              id: '3',
              name: 'Batería',
              price: 2400000
            },
            quantity: 3
          }
        ],
        total: 0
      };

      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 1 }
      };

      const result = cartReducer(stateWithItems, action);

      const expectedTotal = (1200000 * 3) + (3600000 * 1) + (2400000 * 3);
      expect(result.total).toBe(expectedTotal);
    });

    it('should handle zero price products', () => {
      const freeProduct: Product = {
        id: 'free',
        name: 'Free Item',
        price: 0
      };

      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: freeProduct, quantity: 5 }
      };

      const result = cartReducer(initialState, action);

      expect(result.total).toBe(0);
    });

    it('should handle very large prices', () => {
      const expensiveProduct: Product = {
        id: 'expensive',
        name: 'Expensive Item',
        price: Number.MAX_SAFE_INTEGER
      };

      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: expensiveProduct, quantity: 1 }
      };

      const result = cartReducer(initialState, action);

      expect(result.total).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle very small prices', () => {
      const cheapProduct: Product = {
        id: 'cheap',
        name: 'Cheap Item',
        price: Number.MIN_VALUE
      };

      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: cheapProduct, quantity: 1 }
      };

      const result = cartReducer(initialState, action);

      expect(result.total).toBe(Number.MIN_VALUE);
    });
  });

  describe('Immutability', () => {
    it('should not mutate original state', () => {
      const originalState: CartState = {
        items: [mockCartItem],
        total: 1200000
      };

      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 1 }
      };

      const result = cartReducer(originalState, action);

      expect(result).not.toBe(originalState);
      expect(result.items).not.toBe(originalState.items);
      expect(originalState.items).toHaveLength(1);
      expect(originalState.total).toBe(1200000);
    });

    it('should create new item objects', () => {
      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 1 }
      };

      const result = cartReducer(initialState, action);

      expect(result.items[0]).not.toBe(mockCartItem);
      expect(result.items[0].product).toBe(mockProduct);
      expect(result.items[0].quantity).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large quantities', () => {
      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: Number.MAX_SAFE_INTEGER }
      };

      const result = cartReducer(initialState, action);

      expect(result.items[0].quantity).toBe(Number.MAX_SAFE_INTEGER);
      expect(() => result.total).not.toThrow();
    });

    it('should handle very small decimal quantities', () => {
      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: Number.MIN_VALUE }
      };

      const result = cartReducer(initialState, action);

      expect(result.items[0].quantity).toBe(Number.MIN_VALUE);
      expect(() => result.total).not.toThrow();
    });

    it('should handle products with special characters', () => {
      const specialProduct: Product = {
        id: 'special',
        name: 'Product 🎸 with emojis 🎵',
        price: 1000000,
        description: 'Description with symbols @#$%^&*()'
      };

      const action = {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: specialProduct, quantity: 1 }
      };

      const result = cartReducer(initialState, action);

      expect(result.items[0].product.name).toBe('Product 🎸 with emojis 🎵');
      expect(result.items[0].product.description).toBe('Description with symbols @#$%^&*()');
      expect(result.total).toBe(1000000);
    });

    it('should handle multiple actions in sequence', () => {
      let state = initialState;

      // Add first item
      state = cartReducer(state, {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: mockProduct, quantity: 2 }
      });

      // Add second item
      const secondProduct: Product = {
        id: '2',
        name: 'Piano Digital',
        price: 3600000
      };
      state = cartReducer(state, {
        type: ACTION_TYPES.CART.ADD_ITEM,
        payload: { product: secondProduct, quantity: 1 }
      });

      // Update first item quantity
      state = cartReducer(state, {
        type: ACTION_TYPES.CART.UPDATE_QUANTITY,
        payload: { productId: '1', quantity: 3 }
      });

      // Remove second item
      state = cartReducer(state, {
        type: ACTION_TYPES.CART.REMOVE_ITEM,
        payload: '2'
      });

      expect(state.items).toHaveLength(1);
      expect(state.items[0].product.id).toBe('1');
      expect(state.items[0].quantity).toBe(3);
      expect(state.total).toBe(3600000); // 1200000 * 3
    });
  });
});
