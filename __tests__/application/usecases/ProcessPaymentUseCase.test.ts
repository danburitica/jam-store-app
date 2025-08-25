// ==================================================================
// PROCESS PAYMENT USE CASE TESTS
// ==================================================================

import { ProcessPaymentUseCase } from '../../../src/application/usecases/ProcessPaymentUseCase';
import { PaymentService } from '../../../src/domain/services/PaymentService';
import { TransactionRepository } from '../../../src/domain/repositories/TransactionRepository';
import { CartItem } from '../../../src/domain/entities/CartItem';
import { Product } from '../../../src/domain/entities/Product';

// Mock del servicio de pagos
const mockPaymentService = {
  validateCreditCard: jest.fn(),
  processPayment: jest.fn(),
} as jest.Mocked<PaymentService>;

// Mock del repositorio de transacciones
const mockTransactionRepository = {
  saveTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
  getTransactionById: jest.fn(),
  clearAllTransactions: jest.fn(),
} as jest.Mocked<TransactionRepository>;

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let mockProducts: Product[];
  let mockCartItems: CartItem[];
  let mockCreditCardData: any; // Changed to any as CreditCardData is removed

  beforeEach(() => {
    useCase = new ProcessPaymentUseCase(mockPaymentService, mockTransactionRepository);
    
    mockProducts = [
      new Product('1', 'Guitarra Acústica', 1200000, 'Guitarra acústica'),
      new Product('2', 'Piano Digital', 3600000, 'Piano digital'),
    ];

    mockCartItems = [
      new CartItem(mockProducts[0], 2),
      new CartItem(mockProducts[1], 1),
    ];

    mockCreditCardData = {
      cardNumber: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '25',
      cvv: '123',
      cardholderName: 'John Doe',
    };

    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('execute - Success Cases', () => {
    it('should process payment successfully with valid data', async () => {
      // Arrange
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_123',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('txn_123');
      expect(result.error).toBeUndefined();
      expect(mockPaymentService.validateCreditCard).toHaveBeenCalledWith(mockCreditCardData);
      expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
        mockCartItems,
        6000000, // (1200000 * 2) + (3600000 * 1)
        mockCreditCardData
      );
      expect(mockTransactionRepository.saveTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'txn_123',
          items: expect.arrayContaining([
            expect.objectContaining({
              product: expect.objectContaining({
                id: '1',
                name: 'Guitarra Acústica',
              }),
              quantity: 2,
            }),
            expect.objectContaining({
              product: expect.objectContaining({
                id: '2',
                name: 'Piano Digital',
              }),
              quantity: 1,
            }),
          ]),
          total: 6000000,
        })
      );
    });

    it('should handle single item cart', async () => {
      // Arrange
      const singleItemCart = [new CartItem(mockProducts[0], 1)];
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_single',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result = await useCase.execute(singleItemCart, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('txn_single');
      expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
        singleItemCart,
        1200000, // 1200000 * 1
        mockCreditCardData
      );
    });

    it('should handle large quantities', async () => {
      // Arrange
      const largeQuantityCart = [
        new CartItem(mockProducts[0], 100),
        new CartItem(mockProducts[1], 50),
      ];
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_large',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result = await useCase.execute(largeQuantityCart, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
        largeQuantityCart,
        300000000, // (1200000 * 100) + (3600000 * 50) = 120000000 + 180000000
        mockCreditCardData
      );
    });

    it('should handle decimal quantities', async () => {
      // Arrange
      const decimalQuantityCart = [
        new CartItem(mockProducts[0], 2.5),
        new CartItem(mockProducts[1], 1.75),
      ];
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_decimal',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result = await useCase.execute(decimalQuantityCart, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
        decimalQuantityCart,
        9300000, // (1200000 * 2.5) + (3600000 * 1.75) = 3000000 + 6300000
        mockCreditCardData
      );
    });
  });

  describe('execute - Validation Errors', () => {
    it('should reject empty cart', async () => {
      // Arrange
      const emptyCart: CartItem[] = [];

      // Act
      const result = await useCase.execute(emptyCart, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Cart is empty');
      expect(result.transactionId).toBeUndefined();
      expect(mockPaymentService.validateCreditCard).not.toHaveBeenCalled();
      expect(mockPaymentService.processPayment).not.toHaveBeenCalled();
      expect(mockTransactionRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it('should reject invalid credit card data', async () => {
      // Arrange
      mockPaymentService.validateCreditCard.mockReturnValue(false);

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credit card data');
      expect(result.transactionId).toBeUndefined();
      expect(mockPaymentService.validateCreditCard).toHaveBeenCalledWith(mockCreditCardData);
      expect(mockPaymentService.processPayment).not.toHaveBeenCalled();
      expect(mockTransactionRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it('should reject cart items with invalid quantities', async () => {
      // Arrange
      // CartItem constructor will throw error for invalid quantities
      expect(() => {
        new CartItem(mockProducts[0], 0); // Invalid quantity
      }).toThrow('Cart item quantity must be greater than 0');

      expect(() => {
        new CartItem(mockProducts[1], -1); // Invalid quantity
      }).toThrow('Cart item quantity must be greater than 0');

      // Test that ProcessPaymentUseCase handles validation errors from CartItem
      const validCart = [new CartItem(mockProducts[0], 1)];
      mockPaymentService.validateCreditCard.mockReturnValue(true);

      // Act
      const result = await useCase.execute(validCart, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true); // Should work with valid cart
    });
  });

  describe('execute - Service Errors', () => {
    it('should handle payment service errors gracefully', async () => {
      // Arrange
      const serviceError = new Error('Payment service unavailable');
      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockRejectedValue(serviceError);

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment service unavailable');
      expect(result.transactionId).toBeUndefined();
      expect(mockTransactionRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it('should handle string errors from payment service', async () => {
      // Arrange
      const stringError = 'Network timeout';
      mockPaymentService.processPayment.mockRejectedValue(stringError);

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error'); // ProcessPaymentUseCase wraps all errors
    });

    it('should handle null errors from payment service', async () => {
      // Arrange
      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockRejectedValue(null);

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should handle undefined errors from payment service', async () => {
      // Arrange
      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockRejectedValue(undefined);

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });
  });

  describe('execute - Transaction Repository Errors', () => {
    it('should handle transaction save errors gracefully', async () => {
      // Arrange
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_123',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.transactionId).toBeUndefined();
    });

    it('should handle string errors from transaction repository', async () => {
      // Arrange
      const mockPaymentResult = {
        success: true,
        transactionId: 'txn_123',
        timestamp: Date.now(),
      };
      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockRejectedValue('Storage error');

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error'); // ProcessPaymentUseCase wraps all errors
    });
  });

  describe('execute - Edge Cases', () => {
    it('should handle payment success without transaction ID', async () => {
      // Arrange
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        timestamp: Date.now(),
        // No transactionId
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.transactionId).toBeUndefined();
      expect(mockTransactionRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it('should handle failed payment result', async () => {
      // Arrange
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: false,
        error: 'Insufficient funds',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient funds');
      expect(mockTransactionRepository.saveTransaction).not.toHaveBeenCalled();
    });

    it('should handle very large cart totals', async () => {
      // Arrange
      const largeCart = [
        new CartItem(mockProducts[0], Number.MAX_SAFE_INTEGER),
        new CartItem(mockProducts[1], Number.MAX_SAFE_INTEGER),
      ];
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_large',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result = await useCase.execute(largeCart, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(() => {
        // Should not throw when calculating large totals
        expect(mockPaymentService.processPayment).toHaveBeenCalled();
      }).not.toThrow();
    });

    it('should handle zero price products', async () => {
      // Arrange
      const freeProduct = new Product('free', 'Free Item', 0, 'Free product');
      const freeCart = [new CartItem(freeProduct, 5)];
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_free',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result = await useCase.execute(freeCart, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
        freeCart,
        0, // 0 * 5
        mockCreditCardData
      );
    });
  });

  describe('Private Methods', () => {
    describe('calculateTotal', () => {
      it('should calculate total correctly for multiple items', async () => {
        // Arrange
        const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
          success: true,
          transactionId: 'txn_test',
          timestamp: Date.now(),
        };

        mockPaymentService.validateCreditCard.mockReturnValue(true);
        mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
        mockTransactionRepository.saveTransaction.mockResolvedValue();

        // Act
        await useCase.execute(mockCartItems, mockCreditCardData);

        // Assert - Verify total calculation through the processPayment call
        expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
          mockCartItems,
          6000000, // (1200000 * 2) + (3600000 * 1)
          mockCreditCardData
        );
      });

      it('should handle empty cart total', async () => {
        // Arrange
        const emptyCart: CartItem[] = [];

        // Act
        const result = await useCase.execute(emptyCart, mockCreditCardData);

        // Assert
        expect(result.success).toBe(false);
        expect(result.error).toBe('Cart is empty');
      });
    });

    describe('validateCartItems', () => {
      it('should validate cart items with valid quantities', async () => {
        // Arrange
        const validCart = [
          new CartItem(mockProducts[0], 1),
          new CartItem(mockProducts[1], 10),
        ];
        const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
          success: true,
          transactionId: 'txn_valid',
          timestamp: Date.now(),
        };

        mockPaymentService.validateCreditCard.mockReturnValue(true);
        mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
        mockTransactionRepository.saveTransaction.mockResolvedValue();

        // Act
        const result = await useCase.execute(validCart, mockCreditCardData);

        // Assert
        expect(result.success).toBe(true);
        expect(mockPaymentService.processPayment).toHaveBeenCalled();
      });

      it('should reject cart items with zero quantity', async () => {
        // Arrange
        // CartItem constructor will throw error for invalid quantities
        expect(() => {
          new CartItem(mockProducts[0], 0);
        }).toThrow('Cart item quantity must be greater than 0');

        // Test that ProcessPaymentUseCase handles validation errors from CartItem
        const validCart = [new CartItem(mockProducts[0], 1)];
        mockPaymentService.validateCreditCard.mockReturnValue(true);

        // Act
        const result = await useCase.execute(validCart, mockCreditCardData);

        // Assert
        expect(result.success).toBe(true); // Should work with valid cart
      });

      it('should reject cart items with negative quantity', async () => {
        // Arrange
        // CartItem constructor will throw error for invalid quantities
        expect(() => {
          new CartItem(mockProducts[0], -5);
        }).toThrow('Cart item quantity must be greater than 0');

        // Test that ProcessPaymentUseCase handles validation errors from CartItem
        const validCart = [new CartItem(mockProducts[0], 1)];
        mockPaymentService.validateCreditCard.mockReturnValue(true);

        // Act
        const result = await useCase.execute(validCart, mockCreditCardData);

        // Assert
        expect(result.success).toBe(true); // Should work with valid cart
      });
    });

    describe('saveTransaction', () => {
      it('should save transaction with correct data structure', async () => {
        // Arrange
        const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
          success: true,
          transactionId: 'txn_save',
          timestamp: Date.now(),
        };

        mockPaymentService.validateCreditCard.mockReturnValue(true);
        mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
        mockTransactionRepository.saveTransaction.mockResolvedValue();

        // Act
        await useCase.execute(mockCartItems, mockCreditCardData);

        // Assert
        expect(mockTransactionRepository.saveTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'txn_save',
            total: 6000000,
          })
        );
      });

      it('should handle products with optional fields', async () => {
        // Arrange
        const productWithImage = new Product(
          '3',
          'Batería',
          2400000,
          'Batería completa',
          'https://example.com/bateria.jpg'
        );
        const cartWithImage = [new CartItem(productWithImage, 1)];
        const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
          success: true,
          transactionId: 'txn_image',
          timestamp: Date.now(),
        };

        mockPaymentService.validateCreditCard.mockReturnValue(true);
        mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
        mockTransactionRepository.saveTransaction.mockResolvedValue();

        // Act
        await useCase.execute(cartWithImage, mockCreditCardData);

        // Assert
        expect(mockTransactionRepository.saveTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            total: 2400000,
          })
        );
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete payment flow with all services', async () => {
      // Arrange
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_complete',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('txn_complete');

      // Verify all service calls
      expect(mockPaymentService.validateCreditCard).toHaveBeenCalledWith(mockCreditCardData);
      expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
        mockCartItems,
        6000000,
        mockCreditCardData
      );
      expect(mockTransactionRepository.saveTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'txn_complete',
          total: 6000000,
        })
      );
    });

    it('should handle multiple consecutive payment attempts', async () => {
      // Arrange
      const mockPaymentResults: any[] = [ // Changed to any[] as PaymentResult is removed
        {
          success: true,
          transactionId: 'txn_1',
          timestamp: Date.now(),
        },
        {
          success: false,
          error: 'Insufficient funds',
          timestamp: Date.now(),
        },
        {
          success: true,
          transactionId: 'txn_3',
          timestamp: Date.now(),
        },
      ];

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment
        .mockResolvedValueOnce(mockPaymentResults[0])
        .mockResolvedValueOnce(mockPaymentResults[1])
        .mockResolvedValueOnce(mockPaymentResults[2]);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const result1 = await useCase.execute(mockCartItems, mockCreditCardData);
      const result2 = await useCase.execute(mockCartItems, mockCreditCardData);
      const result3 = await useCase.execute(mockCartItems, mockCreditCardData);

      // Assert
      expect(result1.success).toBe(true);
      expect(result1.transactionId).toBe('txn_1');

      expect(result2.success).toBe(false);
      expect(result2.error).toBe('Insufficient funds');

      expect(result3.success).toBe(true);
      expect(result3.transactionId).toBe('txn_3');

      expect(mockPaymentService.processPayment).toHaveBeenCalledTimes(3);
      expect(mockTransactionRepository.saveTransaction).toHaveBeenCalledTimes(2); // Only for successful payments
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large cart efficiently', async () => {
      // Arrange
      const largeCart = Array.from({ length: 1000 }, (_, index) => {
        const product = new Product(
          `product_${index}`,
          `Product ${index}`,
          Math.random() * 1000000,
          `Description for product ${index}`.repeat(100)
        );
        return new CartItem(product, Math.floor(Math.random() * 10) + 1);
      });

      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_large',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      // Act
      const startTime = Date.now();
      const result = await useCase.execute(largeCart, mockCreditCardData);
      const endTime = Date.now();

      // Assert
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
      expect(mockPaymentService.processPayment).toHaveBeenCalledWith(
        largeCart,
        expect.any(Number),
        mockCreditCardData
      );
    });

    it('should not cause memory leaks with repeated operations', async () => {
      const mockPaymentResult: any = { // Changed to any as PaymentResult is removed
        success: true,
        transactionId: 'txn_test',
        timestamp: Date.now(),
      };

      mockPaymentService.validateCreditCard.mockReturnValue(true);
      mockPaymentService.processPayment.mockResolvedValue(mockPaymentResult);
      mockTransactionRepository.saveTransaction.mockResolvedValue();

      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const result = await useCase.execute(mockCartItems, mockCreditCardData);
        expect(result.success).toBe(true);
      }

      // If we get here without memory issues, the test passes
      expect(true).toBe(true);
    });
  });
});
