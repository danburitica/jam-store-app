// ==================================================================
// GET PRODUCTS USE CASE - CAPA APPLICATION (SIMPLIFICADA)
// ==================================================================

import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

/**
 * Caso de uso simplificado para obtener productos
 * Solo operaciones básicas para una tienda mínima
 */
export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  /**
   * Ejecuta el caso de uso para obtener todos los productos disponibles
   */
  async execute(): Promise<Product[]> {
    try {
      const products = await this.productRepository.getAllProducts();
      
      // Lógica mínima: solo retornar los productos
      // Sin filtros complejos ni validaciones de stock
      return products;
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  /**
   * Obtiene un producto específico por ID
   */
  async executeById(productId: string): Promise<Product | null> {
    try {
      return await this.productRepository.getProductById(productId);
    } catch (error) {
      throw new Error(`Error fetching product by ID: ${error}`);
    }
  }
}

