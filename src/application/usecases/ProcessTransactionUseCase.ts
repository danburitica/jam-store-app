// ==================================================================
// PROCESS TRANSACTION USE CASE - CAPA APPLICATION
// ==================================================================

import { TransactionService, TransactionRequest, TransactionResponse } from '../../infrastructure/api/TransactionService';

export interface ProcessTransactionRequest {
  cardNumber: string;
  cvc: string;
  expiryDate: string; // Formato: "MM/YY"
  cardholderName: string;
  documentNumber: string;
  documentType: string;
  amount: number; // En COP (pesos colombianos)
  customerEmail: string;
  installments: number;
}

export interface ProcessTransactionResult {
  success: boolean;
  transaction?: TransactionResponse;
  error?: string;
}

export class ProcessTransactionUseCase {
  constructor(private transactionService: TransactionService) {}

  /**
   * Ejecuta el procesamiento de la transacción
   */
  async execute(request: ProcessTransactionRequest): Promise<ProcessTransactionResult> {
    try {
      // Validar datos de entrada
      const validationError = this.validateRequest(request);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      // Convertir formato de fecha de expiración
      const { expMonth, expYear } = this.parseExpiryDate(request.expiryDate);
      console.log('📅 Fecha parseada:', { original: request.expiryDate, month: expMonth, year: expYear });

      // Convertir monto a centavos
      const amountInCents = Math.round(request.amount * 100);

      // Preparar datos para el servicio
      const transactionData: TransactionRequest = {
        cardNumber: request.cardNumber.replace(/\s+/g, ''), // Remover espacios
        cvc: request.cvc,
        expMonth,
        expYear,
        cardHolderName: request.cardholderName.trim(),
        documentNumber: request.documentNumber.trim(),
        documentType: request.documentType,
        amountInCents,
        customerEmail: request.customerEmail.trim().toLowerCase(),
        installments: request.installments,
      };

      console.log('📋 Datos preparados para el servicio:', transactionData);

      // Procesar transacción
      const transaction = await this.transactionService.createTransaction(transactionData);

      return {
        success: true,
        transaction,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar la transacción',
      };
    }
  }

  /**
   * Valida los datos de entrada
   */
  private validateRequest(request: ProcessTransactionRequest): string | null {
    if (!request.cardNumber || request.cardNumber.replace(/\s+/g, '').length < 13) {
      return 'Número de tarjeta inválido';
    }

    if (!request.cvc || request.cvc.length < 3) {
      return 'CVC inválido';
    }

    if (!request.expiryDate || !/^\d{2}\/\d{2}$/.test(request.expiryDate)) {
      return 'Fecha de expiración inválida';
    }

    if (!request.cardholderName || request.cardholderName.trim().length < 5) {
      return 'Nombre del titular debe tener al menos 5 caracteres';
    }

    if (!request.documentNumber || request.documentNumber.trim().length < 5) {
      return 'Número de documento inválido';
    }

    if (!request.documentType) {
      return 'Tipo de documento requerido';
    }

    if (!request.amount || request.amount <= 0) {
      return 'Monto inválido';
    }

    if (!request.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.customerEmail)) {
      return 'Email inválido';
    }

    if (!request.installments || request.installments < 1) {
      return 'Número de cuotas inválido';
    }

    return null;
  }

  /**
   * Parsea la fecha de expiración del formato "MM/YY" a mes y año separados
   */
  private parseExpiryDate(expiryDate: string): { expMonth: string; expYear: string } {
    const [month, year] = expiryDate.split('/');
    
    // Mantener el año en formato de 2 dígitos (ej: "25" en lugar de "2025")
    const twoDigitYear = year.length === 4 ? year.slice(-2) : year;
    
    return {
      expMonth: month,
      expYear: twoDigitYear,
    };
  }
}
