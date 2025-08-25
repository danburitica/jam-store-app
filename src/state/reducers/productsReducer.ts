// ==================================================================
// PRODUCTS REDUCER - PATRÓN FLUX
// ==================================================================

import { ACTION_TYPES } from '../../shared/constants';
import { Product, LoadingState, BaseAction } from '../../shared/types';

// Estado inicial del reducer de productos
export interface ProductsState extends LoadingState {
  items: Product[];
  selectedCategory: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

// Reducer de productos
export const productsReducer = (
  state: ProductsState = initialState,
  action: BaseAction
): ProductsState => {
  switch (action.type) {
    case ACTION_TYPES.PRODUCTS.FETCH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ACTION_TYPES.PRODUCTS.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload ? [...action.payload] : [], // Validar payload antes de hacer spread
        error: null,
      };

    case ACTION_TYPES.PRODUCTS.FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

