// ==================================================================
// SELECTORS - PATRÓN FLUX
// ==================================================================

import { RootState } from '../reducers';
import { Product, CartItem } from '../../shared/types';

// ==================================================================
// PRODUCT SELECTORS
// ==================================================================

export const selectProducts = (state: RootState): Product[] => 
  state.products.items;

export const selectProductsLoading = (state: RootState): boolean => 
  state.products.isLoading;

export const selectProductsError = (state: RootState): string | null => 
  state.products.error;

export const selectProductById = (productId: string) => (state: RootState): Product | undefined =>
  state.products.items.find(product => product.id === productId);

// ==================================================================
// CART SELECTORS
// ==================================================================

export const selectCartItems = (state: RootState): CartItem[] => 
  state.cart.items;

export const selectCartTotal = (state: RootState): number => 
  state.cart.total;

export const selectCartItemsCount = (state: RootState): number =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartItemByProductId = (productId: string) => (state: RootState): CartItem | undefined =>
  state.cart.items.find(item => item.product.id === productId);

export const selectIsProductInCart = (productId: string) => (state: RootState): boolean =>
  state.cart.items.some(item => item.product.id === productId);

// ==================================================================
// TRANSACTION SELECTORS
// ==================================================================

export const selectTransactions = (state: RootState) => 
  state.transactions.items;

export const selectTransactionsLoading = (state: RootState): boolean => 
  state.transactions.isLoading;

export const selectTransactionsError = (state: RootState): string | null => 
  state.transactions.error;

export const selectCurrentTransaction = (state: RootState): string | null => 
  state.transactions.currentTransaction;

// ==================================================================
// COMPUTED SELECTORS
// ==================================================================

export const selectCartSummary = (state: RootState) => ({
  itemsCount: selectCartItemsCount(state),
  total: selectCartTotal(state),
  items: selectCartItems(state),
});

export const selectCheckoutData = (state: RootState) => ({
  items: selectCartItems(state),
  total: selectCartTotal(state),
  itemsCount: selectCartItemsCount(state),
});

