// ==================================================================
// STATE ACTIONS TESTS
// ==================================================================

import { productActions, cartActions, transactionActions, actions } from '../../../src/state/actions';
import { ACTION_TYPES } from '../../../src/shared/constants';
import { Product, CartItem } from '../../../src/shared/types';

describe('State Actions', () => {
  describe('productActions', () => {
    describe('fetchStart', () => {
      it('should create fetch start action', () => {
        const action = productActions.fetchStart();
        
        expect(action).toEqual({
          type: ACTION_TYPES.PRODUCTS.FETCH_START,
        });
        expect(action.type).toBe(ACTION_TYPES.PRODUCTS.FETCH_START);
        expect(action.payload).toBeUndefined();
      });

      it('should have correct action type', () => {
        const action = productActions.fetchStart();
        expect(action.type).toBe(ACTION_TYPES.PRODUCTS.FETCH_START);
      });
    });

    describe('fetchSuccess', () => {
      it('should create fetch success action with products', () => {
        const products: Product[] = [
          { id: '1', name: 'Guitar', price: 1000 },
          { id: '2', name: 'Piano', price: 2000 }
        ];
        
        const action = productActions.fetchSuccess(products);
        
        expect(action).toEqual({
          type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
          payload: products,
        });
        expect(action.type).toBe(ACTION_TYPES.PRODUCTS.FETCH_SUCCESS);
        expect(action.payload).toBe(products);
        expect(action.payload).toHaveLength(2);
      });

      it('should handle empty products array', () => {
        const action = productActions.fetchSuccess([]);
        
        expect(action.payload).toEqual([]);
        expect(action.payload).toHaveLength(0);
      });

      it('should handle single product', () => {
        const product: Product = { id: '1', name: 'Single Product', price: 500 };
        const action = productActions.fetchSuccess([product]);
        
        expect(action.payload).toEqual([product]);
        expect(action.payload).toHaveLength(1);
      });

      it('should handle large product arrays', () => {
        const products: Product[] = Array.from({ length: 100 }, (_, i) => ({
          id: i.toString(),
          name: `Product ${i}`,
          price: i * 100
        }));
        
        const action = productActions.fetchSuccess(products);
        
        expect(action.payload).toEqual(products);
        expect(action.payload).toHaveLength(100);
      });
    });

    describe('fetchError', () => {
      it('should create fetch error action with error message', () => {
        const errorMessage = 'Network error occurred';
        const action = productActions.fetchError(errorMessage);
        
        expect(action).toEqual({
          type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
          payload: errorMessage,
        });
        expect(action.type).toBe(ACTION_TYPES.PRODUCTS.FETCH_ERROR);
        expect(action.payload).toBe(errorMessage);
      });

      it('should handle empty error message', () => {
        const action = productActions.fetchError('');
        expect(action.payload).toBe('');
      });

      it('should handle long error messages', () => {
        const longError = 'a'.repeat(1000);
        const action = productActions.fetchError(longError);
        expect(action.payload).toBe(longError);
      });

      it('should handle special characters in error messages', () => {
        const specialError = 'Error: "Network timeout" (code: 500)';
        const action = productActions.fetchError(specialError);
        expect(action.payload).toBe(specialError);
      });
    });
  });

  describe('cartActions', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 1000
    };

    describe('addItem', () => {
      it('should create add item action with default quantity', () => {
        const action = cartActions.addItem(mockProduct);
        
        expect(action).toEqual({
          type: ACTION_TYPES.CART.ADD_ITEM,
          payload: { product: mockProduct, quantity: 1 },
        });
        expect(action.type).toBe(ACTION_TYPES.CART.ADD_ITEM);
        expect(action.payload.product).toBe(mockProduct);
        expect(action.payload.quantity).toBe(1);
      });

      it('should create add item action with custom quantity', () => {
        const action = cartActions.addItem(mockProduct, 5);
        
        expect(action.payload.quantity).toBe(5);
        expect(action.payload.product).toBe(mockProduct);
      });

      it('should handle zero quantity', () => {
        const action = cartActions.addItem(mockProduct, 0);
        expect(action.payload.quantity).toBe(0);
      });

      it('should handle negative quantity', () => {
        const action = cartActions.addItem(mockProduct, -1);
        expect(action.payload.quantity).toBe(-1);
      });

      it('should handle decimal quantity', () => {
        const action = cartActions.addItem(mockProduct, 2.5);
        expect(action.payload.quantity).toBe(2.5);
      });

      it('should handle very large quantity', () => {
        const action = cartActions.addItem(mockProduct, Number.MAX_SAFE_INTEGER);
        expect(action.payload.quantity).toBe(Number.MAX_SAFE_INTEGER);
      });

      it('should handle product without optional fields', () => {
        const minimalProduct: Product = {
          id: '2',
          name: 'Minimal Product',
          price: 500
        };
        
        const action = cartActions.addItem(minimalProduct, 3);
        
        expect(action.payload.product).toEqual(minimalProduct);
        expect(action.payload.quantity).toBe(3);
      });
    });

    describe('removeItem', () => {
      it('should create remove item action with product ID', () => {
        const productId = 'product_123';
        const action = cartActions.removeItem(productId);
        
        expect(action).toEqual({
          type: ACTION_TYPES.CART.REMOVE_ITEM,
          payload: productId,
        });
        expect(action.type).toBe(ACTION_TYPES.CART.REMOVE_ITEM);
        expect(action.payload).toBe(productId);
      });

      it('should handle empty product ID', () => {
        const action = cartActions.removeItem('');
        expect(action.payload).toBe('');
      });

      it('should handle numeric product ID', () => {
        const action = cartActions.removeItem('123');
        expect(action.payload).toBe('123');
      });

      it('should handle special characters in product ID', () => {
        const action = cartActions.removeItem('product-123_456');
        expect(action.payload).toBe('product-123_456');
      });

      it('should handle very long product ID', () => {
        const longId = 'a'.repeat(1000);
        const action = cartActions.removeItem(longId);
        expect(action.payload).toBe(longId);
      });
    });

    describe('updateQuantity', () => {
      it('should create update quantity action', () => {
        const productId = 'product_123';
        const quantity = 5;
        const action = cartActions.updateQuantity(productId, quantity);
        
        expect(action).toEqual({
          type: ACTION_TYPES.CART.UPDATE_QUANTITY,
          payload: { productId, quantity },
        });
        expect(action.type).toBe(ACTION_TYPES.CART.UPDATE_QUANTITY);
        expect(action.payload.productId).toBe(productId);
        expect(action.payload.quantity).toBe(quantity);
      });

      it('should handle zero quantity', () => {
        const action = cartActions.updateQuantity('product_1', 0);
        expect(action.payload.quantity).toBe(0);
      });

      it('should handle negative quantity', () => {
        const action = cartActions.updateQuantity('product_1', -1);
        expect(action.payload.quantity).toBe(-1);
      });

      it('should handle decimal quantity', () => {
        const action = cartActions.updateQuantity('product_1', 2.5);
        expect(action.payload.quantity).toBe(2.5);
      });

      it('should handle very large quantity', () => {
        const action = cartActions.updateQuantity('product_1', Number.MAX_SAFE_INTEGER);
        expect(action.payload.quantity).toBe(Number.MAX_SAFE_INTEGER);
      });

      it('should handle empty product ID', () => {
        const action = cartActions.updateQuantity('', 5);
        expect(action.payload.productId).toBe('');
      });
    });

    describe('clearCart', () => {
      it('should create clear cart action', () => {
        const action = cartActions.clearCart();
        
        expect(action).toEqual({
          type: ACTION_TYPES.CART.CLEAR_CART,
        });
        expect(action.type).toBe(ACTION_TYPES.CART.CLEAR_CART);
        expect(action.payload).toBeUndefined();
      });

      it('should have correct action type', () => {
        const action = cartActions.clearCart();
        expect(action.type).toBe(ACTION_TYPES.CART.CLEAR_CART);
      });
    });
  });

  describe('transactionActions', () => {
    describe('processStart', () => {
      it('should create process start action', () => {
        const action = transactionActions.processStart();
        
        expect(action).toEqual({
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_START,
        });
        expect(action.type).toBe(ACTION_TYPES.TRANSACTIONS.PROCESS_START);
        expect(action.payload).toBeUndefined();
      });

      it('should have correct action type', () => {
        const action = transactionActions.processStart();
        expect(action.type).toBe(ACTION_TYPES.TRANSACTIONS.PROCESS_START);
      });
    });

    describe('processSuccess', () => {
      it('should create process success action with transaction ID', () => {
        const transactionId = 'txn_123456';
        const action = transactionActions.processSuccess(transactionId);
        
        expect(action).toEqual({
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
          payload: transactionId,
        });
        expect(action.type).toBe(ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS);
        expect(action.payload).toBe(transactionId);
      });

      it('should handle empty transaction ID', () => {
        const action = transactionActions.processSuccess('');
        expect(action.payload).toBe('');
      });

      it('should handle numeric transaction ID', () => {
        const action = transactionActions.processSuccess('123');
        expect(action.payload).toBe('123');
      });

      it('should handle special characters in transaction ID', () => {
        const action = transactionActions.processSuccess('txn-123_456');
        expect(action.payload).toBe('txn-123_456');
      });

      it('should handle very long transaction ID', () => {
        const longId = 'a'.repeat(1000);
        const action = transactionActions.processSuccess(longId);
        expect(action.payload).toBe(longId);
      });
    });

    describe('processError', () => {
      it('should create process error action with error message', () => {
        const errorMessage = 'Payment failed';
        const action = transactionActions.processError(errorMessage);
        
        expect(action).toEqual({
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
          payload: errorMessage,
        });
        expect(action.type).toBe(ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR);
        expect(action.payload).toBe(errorMessage);
      });

      it('should handle empty error message', () => {
        const action = transactionActions.processError('');
        expect(action.payload).toBe('');
      });

      it('should handle long error messages', () => {
        const longError = 'a'.repeat(1000);
        const action = transactionActions.processError(longError);
        expect(action.payload).toBe(longError);
      });

      it('should handle special characters in error messages', () => {
        const specialError = 'Error: "Payment declined" (code: 400)';
        const action = transactionActions.processError(specialError);
        expect(action.payload).toBe(specialError);
      });
    });
  });

  describe('actions export', () => {
    it('should export all action groups', () => {
      expect(actions).toBeDefined();
      expect(actions.products).toBe(productActions);
      expect(actions.cart).toBe(cartActions);
      expect(actions.transactions).toBe(transactionActions);
    });

    it('should have all required action methods', () => {
      // Product actions
      expect(typeof actions.products.fetchStart).toBe('function');
      expect(typeof actions.products.fetchSuccess).toBe('function');
      expect(typeof actions.products.fetchError).toBe('function');

      // Cart actions
      expect(typeof actions.cart.addItem).toBe('function');
      expect(typeof actions.cart.removeItem).toBe('function');
      expect(typeof actions.cart.updateQuantity).toBe('function');
      expect(typeof actions.cart.clearCart).toBe('function');

      // Transaction actions
      expect(typeof actions.transactions.processStart).toBe('function');
      expect(typeof actions.transactions.processSuccess).toBe('function');
      expect(typeof actions.transactions.processError).toBe('function');
    });
  });

  describe('Action Structure Validation', () => {
    it('should have consistent action structure', () => {
      const allActions = [
        productActions.fetchStart(),
        productActions.fetchSuccess([]),
        productActions.fetchError('error'),
        cartActions.addItem({ id: '1', name: 'Test', price: 100 }),
        cartActions.removeItem('1'),
        cartActions.updateQuantity('1', 2),
        cartActions.clearCart(),
        transactionActions.processStart(),
        transactionActions.processSuccess('txn_1'),
        transactionActions.processError('error')
      ];

      allActions.forEach(action => {
        expect(action).toHaveProperty('type');
        expect(typeof action.type).toBe('string');
        expect(action.type.length).toBeGreaterThan(0);
      });
    });

    it('should have unique action types', () => {
      const actionTypes = [
        productActions.fetchStart().type,
        productActions.fetchSuccess([]).type,
        productActions.fetchError('').type,
        cartActions.addItem({ id: '1', name: 'Test', price: 100 }).type,
        cartActions.removeItem('1').type,
        cartActions.updateQuantity('1', 1).type,
        cartActions.clearCart().type,
        transactionActions.processStart().type,
        transactionActions.processSuccess('').type,
        transactionActions.processError('').type
      ];

      const uniqueTypes = new Set(actionTypes);
      expect(uniqueTypes.size).toBe(actionTypes.length);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined values gracefully', () => {
      // These should not throw errors
      expect(() => productActions.fetchError(null as any)).not.toThrow();
      expect(() => cartActions.addItem(null as any, 1)).not.toThrow();
      expect(() => cartActions.removeItem(null as any)).not.toThrow();
      expect(() => transactionActions.processError(undefined as any)).not.toThrow();
    });

    it('should handle extreme values', () => {
      const extremeProduct: Product = {
        id: 'extreme',
        name: 'a'.repeat(10000),
        price: Number.MAX_SAFE_INTEGER
      };

      expect(() => cartActions.addItem(extremeProduct, Number.MAX_SAFE_INTEGER)).not.toThrow();
      expect(() => cartActions.updateQuantity('extreme', Number.MAX_SAFE_INTEGER)).not.toThrow();
    });

    it('should handle empty and whitespace strings', () => {
      expect(() => productActions.fetchError('   ')).not.toThrow();
      expect(() => cartActions.removeItem('   ')).not.toThrow();
      expect(() => transactionActions.processError('   ')).not.toThrow();
    });
  });
});
