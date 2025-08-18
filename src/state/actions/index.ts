// ==================================================================
// ACTIONS - PATRÓN FLUX
// ==================================================================

import { ACTION_TYPES } from '../../shared/constants';
import { Product, CartItem } from '../../shared/types';

// ==================================================================
// PRODUCT ACTIONS
// ==================================================================

export const productActions = {
  fetchStart: () => ({
    type: ACTION_TYPES.PRODUCTS.FETCH_START,
  }),

  fetchSuccess: (products: Product[]) => ({
    type: ACTION_TYPES.PRODUCTS.FETCH_SUCCESS,
    payload: products,
  }),

  fetchError: (error: string) => ({
    type: ACTION_TYPES.PRODUCTS.FETCH_ERROR,
    payload: error,
  }),
};

// ==================================================================
// CART ACTIONS
// ==================================================================

export const cartActions = {
  addItem: (product: Product, quantity: number = 1) => ({
    type: ACTION_TYPES.CART.ADD_ITEM,
    payload: { product, quantity },
  }),

  removeItem: (productId: string) => ({
    type: ACTION_TYPES.CART.REMOVE_ITEM,
    payload: productId,
  }),

  updateQuantity: (productId: string, quantity: number) => ({
    type: ACTION_TYPES.CART.UPDATE_QUANTITY,
    payload: { productId, quantity },
  }),

  clearCart: () => ({
    type: ACTION_TYPES.CART.CLEAR_CART,
  }),
};

// ==================================================================
// TRANSACTION ACTIONS
// ==================================================================

export const transactionActions = {
  processStart: () => ({
    type: ACTION_TYPES.TRANSACTIONS.PROCESS_START,
  }),

  processSuccess: (transactionId: string) => ({
    type: ACTION_TYPES.TRANSACTIONS.PROCESS_SUCCESS,
    payload: transactionId,
  }),

  processError: (error: string) => ({
    type: ACTION_TYPES.TRANSACTIONS.PROCESS_ERROR,
    payload: error,
  }),
};

// Exportar todas las actions
export const actions = {
  products: productActions,
  cart: cartActions,
  transactions: transactionActions,
};

