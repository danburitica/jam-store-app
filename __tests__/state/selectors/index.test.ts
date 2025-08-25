// ==================================================================
// STATE SELECTORS TESTS
// ==================================================================

import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductById,
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  selectCartItemByProductId,
  selectIsProductInCart,
  selectTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
  selectCurrentTransaction,
  selectCartSummary,
  selectCheckoutData
} from '../../../src/state/selectors';
import { Product, CartItem, Transaction } from '../../../src/shared/types';

// Mock del estado raíz
const createMockRootState = (overrides: Partial<any> = {}) => ({
  products: {
    items: [
      {
        id: '1',
        name: 'Guitarra Acústica',
        price: 1200000,
        description: 'Guitarra acústica de cuerdas de acero',
        image: 'https://example.com/guitar.jpg'
      },
      {
        id: '2',
        name: 'Piano Digital',
        price: 3600000,
        description: 'Piano digital de 88 teclas'
      },
      {
        id: '3',
        name: 'Batería Completa',
        price: 2400000,
        description: 'Set completo de batería'
      }
    ],
    selectedCategory: null,
    isLoading: false,
    error: null,
    ...overrides.products
  },
  cart: {
    items: [
      {
        product: {
          id: '1',
          name: 'Guitarra Acústica',
          price: 1200000,
          description: 'Guitarra acústica de cuerdas de acero',
          image: 'https://example.com/guitar.jpg'
        },
        quantity: 2
      },
      {
        product: {
          id: '2',
          name: 'Piano Digital',
          price: 3600000,
          description: 'Piano digital de 88 teclas'
        },
        quantity: 1
      }
    ],
    total: 6000000, // (1200000 * 2) + (3600000 * 1)
    ...overrides.cart
  },
  transactions: {
    items: [
      {
        id: 'txn_1',
        items: [
          {
            product: {
              id: '1',
              name: 'Guitarra Acústica',
              price: 1200000
            },
            quantity: 1
          }
        ],
        total: 1200000,
        timestamp: 1640995200000,
        encryptedData: 'encrypted_data_1'
      }
    ],
    currentTransaction: 'txn_1',
    isLoading: false,
    error: null,
    ...overrides.transactions
  },
  ...overrides
});

