// ==================================================================
// TRANSACTION SERVICE TESTS
// ==================================================================

import { TransactionService, TransactionRequest, TransactionResponse, TransactionError } from '../../../src/infrastructure/api/TransactionService';
import { ENVIRONMENT, getApiUrl } from '../../../src/shared/config/environment';

// Mock fetch globally
global.fetch = jest.fn();

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  const mockTransactionRequest: TransactionRequest = {
    cardNumber: '4111111111111111',
    cvc: '123',
    expMonth: '12',
    expYear: '25',
    cardHolderName: 'John Doe',
    documentNumber: '12345678',
    documentType: 'CC',
    amountInCents: 100000,
    customerEmail: 'test@example.com',
    installments: 1
  };

  const mockTransactionResponse: TransactionResponse = {
    transactionId: 'txn_123456',
    status: 'APPROVED',
    externalTransactionId: 'ext_789',
    reference: 'REF_001',
    amount: 100000,
    currency: 'COP',
    message: 'Transaction approved',
    attempts: 1
  };

  beforeEach(() => {
    transactionService = new TransactionService();
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockClear();
    
    // Reset console.log mock
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct timeout', () => {
      expect(transactionService).toBeInstanceOf(TransactionService);
      // Access private property for testing
      expect((transactionService as any).timeout).toBe(ENVIRONMENT.REQUEST_TIMEOUT);
    });
  });

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTransactionResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await transactionService.createTransaction(mockTransactionRequest);

      expect(result).toEqual(mockTransactionResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        getApiUrl('transactions'),
        {
          method: 'POST',
          headers: ENVIRONMENT.DEFAULT_HEADERS,
          body: JSON.stringify(mockTransactionRequest)
        }
      );
    });

    it('should handle HTTP error responses', async () => {
      const mockErrorResponse: TransactionError = {
        error: 'VALIDATION_ERROR',
        message: 'Invalid card number',
        statusCode: 400
      };

      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue(mockErrorResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('Invalid card number');
    });

    it('should handle HTTP error without JSON response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('JSON parse error'))
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('Error HTTP: 500 Internal Server Error');
    });

    it('should handle network timeout', async () => {
      // Mock setTimeout to trigger timeout immediately
      jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return 1 as any;
      });

      // Mock fetch to never resolve
      mockFetch.mockImplementation(() => new Promise(() => {}));

      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('La conexión tardó demasiado. Verifica tu conexión a internet.');
    });

    it('should handle fetch errors', async () => {
      const fetchError = new Error('fetch is not defined');
      mockFetch.mockRejectedValue(fetchError);

      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('Error de conexión. Verifica que el servidor esté disponible.');
    });

    it('should handle invalid server response', async () => {
      const invalidResponse = {
        status: 'APPROVED'
        // Missing transactionId
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(invalidResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('Respuesta del servidor inválida');
    });

    it('should handle response with missing status', async () => {
      const invalidResponse = {
        transactionId: 'txn_123'
        // Missing status
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(invalidResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('Respuesta del servidor inválida');
    });

    it('should handle unknown errors', async () => {
      const unknownError = 'Unknown error type';
      mockFetch.mockRejectedValue(unknownError);

      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('Error desconocido al procesar la transacción');
    });

    it('should handle different transaction statuses', async () => {
      const statuses: Array<'APPROVED' | 'DECLINED' | 'TIMEOUT' | 'FAILED'> = [
        'APPROVED', 'DECLINED', 'TIMEOUT', 'FAILED'
      ];

      for (const status of statuses) {
        const responseWithStatus = { ...mockTransactionResponse, status };
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(responseWithStatus)
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        const result = await transactionService.createTransaction(mockTransactionRequest);
        expect(result.status).toBe(status);
      }
    });

    it('should handle different amount values', async () => {
      const amounts = [0, 100, 1000000, Number.MAX_SAFE_INTEGER];

      for (const amount of amounts) {
        const requestWithAmount = { ...mockTransactionRequest, amountInCents: amount };
        const responseWithAmount = { ...mockTransactionResponse, amount };
        
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(responseWithAmount)
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        const result = await transactionService.createTransaction(requestWithAmount);
        expect(result.amount).toBe(amount);
      }
    });

    it('should handle different installments', async () => {
      const installments = [1, 3, 6, 12, 24];

      for (const installmentsCount of installments) {
        const requestWithInstallments = { ...mockTransactionRequest, installments: installmentsCount };
        
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockTransactionResponse)
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        await transactionService.createTransaction(requestWithInstallments);
        
        expect(mockFetch).toHaveBeenCalledWith(
          getApiUrl('transactions'),
          {
            method: 'POST',
            headers: ENVIRONMENT.DEFAULT_HEADERS,
            body: JSON.stringify(requestWithInstallments)
          }
        );
      }
    });

    it('should handle different document types', async () => {
      const documentTypes = ['CC', 'CE', 'TI', 'PP', 'NIT'];

      for (const docType of documentTypes) {
        const requestWithDocType = { ...mockTransactionRequest, documentType: docType };
        
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockTransactionResponse)
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        await transactionService.createTransaction(requestWithDocType);
        
        expect(mockFetch).toHaveBeenCalledWith(
          getApiUrl('transactions'),
          {
            method: 'POST',
            headers: ENVIRONMENT.DEFAULT_HEADERS,
            body: JSON.stringify(requestWithDocType)
          }
        );
      }
    });

    it('should handle special characters in cardholder name', async () => {
      const specialNames = [
        'José María O\'Connor-Smith',
        'María José García-López',
        'Jean-Pierre Dupont',
        'O\'Brien & Sons'
      ];

      for (const name of specialNames) {
        const requestWithName = { ...mockTransactionRequest, cardHolderName: name };
        
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockTransactionResponse)
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        await transactionService.createTransaction(requestWithName);
        
        expect(mockFetch).toHaveBeenCalledWith(
          getApiUrl('transactions'),
          {
            method: 'POST',
            headers: ENVIRONMENT.DEFAULT_HEADERS,
            body: JSON.stringify(requestWithName)
          }
        );
      }
    });

    it('should handle different email formats', async () => {
      const emails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
        'UPPERCASE@EMAIL.COM'
      ];

      for (const email of emails) {
        const requestWithEmail = { ...mockTransactionRequest, customerEmail: email };
        
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockTransactionResponse)
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        await transactionService.createTransaction(requestWithEmail);
        
        expect(mockFetch).toHaveBeenCalledWith(
          getApiUrl('transactions'),
          {
            method: 'POST',
            headers: ENVIRONMENT.DEFAULT_HEADERS,
            body: JSON.stringify(requestWithEmail)
          }
        );
      }
    });
  });

  describe('healthCheck', () => {
    it('should return true when service is healthy', async () => {
      const mockResponse = {
        ok: true
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await transactionService.healthCheck();

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        getApiUrl('health'),
        {
          method: 'GET',
          headers: ENVIRONMENT.DEFAULT_HEADERS
        }
      );
    });

    it('should return false when service is unhealthy', async () => {
      const mockResponse = {
        ok: false
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await transactionService.healthCheck();

      expect(result).toBe(false);
    });

    it('should return false when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await transactionService.healthCheck();

      expect(result).toBe(false);
    });

    it('should handle different HTTP status codes', async () => {
      const statusCodes = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503];

      for (const statusCode of statusCodes) {
        const mockResponse = {
          ok: statusCode >= 200 && statusCode < 300
        };
        mockFetch.mockResolvedValue(mockResponse as any);

        const result = await transactionService.healthCheck();
        const expectedResult = statusCode >= 200 && statusCode < 300;
        
        expect(result).toBe(expectedResult);
      }
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete transaction flow', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTransactionResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Create transaction
      const transactionResult = await transactionService.createTransaction(mockTransactionRequest);
      expect(transactionResult.status).toBe('APPROVED');

      // Check health
      const healthResult = await transactionService.healthCheck();
      expect(healthResult).toBe(true);

      // Verify fetch was called twice
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle error flow and recovery', async () => {
      // First call fails
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({
          error: 'SERVER_ERROR',
          message: 'Internal server error'
        })
      };
      mockFetch.mockResolvedValueOnce(mockErrorResponse as any);

      // Transaction creation should fail
      await expect(transactionService.createTransaction(mockTransactionRequest))
        .rejects.toThrow('Internal server error');

      // Second call succeeds for health check
      const mockHealthResponse = { ok: true };
      mockFetch.mockResolvedValueOnce(mockHealthResponse as any);

      const healthResult = await transactionService.healthCheck();
      expect(healthResult).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings in request fields', async () => {
      const requestWithEmptyFields = {
        ...mockTransactionRequest,
        cardHolderName: '',
        customerEmail: '',
        documentNumber: ''
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTransactionResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(requestWithEmptyFields)).resolves.toBeDefined();
    });

    it('should handle very long field values', async () => {
      const longValue = 'a'.repeat(10000);
      const requestWithLongFields = {
        ...mockTransactionRequest,
        cardHolderName: longValue,
        customerEmail: `${longValue}@example.com`
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTransactionResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(requestWithLongFields)).resolves.toBeDefined();
    });

    it('should handle extreme numeric values', async () => {
      const requestWithExtremeValues = {
        ...mockTransactionRequest,
        amountInCents: Number.MAX_SAFE_INTEGER,
        installments: Number.MAX_SAFE_INTEGER
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTransactionResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(requestWithExtremeValues)).resolves.toBeDefined();
    });

    it('should handle special characters in all text fields', async () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
      const requestWithSpecialChars = {
        ...mockTransactionRequest,
        cardHolderName: `John ${specialChars} Doe`,
        customerEmail: `test${specialChars}@example.com`,
        documentNumber: `123${specialChars}456`
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTransactionResponse)
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(transactionService.createTransaction(requestWithSpecialChars)).resolves.toBeDefined();
    });
  });
});
