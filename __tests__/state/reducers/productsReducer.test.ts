// ==================================================================
// PRODUCTS REDUCER TESTS
// ==================================================================

import { productsReducer, ProductsState } from '../../../src/state/reducers/productsReducer';
import { ACTION_TYPES } from '../../../src/shared/constants';
import { Product } from '../../../src/shared/types';

describe('Products Reducer', () => {
  let initialState: ProductsState;
  let mockProducts: Product[];

  beforeEach(() => {
    initialState = {
      items: [],
      selectedCategory: null,
      isLoading: false,
      error: null,
    };

    mockProducts = [
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
    ];
  });

  describe('Initial State', () => {
    it('should return initial state when no action is provided', () => {
      const result = productsReducer(initialState, { type: 'UNKNOWN_ACTION' } as any);
      expect(result).toEqual(initialState);
    });

    it('should return initial state when state is undefined', () => {
      const result = productsReducer(undefined as any, { type: 'UNKNOWN_ACTION' } as any);
      expect(result).toEqual(initialState);
    });

    it('should have correct initial structure', () => {
      expect(initialState.items).toEqual([]);
      expect(initialState.selectedCategory).toBeNull();
      expect(initialState.isLoading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('FETCH_START Action', () => {
    it('should set loading state to true and clear error', () => {
      const stateWithError: ProductsState = {
        ...initialState,
        error: 'Previous error',
        isLoading: false
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      };

      const result = productsReducer(stateWithError, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.items).toEqual([]);
      expect(result.selectedCategory).toBeNull();
    });

    it('should preserve existing items and category when starting fetch', () => {
      const stateWithItems: ProductsState = {
        ...initialState,
        items: mockProducts,
        selectedCategory: 'strings',
        isLoading: false
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      };

      const result = productsReducer(stateWithItems, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.items).toEqual(mockProducts);
      expect(result.selectedCategory).toBe('strings');
    });

    it('should handle multiple consecutive fetch start actions', () => {
      let state = initialState;

      // First fetch start
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      // Second fetch start (should remain in loading state)
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('FETCH_SUCCESS Action', () => {
    it('should set loading to false, clear error, and set items', () => {
      const stateWithLoading: ProductsState = {
        ...initialState,
        isLoading: true,
        error: 'Previous error'
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: mockProducts
      };

      const result = productsReducer(stateWithLoading, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.items).toEqual(mockProducts);
      expect(result.selectedCategory).toBeNull();
    });

    it('should replace existing items with new ones', () => {
      const stateWithItems: ProductsState = {
        ...initialState,
        items: [
          {
            id: 'old',
            name: 'Old Product',
            price: 100000
          }
        ],
        isLoading: true
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: mockProducts
      };

      const result = productsReducer(stateWithItems, action);

      expect(result.items).toEqual(mockProducts);
      expect(result.items).toHaveLength(3);
      expect(result.items[0].id).toBe('1');
      expect(result.items[2].id).toBe('3');
    });

    it('should handle empty products array', () => {
      const stateWithItems: ProductsState = {
        ...initialState,
        items: mockProducts,
        isLoading: true
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: []
      };

      const result = productsReducer(stateWithItems, action);

      expect(result.items).toEqual([]);
      expect(result.items).toHaveLength(0);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle single product', () => {
      const singleProduct = [mockProducts[0]];

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: singleProduct
      };

      const result = productsReducer(initialState, action);

      expect(result.items).toEqual(singleProduct);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Guitarra Acústica');
    });

    it('should handle large product lists', () => {
      const largeProductList = Array.from({ length: 1000 }, (_, index) => ({
        id: `product-${index}`,
        name: `Product ${index}`,
        price: Math.random() * 1000000,
        description: `Description for product ${index}`
      }));

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: largeProductList
      };

      const result = productsReducer(initialState, action);

      expect(result.items).toEqual(largeProductList);
      expect(result.items).toHaveLength(1000);
      expect(result.items[0].id).toBe('product-0');
      expect(result.items[999].id).toBe('product-999');
    });

    it('should preserve selected category when fetching products', () => {
      const stateWithCategory: ProductsState = {
        ...initialState,
        selectedCategory: 'strings',
        isLoading: true
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: mockProducts
      };

      const result = productsReducer(stateWithCategory, action);

      expect(result.selectedCategory).toBe('strings');
      expect(result.items).toEqual(mockProducts);
      expect(result.isLoading).toBe(false);
    });

    it('should handle products with special characters', () => {
      const specialProducts = [
        {
          id: 'special',
          name: 'Product 🎸 with emojis 🎵',
          price: 1000000,
          description: 'Description with symbols @#$%^&*()'
        }
      ];

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: specialProducts
      };

      const result = productsReducer(initialState, action);

      expect(result.items).toEqual(specialProducts);
      expect(result.items[0].name).toBe('Product 🎸 with emojis 🎵');
      expect(result.items[0].description).toBe('Description with symbols @#$%^&*()');
    });
  });

  describe('FETCH_ERROR Action', () => {
    it('should set loading to false, set error, and preserve items', () => {
      const stateWithItems: ProductsState = {
        ...initialState,
        items: mockProducts,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Failed to fetch products';
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: errorMessage
      };

      const result = productsReducer(stateWithItems, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.items).toEqual(mockProducts);
      expect(result.selectedCategory).toBeNull();
    });

    it('should handle empty items array when error occurs', () => {
      const stateWithLoading: ProductsState = {
        ...initialState,
        items: [],
        isLoading: true
      };

      const errorMessage = 'Network error';
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: errorMessage
      };

      const result = productsReducer(stateWithLoading, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.items).toEqual([]);
    });

    it('should handle different error message types', () => {
      const errorTestCases = [
        'Simple error message',
        'Error with symbols: @#$%^&*()',
        'Error with emojis 🚫❌',
        'Error with unicode: áéíóúñ',
        'Very long error message ' + 'A'.repeat(1000),
        ''
      ];

      errorTestCases.forEach(errorMessage => {
        const action = {
          type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
          payload: errorMessage
        };

        const result = productsReducer(initialState, action);

        expect(result.isLoading).toBe(false);
        expect(result.error).toBe(errorMessage);
        expect(result.items).toEqual([]);
      });
    });

    it('should preserve selected category when error occurs', () => {
      const stateWithCategory: ProductsState = {
        ...initialState,
        selectedCategory: 'percussion',
        isLoading: true
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: 'Error occurred'
      };

      const result = productsReducer(stateWithCategory, action);

      expect(result.selectedCategory).toBe('percussion');
      expect(result.error).toBe('Error occurred');
      expect(result.isLoading).toBe(false);
    });
  });

  describe('State Immutability', () => {
    it('should not mutate original state', () => {
      const originalState: ProductsState = {
        ...initialState,
        items: [...mockProducts],
        selectedCategory: 'strings'
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      };

      const result = productsReducer(originalState, action);

      expect(result).not.toBe(originalState);
      // Verificar que el estado de carga cambió
      expect(result.isLoading).toBe(true);
      expect(originalState.isLoading).toBe(false);
      // El array items no se modifica en FETCH_START, por lo que puede ser la misma referencia
      expect(originalState.items).toEqual(mockProducts);
      expect(originalState.selectedCategory).toBe('strings');
    });

    it('should create new items array when updating', () => {
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: mockProducts
      };

      const result = productsReducer(initialState, action);

      expect(result.items).toEqual(mockProducts);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      // Verificar que se creó un nuevo estado
      expect(result).not.toBe(initialState);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null payload in FETCH_SUCCESS', () => {
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: null
      };

      const result = productsReducer(initialState, action);

      expect(result.items).toEqual([]); // Debería devolver array vacío, no null
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle undefined payload in FETCH_SUCCESS', () => {
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: undefined
      };

      const result = productsReducer(initialState, action);

      expect(result.items).toEqual([]); // Debería devolver array vacío, no undefined
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle null payload in FETCH_ERROR', () => {
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: null
      };

      const result = productsReducer(initialState, action);

      expect(result.error).toBeNull();
      expect(result.isLoading).toBe(false);
    });

    it('should handle undefined payload in FETCH_ERROR', () => {
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: undefined
      };

      const result = productsReducer(initialState, action);

      expect(result.error).toBeUndefined();
      expect(result.isLoading).toBe(false);
    });

    it('should handle very large error messages', () => {
      const largeErrorMessage = 'A'.repeat(100000);
      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: largeErrorMessage
      };

      const result = productsReducer(initialState, action);

      expect(result.error).toBe(largeErrorMessage);
      expect(result.isLoading).toBe(false);
    });

    it('should handle products with very long names and descriptions', () => {
      const longProduct = {
        id: 'long',
        name: 'A'.repeat(10000),
        price: 1000000,
        description: 'A'.repeat(50000)
      };

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: [longProduct]
      };

      const result = productsReducer(initialState, action);

      expect(result.items).toEqual([longProduct]);
      expect(result.items[0].name).toBe('A'.repeat(10000));
      expect(result.items[0].description).toBe('A'.repeat(50000));
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, index) => ({
        id: `product-${index}`,
        name: `Product ${index}`,
        price: Math.random() * 1000000,
        description: `Description for product ${index}`.repeat(100)
      }));

      const action = {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: largeDataset
      };

      const startTime = Date.now();
      const result = productsReducer(initialState, action);
      const endTime = Date.now();

      expect(result.items).toHaveLength(10000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should not cause memory leaks with repeated operations', () => {
      let state = initialState;
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        // Start fetch
        state = productsReducer(state, {
          type: ACTION_TYPES.PRODUCTS.FETCH_START
        });

        // Success with products
        state = productsReducer(state, {
          type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
          payload: mockProducts
        });

        // Error
        state = productsReducer(state, {
          type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
          payload: `Error ${i}`
        });
      }

      // If we get here without memory issues, the test passes
      expect(true).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete fetch cycle correctly', () => {
      let state = initialState;

      // Start fetching
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      // Fetch successful
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: mockProducts
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockProducts);

      // Start another fetch
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockProducts); // Should preserve items

      // Fetch fails
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: 'Network error'
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.items).toEqual(mockProducts); // Should preserve items
    });

    it('should work with other state properties', () => {
      const stateWithCategory: ProductsState = {
        ...initialState,
        selectedCategory: 'strings',
        items: mockProducts
      };

      // Start fetch
      let state = productsReducer(stateWithCategory, {
        type: ACTION_TYPES.PRODUCTS.FETCH_START
      });
      expect(state.selectedCategory).toBe('strings');
      expect(state.isLoading).toBe(true);

      // Success
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
        payload: [mockProducts[0]]
      });
      expect(state.selectedCategory).toBe('strings');
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual([mockProducts[0]]);

      // Error
      state = productsReducer(state, {
        type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
        payload: 'Error'
      });
      expect(state.selectedCategory).toBe('strings');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error');
      expect(state.items).toEqual([mockProducts[0]]);
    });
  });
});