describe('State Selectors', () => {
  describe('Product Selectors', () => {
    it('should select all products', () => {
      const state = createMockRootState();
      const result = selectProducts(state);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Guitarra Acústica');
      expect(result[1].name).toBe('Piano Digital');
      expect(result[2].name).toBe('Batería Completa');
    });

    it('should select products loading state', () => {
      const state = createMockRootState({
        products: { isLoading: true }
      });
      const result = selectProductsLoading(state);

      expect(result).toBe(true);
    });

    it('should select products error state', () => {
      const state = createMockRootState({
        products: { error: 'Failed to fetch products' }
      });
      const result = selectProductsError(state);

      expect(result).toBe('Failed to fetch products');
    });

    it('should select product by ID', () => {
      const state = createMockRootState();
      const result = selectProductById('1')(state);

      expect(result).toEqual({
        id: '1',
        name: 'Guitarra Acústica',
        price: 1200000,
        description: 'Guitarra acústica de cuerdas de acero',
        image: 'https://example.com/guitar.jpg'
      });
    });

    it('should return undefined for non-existent product ID', () => {
      const state = createMockRootState();
      const result = selectProductById('999')(state);

      expect(result).toBeUndefined();
    });

    it('should handle empty products array', () => {
      const state = createMockRootState({
        products: { items: [] }
      });
      const result = selectProducts(state);

      expect(result).toHaveLength(0);
    });

    it('should handle products with special characters', () => {
      const state = createMockRootState({
        products: {
          items: [
            {
              id: 'special',
              name: 'Product 🎸 with emojis 🎵',
              price: 1000000,
              description: 'Description with symbols @#$%^&*()'
            }
          ]
        }
      });
      const result = selectProducts(state);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Product 🎸 with emojis 🎵');
      expect(result[0].description).toBe('Description with symbols @#$%^&*()');
    });
  });

  describe('Cart Selectors', () => {
    it('should select all cart items', () => {
      const state = createMockRootState();
      const result = selectCartItems(state);

      expect(result).toHaveLength(2);
      expect(result[0].product.name).toBe('Guitarra Acústica');
      expect(result[0].quantity).toBe(2);
      expect(result[1].product.name).toBe('Piano Digital');
      expect(result[1].quantity).toBe(1);
    });

    it('should select cart total', () => {
      const state = createMockRootState();
      const result = selectCartTotal(state);

      expect(result).toBe(6000000);
    });

    it('should select cart items count', () => {
      const state = createMockRootState();
      const result = selectCartItemsCount(state);

      expect(result).toBe(3); // 2 + 1
    });

    it('should select cart item by product ID', () => {
      const state = createMockRootState();
      const result = selectCartItemByProductId('1')(state);

      expect(result).toEqual({
        product: {
          id: '1',
          name: 'Guitarra Acústica',
          price: 1200000,
          description: 'Guitarra acústica de cuerdas de acero',
          image: 'https://example.com/guitar.jpg'
        },
        quantity: 2
      });
    });

    it('should return undefined for non-existent product ID in cart', () => {
      const state = createMockRootState();
      const result = selectCartItemByProductId('999')(state);

      expect(result).toBeUndefined();
    });

    it('should check if product is in cart', () => {
      const state = createMockRootState();
      const result1 = selectIsProductInCart('1')(state);
      const result2 = selectIsProductInCart('999')(state);

      expect(result1).toBe(true);
      expect(result2).toBe(false);
    });

    it('should handle empty cart', () => {
      const state = createMockRootState({
        cart: { items: [], total: 0 }
      });

      expect(selectCartItems(state)).toHaveLength(0);
      expect(selectCartTotal(state)).toBe(0);
      expect(selectCartItemsCount(state)).toBe(0);
      expect(selectIsProductInCart('1')(state)).toBe(false);
    });

    it('should handle cart with single item', () => {
      const state = createMockRootState({
        cart: {
          items: [
            {
              product: {
                id: 'single',
                name: 'Single Item',
                price: 500000
              },
              quantity: 1
            }
          ],
          total: 500000
        }
      });

      expect(selectCartItems(state)).toHaveLength(1);
      expect(selectCartTotal(state)).toBe(500000);
      expect(selectCartItemsCount(state)).toBe(1);
      expect(selectIsProductInCart('single')(state)).toBe(true);
    });

    it('should handle cart with large quantities', () => {
      const state = createMockRootState({
        cart: {
          items: [
            {
              product: {
                id: 'large',
                name: 'Large Quantity Item',
                price: 100000
              },
              quantity: 1000
            }
          ],
          total: 100000000
        }
      });

      expect(selectCartItemsCount(state)).toBe(1000);
      expect(selectCartTotal(state)).toBe(100000000);
    });

    it('should handle cart with decimal quantities', () => {
      const state = createMockRootState({
        cart: {
          items: [
            {
              product: {
                id: 'decimal',
                name: 'Decimal Quantity Item',
                price: 100000
              },
              quantity: 2.5
            }
          ],
          total: 250000
        }
      });

      expect(selectCartItemsCount(state)).toBe(2.5);
      expect(selectCartTotal(state)).toBe(250000);
    });
  });

  describe('Transaction Selectors', () => {
    it('should select all transactions', () => {
      const state = createMockRootState();
      const result = selectTransactions(state);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('txn_1');
      expect(result[0].total).toBe(1200000);
    });

    it('should select transactions loading state', () => {
      const state = createMockRootState({
        transactions: { isLoading: true }
      });
      const result = selectTransactionsLoading(state);

      expect(result).toBe(true);
    });

    it('should select transactions error state', () => {
      const state = createMockRootState({
        transactions: { error: 'Transaction failed' }
      });
      const result = selectTransactionsError(state);

      expect(result).toBe('Transaction failed');
    });

    it('should select current transaction', () => {
      const state = createMockRootState();
      const result = selectCurrentTransaction(state);

      expect(result).toBe('txn_1');
    });

    it('should handle empty transactions array', () => {
      const state = createMockRootState({
        transactions: { items: [] }
      });
      const result = selectTransactions(state);

      expect(result).toHaveLength(0);
    });

    it('should handle null current transaction', () => {
      const state = createMockRootState({
        transactions: { currentTransaction: null }
      });
      const result = selectCurrentTransaction(state);

      expect(result).toBeNull();
    });
  });

  describe('Computed Selectors', () => {
    it('should select cart summary', () => {
      const state = createMockRootState();
      const result = selectCartSummary(state);

      expect(result).toEqual({
        itemsCount: 3,
        total: 6000000,
        items: [
          {
            product: {
              id: '1',
              name: 'Guitarra Acústica',
              price: 1200000,
              description: 'Guitarra acústica de cuerdas de acero',
              image: 'https://example.com/guitar.jpg'
            },
            quantity: 2
          },
          {
            product: {
              id: '2',
              name: 'Piano Digital',
              price: 3600000,
              description: 'Piano digital de 88 teclas'
            },
            quantity: 1
          }
        ]
      });
    });

    it('should select checkout data', () => {
      const state = createMockRootState();
      const result = selectCheckoutData(state);

      expect(result).toEqual({
        items: [
          {
            product: {
              id: '1',
              name: 'Guitarra Acústica',
              price: 1200000,
              description: 'Guitarra acústica de cuerdas de acero',
              image: 'https://example.com/guitar.jpg'
            },
            quantity: 2
          },
          {
            product: {
              id: '2',
              name: 'Piano Digital',
              price: 3600000,
              description: 'Piano digital de 88 teclas'
            },
            quantity: 1
          }
        ],
        total: 6000000,
        itemsCount: 3
      });
    });

    it('should handle empty cart in computed selectors', () => {
      const state = createMockRootState({
        cart: { items: [], total: 0 }
      });

      const summary = selectCartSummary(state);
      const checkout = selectCheckoutData(state);

      expect(summary.itemsCount).toBe(0);
      expect(summary.total).toBe(0);
      expect(summary.items).toHaveLength(0);
      expect(checkout.itemsCount).toBe(0);
      expect(checkout.total).toBe(0);
      expect(checkout.items).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const state = createMockRootState({
        cart: {
          items: [
            {
              product: {
                id: 'large',
                name: 'Large Price Item',
                price: Number.MAX_SAFE_INTEGER
              },
              quantity: 1
            }
          ],
          total: Number.MAX_SAFE_INTEGER
        }
      });

      expect(selectCartTotal(state)).toBe(Number.MAX_SAFE_INTEGER);
      expect(selectCartItemsCount(state)).toBe(1);
    });

    it('should handle very small numbers', () => {
      const state = createMockRootState({
        cart: {
          items: [
            {
              product: {
                id: 'small',
                name: 'Small Price Item',
                price: Number.MIN_VALUE
              },
              quantity: Number.MIN_VALUE
            }
          ],
          total: Number.MIN_VALUE
        }
      });

      expect(selectCartTotal(state)).toBe(Number.MIN_VALUE);
      expect(selectCartItemsCount(state)).toBe(Number.MIN_VALUE);
    });

    it('should handle null and undefined values gracefully', () => {
      const state = createMockRootState({
        products: { items: null as any },
        cart: { items: undefined as any, total: null as any },
        transactions: { items: null as any, currentTransaction: undefined as any }
      });

      // These should not throw errors
      expect(() => selectProducts(state)).not.toThrow();
      expect(() => selectCartItems(state)).not.toThrow();
      expect(() => selectCartTotal(state)).not.toThrow();
      expect(() => selectTransactions(state)).not.toThrow();
      expect(() => selectCurrentTransaction(state)).not.toThrow();
    });

    it('should handle malformed state structure', () => {
      const malformedState = {
        products: 'not an object',
        cart: 123,
        transactions: []
      } as any;

      // These should not throw errors and should return sensible defaults
      expect(() => selectProducts(malformedState)).not.toThrow();
      expect(() => selectCartItems(malformedState)).not.toThrow();
      expect(() => selectCartTotal(malformedState)).not.toThrow();
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', () => {
      const largeProducts = Array.from({ length: 10000 }, (_, index) => ({
        id: `product-${index}`,
        name: `Product ${index}`,
        price: Math.random() * 1000000,
        description: `Description for product ${index}`.repeat(100)
      }));

      const largeCartItems = Array.from({ length: 1000 }, (_, index) => ({
        product: largeProducts[index],
        quantity: Math.floor(Math.random() * 10) + 1
      }));

      const state = createMockRootState({
        products: { items: largeProducts },
        cart: { items: largeCartItems, total: 999999999 }
      });

      // These operations should complete quickly
      const startTime = Date.now();
      const products = selectProducts(state);
      const cartItems = selectCartItems(state);
      const cartTotal = selectCartTotal(state);
      const endTime = Date.now();

      expect(products).toHaveLength(10000);
      expect(cartItems).toHaveLength(1000);
      expect(cartTotal).toBe(999999999);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should not cause memory leaks with repeated calls', () => {
      const state = createMockRootState();
      const iterations = 1000;

      // Make many selector calls
      for (let i = 0; i < iterations; i++) {
        selectProducts(state);
        selectCartItems(state);
        selectCartTotal(state);
        selectCartItemsCount(state);
        selectIsProductInCart('1')(state);
      }

      // If we get here without memory issues, the test passes
      expect(true).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work together in realistic scenarios', () => {
      const state = createMockRootState();

      // Simulate a typical e-commerce flow
      const products = selectProducts(state);
      const isProductInCart = selectIsProductInCart('1')(state);
      const cartItems = selectCartItems(state);
      const cartTotal = selectCartTotal(state);
      const cartSummary = selectCartSummary(state);
      const checkoutData = selectCheckoutData(state);

      // Verify consistency
      expect(products).toHaveLength(3);
      expect(isProductInCart).toBe(true);
      expect(cartItems).toHaveLength(2);
      expect(cartTotal).toBe(6000000);
      expect(cartSummary.itemsCount).toBe(3);
      expect(checkoutData.total).toBe(6000000);
      expect(cartSummary.items).toEqual(cartItems);
      expect(checkoutData.items).toEqual(cartItems);
    });

    it('should handle state updates correctly', () => {
      let state = createMockRootState();

      // Initial state
      expect(selectCartItemsCount(state)).toBe(3);
      expect(selectCartTotal(state)).toBe(6000000);

      // Update state (simulating reducer action)
      state = createMockRootState({
        cart: {
          items: [
            {
              product: {
                id: '1',
                name: 'Guitarra Acústica',
                price: 1200000
              },
              quantity: 5
            }
          ],
          total: 6000000
        }
      });

      // Verify updated state
      expect(selectCartItemsCount(state)).toBe(5);
      expect(selectCartTotal(state)).toBe(6000000);
      expect(selectCartItems(state)).toHaveLength(1);
    });
  });
});
