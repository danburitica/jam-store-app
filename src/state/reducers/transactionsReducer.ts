// ==================================================================
// TRANSACTIONS REDUCER - PATRÓN FLUX
// ==================================================================

import { ACTION_TYPES } from '../../shared/constants';
import { Transaction, LoadingState, BaseAction } from '../../shared/types';

// Estado inicial del reducer de transacciones
export interface TransactionsState extends LoadingState {
  items: Transaction[];
  currentTransaction: string | null;
}

const initialState: TransactionsState = {
  items: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
};

// Reducer de transacciones
export const transactionsReducer = (
  state: TransactionsState = initialState,
  action: BaseAction
): TransactionsState => {
  switch (action.type) {
    case ACTION_TYPES.TRANSACTIONS.PROCESS_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        currentTransaction: null,
      };

    case ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentTransaction: action.payload,
        error: null,
      };

    case ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        currentTransaction: null,
      };

    default:
      return state;
  }
};

