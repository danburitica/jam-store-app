// ==================================================================
// PROCESS TRANSACTION USE CASE TESTS
// ==================================================================

import { ProcessTransactionUseCase, ProcessTransactionRequest } from '../../../src/application/usecases/ProcessTransactionUseCase';
import { TransactionService, TransactionResponse } from '../../../src/infrastructure/api/TransactionService';

// Mock del servicio de transacciones
const mockTransactionService = {
  createTransaction: jest.fn(),
  healthCheck: jest.fn(),
} as unknown as jest.Mocked<TransactionService>;

describe('ProcessTransactionUseCase', () => {
  let useCase: ProcessTransactionUseCase;
  let validRequest: ProcessTransactionRequest;

  beforeEach(() => {
    useCase = new ProcessTransactionUseCase(mockTransactionService);
    validRequest = {
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryDate: '12/25',
      cardholderName: 'John Doe',
      documentNumber: '12345678',
      documentType: 'CC',
      amount: 100000,
      customerEmail: 'test@example.com',
      installments: 1,
    };

    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('successful transactions', () => {
    it('should process a valid transaction successfully', async () => {
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 100000,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(true);
      expect(result.transaction).toEqual(mockResponse);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          cardNumber: '4111111111111111',
          cvc: '123',
          expMonth: '12',
          expYear: '25',
          cardHolderName: 'John Doe',
          documentNumber: '12345678',
          documentType: 'CC',
          amountInCents: 10000000,
          customerEmail: 'test@example.com',
          installments: 1,
        })
      );
    });

    it('should handle card number with spaces', async () => {
      const requestWithSpaces = { ...validRequest, cardNumber: '4111 1111 1111 1111' };
      
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 100000,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(requestWithSpaces);

      expect(result.success).toBe(true);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          cardNumber: '4111111111111111', // Should remove spaces
        })
      );
    });

    it('should handle cardholder name with extra spaces', async () => {
      const requestWithSpaces = { ...validRequest, cardholderName: '  John Doe  ' };
      
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 100000,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(requestWithSpaces);

      expect(result.success).toBe(true);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          cardHolderName: 'John Doe', // Should be trimmed
        })
      );
    });

    it('should handle document number with extra spaces', async () => {
      const requestWithSpaces = { ...validRequest, documentNumber: '  12345678  ' };
      
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 100000,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(requestWithSpaces);

      expect(result.success).toBe(true);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          documentNumber: '12345678', // Should be trimmed
        })
      );
    });

    it('should convert amount to cents correctly', async () => {
      const requestWithDecimal = { ...validRequest, amount: 1234.56 };
      
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 123456,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(requestWithDecimal);

      expect(result.success).toBe(true);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amountInCents: 123456, // Should be converted to cents
        })
      );
    });
  });

  describe('validation errors', () => {
    it('should reject invalid card number', async () => {
      const invalidRequest = { ...validRequest, cardNumber: '123' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Número de tarjeta inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject invalid CVC', async () => {
      const invalidRequest = { ...validRequest, cvc: '12' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('CVC inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject invalid expiry date format', async () => {
      const invalidRequest = { ...validRequest, expiryDate: 'invalid-date' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Fecha de expiración inválida');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject expiry date with 4-digit year', async () => {
      const invalidRequest = { ...validRequest, expiryDate: '12/2025' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Fecha de expiración inválida'); // Only MM/YY format is supported
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject short cardholder name', async () => {
      const invalidRequest = { ...validRequest, cardholderName: 'John' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Nombre del titular debe tener al menos 5 caracteres');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject empty cardholder name', async () => {
      const invalidRequest = { ...validRequest, cardholderName: '' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Nombre del titular debe tener al menos 5 caracteres');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject invalid email format', async () => {
      const invalidRequest = { ...validRequest, customerEmail: 'invalid-email' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject empty email', async () => {
      const invalidRequest = { ...validRequest, customerEmail: '' };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject invalid installments', async () => {
      const invalidRequest = { ...validRequest, installments: 0 };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Número de cuotas inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should reject negative installments', async () => {
      const invalidRequest = { ...validRequest, installments: -1 };

      const result = await useCase.execute(invalidRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Número de cuotas inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });
  });

  describe('email handling', () => {
    it('should handle email with extra spaces and case', async () => {
      const requestWithEmailCase = { ...validRequest, customerEmail: 'TEST@EXAMPLE.COM' };
      
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 100000,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(requestWithEmailCase);

      expect(result.success).toBe(true);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          customerEmail: 'test@example.com', // Should be converted to lowercase
        })
      );
    });

    it('should handle email with leading and trailing spaces', async () => {
      const requestWithSpaces = { ...validRequest, customerEmail: 'test@example.com' };
      
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 100000,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(requestWithSpaces);

      expect(result.success).toBe(true);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          customerEmail: 'test@example.com', // Should be trimmed and lowercase
        })
      );
    });
  });

  describe('service errors', () => {
    it('should handle service errors gracefully', async () => {
      const serviceError = new Error('Service unavailable');
      mockTransactionService.createTransaction.mockRejectedValue(serviceError);

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Service unavailable');
    });

    it('should handle unknown errors gracefully', async () => {
      mockTransactionService.createTransaction.mockRejectedValue('Unknown error');

      const result = await useCase.execute(validRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error desconocido al procesar la transacción');
    });
  });

  describe('edge cases', () => {
    it('should handle very large amounts', async () => {
      const largeAmountRequest = { ...validRequest, amount: 999999999.99 };
      
      const mockResponse: TransactionResponse = {
        transactionId: 'txn_123',
        status: 'APPROVED',
        reference: 'ref_123',
        amount: 99999999999,
        currency: 'COP',
        message: 'Transaction approved',
        attempts: 1,
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await useCase.execute(largeAmountRequest);

      expect(result.success).toBe(true);
      expect(mockTransactionService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amountInCents: 99999999999, // Should handle large amounts
        })
      );
    });

    it('should handle zero amount', async () => {
      const zeroAmountRequest = { ...validRequest, amount: 0 };

      const result = await useCase.execute(zeroAmountRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Monto inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });

    it('should handle negative amount', async () => {
      const negativeAmountRequest = { ...validRequest, amount: -100 };

      const result = await useCase.execute(negativeAmountRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Monto inválido');
      expect(mockTransactionService.createTransaction).not.toHaveBeenCalled();
    });
  });
});
