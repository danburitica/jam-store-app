// ==================================================================
// TIPOS GLOBALES DE LA APLICACIÓN
// ==================================================================

// Estado global de la aplicación
export interface RootState {
  // Aquí se agregarán los estados de cada feature
}

// Action base genérica
export interface BaseAction {
  type: string;
  payload?: any;
}

// Estados de carga para operaciones asíncronas
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Tipos para la entidad Producto (simplificada)
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

// Tipos para el carrito de compras
export interface CartItem {
  product: Product;
  quantity: number;
}

// Tipos para transacciones
export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  encryptedData: string; // Datos cifrados de la transacción
}

// Tipos para autenticación (si se necesita en el futuro)
export interface User {
  id: string;
  email: string;
  name: string;
}

