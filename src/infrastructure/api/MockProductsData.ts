// ==================================================================
// MOCK PRODUCTS DATA - CAPA INFRASTRUCTURE
// ==================================================================

import { Product } from '../../shared/types';

/**
 * Datos de ejemplo para instrumentos musicales
 * Lista simple sin categorías ni complejidad
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Guitarra Acústica',
    price: 299.99,
    description: 'Guitarra acústica de cuerdas de acero, perfecta para principiantes',
    image: 'https://via.placeholder.com/200x200?text=Guitarra',
  },
  {
    id: '2',
    name: 'Piano Digital',
    price: 899.99,
    description: 'Piano digital de 88 teclas con sonidos realistas',
    image: 'https://via.placeholder.com/200x200?text=Piano',
  },
  {
    id: '3',
    name: 'Batería Completa',
    price: 599.99,
    description: 'Set completo de batería con platillos incluidos',
    image: 'https://via.placeholder.com/200x200?text=Batería',
  },
  {
    id: '4',
    name: 'Violín',
    price: 199.99,
    description: 'Violín de tamaño completo con estuche incluido',
    image: 'https://via.placeholder.com/200x200?text=Violín',
  },
  {
    id: '5',
    name: 'Saxofón Alto',
    price: 449.99,
    description: 'Saxofón alto en Mi bemol, ideal para jazz',
    image: 'https://via.placeholder.com/200x200?text=Saxofón',
  },
  {
    id: '6',
    name: 'Bajo Eléctrico',
    price: 399.99,
    description: 'Bajo eléctrico de 4 cuerdas con amplificador',
    image: 'https://via.placeholder.com/200x200?text=Bajo',
  },
  {
    id: '7',
    name: 'Trompeta',
    price: 279.99,
    description: 'Trompeta en Si bemol con estuche rígido',
    image: 'https://via.placeholder.com/200x200?text=Trompeta',
  },
  {
    id: '8',
    name: 'Ukulele',
    price: 89.99,
    description: 'Ukulele soprano de caoba, perfecto para comenzar',
    image: 'https://via.placeholder.com/200x200?text=Ukulele',
  },
];

/**
 * Implementación mock del repositorio de productos
 * Simula llamadas a una API externa
 */
export class MockProductRepository {
  /**
   * Simula obtener todos los productos de una API
   */
  async getAllProducts(): Promise<Product[]> {
    // Simular delay de red
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    return MOCK_PRODUCTS;
  }

  /**
   * Simula obtener un producto específico por ID
   */
  async getProductById(id: string): Promise<Product | null> {
    // Simular delay de red
    await new Promise<void>(resolve => setTimeout(() => resolve(), 200));
    return MOCK_PRODUCTS.find(product => product.id === id) || null;
  }
}
