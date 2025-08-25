// ==================================================================
// MOCK PRODUCTS DATA - CAPA INFRASTRUCTURE
// ==================================================================

import { Product } from '../../shared/types';

/**
 * Datos de ejemplo para instrumentos musicales
 * Lista simple sin categorías ni complejidad
 * Precios directamente en COP (Pesos Colombianos)
 * Imágenes de Pexels (libres de derechos)
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Guitarra Acústica',
    price: 1200000,
    description: 'Guitarra acústica de cuerdas de acero, perfecta para principiantes y músicos intermedios',
    image: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?_gl=1*1rxq8la*_ga*MTI2Mjg3Mzg5OS4xNzU1NTQ3NjQx*_ga_8JE65Q40S6*czE3NTU1NDc2NDEkbzEkZzEkdDE3NTU1NDc3OTUkajU5JGwwJGgw',
  },
  {
    id: '2',
    name: 'Piano Digital',
    price: 3600000,
    description: 'Piano digital de 88 teclas con sonidos realistas y múltiples efectos',
    image: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'Batería Completa',
    price: 2400000,
    description: 'Set completo de batería con platillos incluidos, ideal para rock y pop',
    image: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    name: 'Violín',
    price: 800000,
    description: 'Violín de tamaño completo con estuche incluido, perfecto para clásica',
    image: 'https://images.pexels.com/photos/462447/pexels-photo-462447.jpeg?_gl=1*tj22k8*_ga*MTI2Mjg3Mzg5OS4xNzU1NTQ3NjQx*_ga_8JE65Q40S6*czE3NTU1NDc2NDEkbzEkZzEkdDE3NTU1NDc4MzMkajIxJGwwJGgw',
  },
  {
    id: '5',
    name: 'Saxofón Alto',
    price: 1800000,
    description: 'Saxofón alto en Mi bemol, ideal para jazz y música contemporánea',
    image: 'https://images.pexels.com/photos/45243/saxophone-music-gold-gloss-45243.jpeg?_gl=1*1kmrx0w*_ga*MTI2Mjg3Mzg5OS4xNzU1NTQ3NjQx*_ga_8JE65Q40S6*czE3NTU1NDc2NDEkbzEkZzEkdDE3NTU1NDc4NzYkajQ1JGwwJGgw',
  },
  {
    id: '6',
    name: 'Bajo Eléctrico',
    price: 1600000,
    description: 'Bajo eléctrico de 4 cuerdas con amplificador, sonido profundo y claro',
    image: 'https://images.pexels.com/photos/8285159/pexels-photo-8285159.jpeg?_gl=1*v5o91j*_ga*MTI2Mjg3Mzg5OS4xNzU1NTQ3NjQx*_ga_8JE65Q40S6*czE3NTU1NDc2NDEkbzEkZzEkdDE3NTU1NDc5MDQkajE3JGwwJGgw',
  },
  {
    id: '7',
    name: 'Trompeta',
    price: 1120000,
    description: 'Trompeta en Si bemol con estuche rígido, excelente para bandas y orquestas',
    image: 'https://images.pexels.com/photos/3684446/pexels-photo-3684446.jpeg?_gl=1*5nc0xs*_ga*MTI2Mjg3Mzg5OS4xNzU1NTQ3NjQx*_ga_8JE65Q40S6*czE3NTU1NDc2NDEkbzEkZzEkdDE3NTU1NDc5NjMkajE4JGwwJGgw',
  },
  {
    id: '8',
    name: 'Ukulele',
    price: 360000,
    description: 'Ukulele soprano de caoba, perfecto para comenzar con música hawaiana',
    image: 'https://images.pexels.com/photos/3975587/pexels-photo-3975587.jpeg?_gl=1*1bzl2oq*_ga*MTI2Mjg3Mzg5OS4xNzU1NTQ3NjQx*_ga_8JE65Q40S6*czE3NTU1NDc2NDEkbzEkZzEkdDE3NTU1NDc5NzkkajIkbDAkaDA.',
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
    // Retornar productos inmediatamente para testing
    return MOCK_PRODUCTS;
  }

  /**
   * Simula obtener un producto específico por ID
   */
  async getProductById(id: string): Promise<Product | null> {
    // Retornar producto inmediatamente para testing
    return MOCK_PRODUCTS.find(product => product.id === id) || null;
  }
}
