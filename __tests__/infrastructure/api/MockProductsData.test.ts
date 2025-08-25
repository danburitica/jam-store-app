// ==================================================================
// MOCK PRODUCTS DATA TESTS - CAPA INFRASTRUCTURE
// ==================================================================

import { MOCK_PRODUCTS, MockProductRepository } from '../../../src/infrastructure/api/MockProductsData';

describe('MockProductsData', () => {
  describe('MOCK_PRODUCTS Array', () => {
    it('should contain the expected number of products', () => {
      expect(MOCK_PRODUCTS).toHaveLength(8);
    });

    it('should have products with correct structure', () => {
      MOCK_PRODUCTS.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('image');
      });
    });

    it('should have unique product IDs', () => {
      const ids = MOCK_PRODUCTS.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(MOCK_PRODUCTS.length);
    });

    it('should contain specific products', () => {
      const productNames = MOCK_PRODUCTS.map(p => p.name);
      expect(productNames).toContain('Guitarra Acústica');
      expect(productNames).toContain('Piano Digital');
      expect(productNames).toContain('Batería Completa');
    });
  });

  describe('MockProductRepository Class', () => {
    let repository: MockProductRepository;

    beforeEach(() => {
      repository = new MockProductRepository();
    });

    describe('getAllProducts', () => {
      it('should return all products', async () => {
        const products = await repository.getAllProducts();
        expect(products).toHaveLength(8);
        expect(products).toEqual(MOCK_PRODUCTS);
      });

      it('should return products array', async () => {
        const products1 = await repository.getAllProducts();
        const products2 = await repository.getAllProducts();
        expect(products1).toEqual(products2);
        expect(products1).toHaveLength(8);
      });
    });

    describe('getProductById', () => {
      it('should return product by valid ID', async () => {
        const product = await repository.getProductById('1');
        expect(product).toBeDefined();
        expect(product?.id).toBe('1');
        expect(product?.name).toBe('Guitarra Acústica');
      });

      it('should return null for non-existent ID', async () => {
        const product = await repository.getProductById('999');
        expect(product).toBeNull();
      });

      it('should return null for empty ID', async () => {
        const product = await repository.getProductById('');
        expect(product).toBeNull();
      });
    });
  });
});

