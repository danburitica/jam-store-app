// ==================================================================
// PRODUCT REPOSITORY INTERFACE - CAPA DOMAIN (SIMPLIFICADA)
// ==================================================================

import { Product } from '../entities/Product';

/**
 * Interface simplificada para operaciones básicas de productos
 * Solo operaciones esenciales para una tienda mínima
 */
export interface ProductRepository {
  /**
   * Obtiene todos los productos disponibles
   */
  getAllProducts(): Promise<Product[]>;

  /**
   * Obtiene un producto específico por su ID
   */
  getProductById(id: string): Promise<Product | null>;
}

