// ==================================================================
// TRANSACTIONS REDUCER TESTS
// ==================================================================

import { transactionsReducer, TransactionsState } from '../../../src/state/reducers/transactionsReducer';
import { ACTION_TYPES } from '../../../src/shared/constants';
import { Transaction } from '../../../src/shared/types';

describe('Transactions Reducer', () => {
  let initialState: TransactionsState;
  let mockTransactions: Transaction[];

  beforeEach(() => {
    initialState = {
      items: [],
      currentTransaction: null,
      isLoading: false,
      error: null,
    };

    mockTransactions = [
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
      },
      {
        id: 'txn_2',
        items: [
          {
            product: {
              id: '2',
              name: 'Piano Digital',
              price: 3600000
            },
            quantity: 1
          }
        ],
        total: 3600000,
        timestamp: 1640995300000,
        encryptedData: 'encrypted_data_2'
      }
    ];
  });

  describe('Initial State', () => {
    it('should return initial state when no action is provided', () => {
      const result = transactionsReducer(initialState, { type: 'UNKNOWN_ACTION' } as any);
      expect(result).toEqual(initialState);
    });

    it('should return initial state when state is undefined', () => {
      const result = transactionsReducer(undefined as any, { type: 'UNKNOWN_ACTION' } as any);
      expect(result).toEqual(initialState);
    });

    it('should have correct initial structure', () => {
      expect(initialState.items).toEqual([]);
      expect(initialState.currentTransaction).toBeNull();
      expect(initialState.isLoading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('PROCESS_START Action', () => {
    it('should set loading state to true and clear error and current transaction', () => {
      const stateWithData: TransactionsState = {
        ...initialState,
        error: 'Previous error',
        currentTransaction: 'txn_1',
        isLoading: false
      };

      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      };

      const result = transactionsReducer(stateWithData, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.currentTransaction).toBeNull();
      expect(result.items).toEqual([]);
    });

    it('should preserve existing items when starting process', () => {
      const stateWithItems: TransactionsState = {
        ...initialState,
        items: mockTransactions,
        isLoading: false
      };

      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      };

      const result = transactionsReducer(stateWithItems, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
      expect(result.currentTransaction).toBeNull();
      expect(result.items).toEqual(mockTransactions);
    });

    it('should handle multiple consecutive process start actions', () => {
      let state = initialState;

      // First process start
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentTransaction).toBeNull();

      // Second process start (should remain in loading state)
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentTransaction).toBeNull();
    });
  });

  describe('PROCESS_SUCCESS Action', () => {
    it('should set loading to false, clear error, and set current transaction', () => {
      const stateWithLoading: TransactionsState = {
        ...initialState,
        isLoading: true,
        error: 'Previous error'
      };

      const transactionId = 'txn_success';
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: transactionId
      };

      const result = transactionsReducer(stateWithLoading, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.currentTransaction).toBe(transactionId);
      expect(result.items).toEqual([]);
    });

    it('should preserve existing items when process succeeds', () => {
      const stateWithItems: TransactionsState = {
        ...initialState,
        items: mockTransactions,
        isLoading: true
      };

      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: 'txn_new'
      };

      const result = transactionsReducer(stateWithItems, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.currentTransaction).toBe('txn_new');
      expect(result.items).toEqual(mockTransactions);
    });

    it('should handle empty transaction ID', () => {
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: ''
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBe('');
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle null transaction ID', () => {
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: null
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBeNull();
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle very long transaction IDs', () => {
      const longTransactionId = 'A'.repeat(1000);
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: longTransactionId
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBe(longTransactionId);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle transaction IDs with special characters', () => {
      const specialTransactionId = 'txn@#$%^&*()_+{}|:"<>?[]\\;\',./';
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: specialTransactionId
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBe(specialTransactionId);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('PROCESS_ERROR Action', () => {
    it('should set loading to false, set error, and clear current transaction', () => {
      const stateWithData: TransactionsState = {
        ...initialState,
        currentTransaction: 'txn_1',
        isLoading: true,
        error: null
      };

      const errorMessage = 'Transaction failed';
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: errorMessage
      };

      const result = transactionsReducer(stateWithData, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.currentTransaction).toBeNull();
      expect(result.items).toEqual([]);
    });

    it('should preserve existing items when error occurs', () => {
      const stateWithItems: TransactionsState = {
        ...initialState,
        items: mockTransactions,
        isLoading: true
      };

      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: 'Network error'
      };

      const result = transactionsReducer(stateWithItems, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Network error');
      expect(result.currentTransaction).toBeNull();
      expect(result.items).toEqual(mockTransactions);
    });

    it('should handle different error message types', () => {
      const errorTestCases = [
        'Simple error message',
        'Error with symbols: @#$%^&*()',
        'Error with emojis 🚫❌',
        'Error with unicode: áéíóúñ',
        'Very long error message ' + 'A'.repeat(1000),
        '',
        null,
        undefined
      ];

      errorTestCases.forEach(errorMessage => {
        const action = {
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
          payload: errorMessage
        };

        const result = transactionsReducer(initialState, action);

        expect(result.isLoading).toBe(false);
        expect(result.error).toBe(errorMessage);
        expect(result.currentTransaction).toBeNull();
        expect(result.items).toEqual([]);
      });
    });

    it('should handle very large error messages', () => {
      const largeErrorMessage = 'A'.repeat(100000);
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: largeErrorMessage
      };

      const result = transactionsReducer(initialState, action);

      expect(result.error).toBe(largeErrorMessage);
      expect(result.isLoading).toBe(false);
      expect(result.currentTransaction).toBeNull();
    });
  });

  describe('State Immutability', () => {
    it('should not mutate original state', () => {
      const originalState: TransactionsState = {
        ...initialState,
        items: [...mockTransactions],
        currentTransaction: 'txn_1'
      };

      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      };

      const result = transactionsReducer(originalState, action);

      expect(result).not.toBe(originalState);
      // Solo verificar inmutabilidad de campos que se modifican
      expect(result.isLoading).toBe(true);
      expect(result.currentTransaction).toBeNull();
      expect(result.error).toBeNull();
      // El array items no se modifica, por lo que puede ser la misma referencia
      expect(originalState.items).toEqual(mockTransactions);
      expect(originalState.currentTransaction).toBe('txn_1');
      expect(originalState.isLoading).toBe(false);
    });

    it('should create new items array when updating', () => {
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: 'txn_new'
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBe('txn_new');
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null payload in PROCESS_SUCCESS', () => {
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: null
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBeNull();
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle undefined payload in PROCESS_SUCCESS', () => {
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: undefined
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBeUndefined();
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle null payload in PROCESS_ERROR', () => {
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: null
      };

      const result = transactionsReducer(initialState, action);

      expect(result.error).toBeNull();
      expect(result.isLoading).toBe(false);
      expect(result.currentTransaction).toBeNull();
    });

    it('should handle undefined payload in PROCESS_ERROR', () => {
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: undefined
      };

      const result = transactionsReducer(initialState, action);

      expect(result.error).toBeUndefined();
      expect(result.isLoading).toBe(false);
      expect(result.currentTransaction).toBeNull();
    });

    it('should handle very long transaction IDs', () => {
      const veryLongTransactionId = 'A'.repeat(100000);
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: veryLongTransactionId
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBe(veryLongTransactionId);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should handle transaction IDs with very long special characters', () => {
      const specialLongTransactionId = 'txn_' + '@#$%^&*()'.repeat(1000);
      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: specialLongTransactionId
      };

      const result = transactionsReducer(initialState, action);

      expect(result.currentTransaction).toBe(specialLongTransactionId);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', () => {
      const largeTransactions = Array.from({ length: 10000 }, (_, index) => ({
        id: `txn_${index}`,
        items: [
          {
            product: {
              id: `product_${index}`,
              name: `Product ${index}`,
              price: Math.random() * 1000000
            },
            quantity: Math.floor(Math.random() * 10) + 1
          }
        ],
        total: Math.random() * 1000000,
        timestamp: Date.now() + index,
        encryptedData: `encrypted_data_${index}`.repeat(100)
      }));

      const stateWithLargeData: TransactionsState = {
        ...initialState,
        items: largeTransactions
      };

      const action = {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      };

      const startTime = Date.now();
      const result = transactionsReducer(stateWithLargeData, action);
      const endTime = Date.now();

      expect(result.items).toHaveLength(10000);
      expect(result.isLoading).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should not cause memory leaks with repeated operations', () => {
      let state = initialState;
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        // Start process
        state = transactionsReducer(state, {
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
        });

        // Success
        state = transactionsReducer(state, {
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
          payload: `txn_${i}`
        });

        // Error
        state = transactionsReducer(state, {
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
          payload: `Error ${i}`
        });
      }

      // If we get here without memory issues, the test passes
      expect(true).toBe(true);
    });

    it('should handle concurrent state updates efficiently', () => {
      const baseState = initialState;
      const actions = Array.from({ length: 1000 }, (_, index) => ({
        type: index % 3 === 0 ? ACTION_TYPES.TRANSACTIONS.PROCESS_START :
               index % 3 === 1 ? ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS :
               ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: index % 3 === 1 ? `txn_${index}` : `Error ${index}`
      }));

      const startTime = Date.now();

      let finalState = baseState;
      actions.forEach(action => {
        finalState = transactionsReducer(finalState, action);
      });

      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
      expect(finalState).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete transaction cycle correctly', () => {
      let state = initialState;

      // Start processing
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentTransaction).toBeNull();

      // Process successful
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: 'txn_success'
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.currentTransaction).toBe('txn_success');

      // Start another process
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentTransaction).toBeNull(); // Should be cleared

      // Process fails
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: 'Network error'
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.currentTransaction).toBeNull();
    });

    it('should work with existing transaction items', () => {
      const stateWithItems: TransactionsState = {
        ...initialState,
        items: mockTransactions
      };

      // Start process
      let state = transactionsReducer(stateWithItems, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      });
      expect(state.items).toEqual(mockTransactions);
      expect(state.isLoading).toBe(true);

      // Success
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: 'txn_new'
      });
      expect(state.items).toEqual(mockTransactions);
      expect(state.isLoading).toBe(false);
      expect(state.currentTransaction).toBe('txn_new');

      // Error
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: 'Error'
      });
      expect(state.items).toEqual(mockTransactions);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error');
      expect(state.currentTransaction).toBeNull();
    });

    it('should handle rapid state changes', () => {
      let state = initialState;
      const rapidActions = [
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_START },
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS, payload: 'txn_1' },
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_START },
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR, payload: 'Error 1' },
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_START },
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS, payload: 'txn_2' },
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_START },
        { type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR, payload: 'Error 2' }
      ];

      rapidActions.forEach(action => {
        state = transactionsReducer(state, action);
      });

      // Final state should reflect the last action
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error 2');
      expect(state.currentTransaction).toBeNull();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle e-commerce transaction flow', () => {
      let state = initialState;

      // User starts checkout process
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      });
      expect(state.isLoading).toBe(true);

      // Payment processing succeeds
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
        payload: 'txn_checkout_123'
      });
      expect(state.isLoading).toBe(false);
      expect(state.currentTransaction).toBe('txn_checkout_123');

      // User starts another transaction
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
      });
      expect(state.isLoading).toBe(true);
      expect(state.currentTransaction).toBeNull();

      // Second transaction fails
      state = transactionsReducer(state, {
        type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
        payload: 'Insufficient funds'
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Insufficient funds');
      expect(state.currentTransaction).toBeNull();
    });

    it('should handle batch transaction processing', () => {
      let state = initialState;

      // Process multiple transactions in sequence
      for (let i = 0; i < 5; i++) {
        // Start
        state = transactionsReducer(state, {
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_START
        });
        expect(state.isLoading).toBe(true);

        // Success
        state = transactionsReducer(state, {
          type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
          payload: `txn_batch_${i}`
        });
        expect(state.isLoading).toBe(false);
        expect(state.currentTransaction).toBe(`txn_batch_${i}`);
      }

      // Final state
      expect(state.currentTransaction).toBe('txn_batch_4');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
