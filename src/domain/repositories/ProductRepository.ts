// ==================================================================
// PRODUCT REPOSITORY INTERFACE - CAPA DOMAIN
// ==================================================================

import { Product } from '../entities/Product';

/**
 * Interface que define las operaciones disponibles para los productos
 * Esta interfaz pertenece al dominio y será implementada en la capa de infraestructura
 */
export interface ProductRepository {
  /**
   * Obtiene todos los productos disponibles
   */
  getAllProducts(): Promise<Product[]>;

  /**
   * Obtiene un producto por su ID
   */
  getProductById(id: string): Promise<Product | null>;

  /**
   * Obtiene productos por categoría
   */
  getProductsByCategory(category: string): Promise<Product[]>;

  /**
   * Busca productos por nombre o descripción
   */
  searchProducts(query: string): Promise<Product[]>;

  /**
   * Actualiza el stock de un producto
   */
  updateProductStock(productId: string, newStock: number): Promise<void>;
}

