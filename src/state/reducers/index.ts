// ==================================================================
// ROOT REDUCER - COMBINACIÓN DE TODOS LOS REDUCERS
// ==================================================================

import { combineReducers } from 'redux';
import { productsReducer, ProductsState } from './productsReducer';
import { cartReducer, CartState } from './cartReducer';
import { transactionsReducer, TransactionsState } from './transactionsReducer';

// Estado global de la aplicación
export interface RootState {
  products: ProductsState;
  cart: CartState;
  transactions: TransactionsState;
}

// Combinar todos los reducers
export const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  transactions: transactionsReducer,
});

// Exportar tipos
export type { ProductsState, CartState, TransactionsState };

