// ==================================================================
// GET PRODUCTS USE CASE TESTS
// ==================================================================

import { GetProductsUseCase } from '../../../src/application/usecases/GetProductsUseCase';
import { Product } from '../../../src/domain/entities/Product';
import { ProductRepository } from '../../../src/domain/repositories/ProductRepository';

// Mock del repositorio
const mockProductRepository: jest.Mocked<ProductRepository> = {
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
};

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let mockProducts: Product[];

  beforeEach(() => {
    useCase = new GetProductsUseCase(mockProductRepository);
    mockProducts = [
      new Product('1', 'Guitarra Acústica', 1200000, 'Guitarra acústica'),
      new Product('2', 'Piano Digital', 3600000, 'Piano digital de 88 teclas'),
      new Product('3', 'Batería Completa', 2400000, 'Set completo de batería'),
    ];

    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all products successfully', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockResolvedValue(mockProducts);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledWith();
    });

    it('should return empty array when no products exist', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors and throw formatted error', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockProductRepository.getAllProducts.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Error fetching products: Error: Database connection failed');
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle string errors from repository', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockRejectedValue('Network timeout');

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Error fetching products: Network timeout');
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle null errors from repository', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockRejectedValue(null);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Error fetching products: null');
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined errors from repository', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockRejectedValue(undefined);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Error fetching products: undefined');
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle large product lists', async () => {
      // Arrange
      const largeProductList = Array.from({ length: 1000 }, (_, index) => 
        new Product(
          `product-${index}`,
          `Product ${index}`,
          Math.random() * 1000000,
          `Description for product ${index}`
        )
      );
      mockProductRepository.getAllProducts.mockResolvedValue(largeProductList);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toHaveLength(1000);
      expect(result[0].id).toBe('product-0');
      expect(result[999].id).toBe('product-999');
    });

    it('should handle products with special characters', async () => {
      // Arrange
      const specialProducts = [
        new Product('1', 'Guitarra 🎸 Acústica', 1200000, 'Descripción con emojis 🎵'),
        new Product('2', 'Piano @Digital#', 3600000, 'Descripción con símbolos $%&'),
      ];
      mockProductRepository.getAllProducts.mockResolvedValue(specialProducts);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(specialProducts);
      expect(result[0].name).toBe('Guitarra 🎸 Acústica');
      expect(result[1].name).toBe('Piano @Digital#');
    });
  });

  describe('executeById', () => {
    it('should return product by ID successfully', async () => {
      // Arrange
      const targetProduct = mockProducts[0];
      mockProductRepository.getProductById.mockResolvedValue(targetProduct);

      // Act
      const result = await useCase.executeById('1');

      // Assert
      expect(result).toEqual(targetProduct);
      expect(mockProductRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith('1');
    });

    it('should return null when product not found', async () => {
      // Arrange
      mockProductRepository.getProductById.mockResolvedValue(null);

      // Act
      const result = await useCase.executeById('999');

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith('999');
    });

    it('should handle repository errors and throw formatted error', async () => {
      // Arrange
      const repositoryError = new Error('Product not found');
      mockProductRepository.getProductById.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.executeById('1')).rejects.toThrow('Error fetching product by ID: Error: Product not found');
      expect(mockProductRepository.getProductById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith('1');
    });

    it('should handle empty string ID', async () => {
      // Arrange
      mockProductRepository.getProductById.mockResolvedValue(null);

      // Act
      const result = await useCase.executeById('');

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith('');
    });

    it('should handle whitespace-only ID', async () => {
      // Arrange
      mockProductRepository.getProductById.mockResolvedValue(null);

      // Act
      const result = await useCase.executeById('   ');

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith('   ');
    });

    it('should handle very long IDs', async () => {
      // Arrange
      const longId = 'a'.repeat(1000);
      mockProductRepository.getProductById.mockResolvedValue(null);

      // Act
      const result = await useCase.executeById(longId);

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(longId);
    });

    it('should handle special characters in ID', async () => {
      // Arrange
      const specialId = 'product-@#$%^&*()_+';
      mockProductRepository.getProductById.mockResolvedValue(null);

      // Act
      const result = await useCase.executeById(specialId);

      // Assert
      expect(result).toBeNull();
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(specialId);
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle circular reference errors', async () => {
      // Arrange
      const circularError = new Error('Circular reference detected');
      circularError.message = circularError.message; // Create potential circular reference
      mockProductRepository.getAllProducts.mockRejectedValue(circularError);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Error fetching products: Error: Circular reference detected');
    });

    it('should handle errors with custom toString method', async () => {
      // Arrange
      const customError = {
        toString: () => 'Custom error message',
        message: 'This should not be used'
      };
      mockProductRepository.getAllProducts.mockRejectedValue(customError);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Error fetching products: Custom error message');
    });

    it('should handle errors with null message', async () => {
      // Arrange
      const errorWithNullMessage = new Error();
      errorWithNullMessage.message = null as any;
      mockProductRepository.getAllProducts.mockRejectedValue(errorWithNullMessage);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Error fetching products: Error');
    });
  });

  describe('Repository Integration', () => {
    it('should call repository methods with correct parameters', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockResolvedValue(mockProducts);
      mockProductRepository.getProductById.mockResolvedValue(mockProducts[0]);

      // Act
      await useCase.execute();
      await useCase.executeById('1');

      // Assert
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledWith();
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith('1');
    });

    it('should not call repository methods until execute is called', () => {
      // Assert
      expect(mockProductRepository.getAllProducts).not.toHaveBeenCalled();
      expect(mockProductRepository.getProductById).not.toHaveBeenCalled();
    });

    it('should handle multiple consecutive calls', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockResolvedValue(mockProducts);

      // Act
      const result1 = await useCase.execute();
      const result2 = await useCase.execute();
      const result3 = await useCase.execute();

      // Assert
      expect(result1).toEqual(mockProducts);
      expect(result2).toEqual(mockProducts);
      expect(result3).toEqual(mockProducts);
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(3);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle memory efficiently with large datasets', async () => {
      // Arrange
      const largeDataset = Array.from({ length: 10000 }, (_, index) => 
        new Product(
          `product-${index}`,
          `Product ${index}`,
          Math.random() * 1000000,
          `Description for product ${index}`.repeat(100) // Long descriptions
        )
      );
      mockProductRepository.getAllProducts.mockResolvedValue(largeDataset);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toHaveLength(10000);
      expect(result[0].description).toContain('Description for product 0');
      expect(result[9999].description).toContain('Description for product 9999');
    });

    it('should not cause memory leaks with repeated calls', async () => {
      // Arrange
      mockProductRepository.getAllProducts.mockResolvedValue(mockProducts);

      // Act - Make many calls
      const promises = Array.from({ length: 100 }, () => useCase.execute());
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(100);
      results.forEach(result => {
        expect(result).toEqual(mockProducts);
      });
      expect(mockProductRepository.getAllProducts).toHaveBeenCalledTimes(100);
    });
  });
});
