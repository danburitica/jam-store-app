// ==================================================================
// CONSTANTES GLOBALES DE LA APLICACIÓN
// ==================================================================

// Action Types siguiendo el patrón Flux
export const ACTION_TYPES = {
  // Productos
  PRODUCTS: {
    FETCH_START: 'PRODUCTS/FETCH_START',
    FETCH_SUCCESS: 'PRODUCTS/FETCH_SUCCESS',
    FETCH_ERROR: 'PRODUCTS/FETCH_ERROR',
  },
  
  // Carrito de compras
  CART: {
    ADD_ITEM: 'CART/ADD_ITEM',
    REMOVE_ITEM: 'CART/REMOVE_ITEM',
    UPDATE_QUANTITY: 'CART/UPDATE_QUANTITY',
    CLEAR_CART: 'CART/CLEAR_CART',
  },
  
  // Transacciones
  TRANSACTIONS: {
    PROCESS_START: 'TRANSACTIONS/PROCESS_START',
    PROCESS_SUCCESS: 'TRANSACTIONS/PROCESS_SUCCESS',
    PROCESS_ERROR: 'TRANSACTIONS/PROCESS_ERROR',
  },
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
  // Configuración de responsive
  BREAKPOINTS: {
    IPHONE_SE_WIDTH: 375,
    IPHONE_SE_HEIGHT: 667,
    MIN_SUPPORTED_WIDTH: 375,
    MIN_SUPPORTED_HEIGHT: 667,
  },
  
  // Configuración de storage
  STORAGE_KEYS: {
    TRANSACTIONS: '@jamstore_transactions',
    CART: '@jamstore_cart',
    USER_PREFERENCES: '@jamstore_preferences',
  },
  
  // Configuración de cifrado
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_LENGTH: 32,
  },
} as const;

// Configuración simple de la tienda
export const STORE_CONFIG = {
  MAX_CART_ITEMS: 10,
  MIN_PRICE: 0,
  CURRENCY_SYMBOL: '$',
  DEFAULT_IMAGE: 'https://via.placeholder.com/200x200?text=Instrumento',
} as const;

