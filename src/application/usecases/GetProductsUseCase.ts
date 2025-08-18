// ==================================================================
// GET PRODUCTS USE CASE - CAPA APPLICATION
// ==================================================================

import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

/**
 * Caso de uso para obtener productos
 * Encapsula la lógica de aplicación para la gestión de productos
 */
export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  /**
   * Ejecuta el caso de uso para obtener todos los productos
   */
  async execute(): Promise<Product[]> {
    try {
      const products = await this.productRepository.getAllProducts();
      
      // Aquí se puede aplicar lógica de negocio adicional
      // como filtrado, ordenamiento, etc.
      return products.filter(product => product.isAvailable());
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  /**
   * Obtiene productos por categoría
   */
  async executeByCategory(category: string): Promise<Product[]> {
    try {
      const products = await this.productRepository.getProductsByCategory(category);
      return products.filter(product => product.isAvailable());
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error}`);
    }
  }

  /**
   * Busca productos por texto
   */
  async executeSearch(query: string): Promise<Product[]> {
    try {
      if (query.trim().length < 2) {
        return [];
      }
      
      const products = await this.productRepository.searchProducts(query);
      return products.filter(product => product.isAvailable());
    } catch (error) {
      throw new Error(`Error searching products: ${error}`);
    }
  }
}

