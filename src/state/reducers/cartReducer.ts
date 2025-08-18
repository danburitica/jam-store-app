// ==================================================================
// CART REDUCER - PATRÓN FLUX
// ==================================================================

import { ACTION_TYPES } from '../../shared/constants';
import { CartItem, BaseAction } from '../../shared/types';

// Estado inicial del reducer del carrito
export interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

// Función auxiliar para calcular el total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

// Reducer del carrito
export const cartReducer = (
  state: CartState = initialState,
  action: BaseAction
): CartState => {
  switch (action.type) {
    case ACTION_TYPES.CART.ADD_ITEM: {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar la cantidad
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo al carrito
        newItems = [...state.items, { product, quantity }];
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case ACTION_TYPES.CART.REMOVE_ITEM: {
      const productId = action.payload;
      const newItems = state.items.filter(
        item => item.product.id !== productId
      );

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case ACTION_TYPES.CART.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, remover el item
        const newItems = state.items.filter(
          item => item.product.id !== productId
        );
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        };
      }

      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case ACTION_TYPES.CART.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
      };

    default:
      return state;
  }
};

