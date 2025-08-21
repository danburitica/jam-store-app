// ==================================================================
// TRANSACTION SERVICE - CAPA INFRASTRUCTURE
// ==================================================================

import { ENVIRONMENT, getApiUrl } from '../../shared/config/environment';

// Tipos para la transacción
export interface TransactionRequest {
  cardNumber: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolderName: string;
  documentNumber: string;
  documentType: string;
  amountInCents: number;
  customerEmail: string;
  installments: number;
}

export interface TransactionResponse {
  transactionId: string;
  status: 'APPROVED' | 'DECLINED' | 'TIMEOUT' | 'FAILED';
  externalTransactionId?: string;
  reference: string;
  amount: number;
  currency: string;
  message: string;
  attempts: number;
}

export interface TransactionError {
  error: string;
  message: string;
  statusCode?: number;
}

// Clase principal del servicio
export class TransactionService {
  private timeout: number;

  constructor() {
    this.timeout = ENVIRONMENT.REQUEST_TIMEOUT;
  }

  /**
   * Crea una transacción de pago
   */
  async createTransaction(data: TransactionRequest): Promise<TransactionResponse> {
    console.log('🚀 TransactionService.createTransaction - Datos:', data);
    console.log('🌐 URL del backend:', getApiUrl('transactions'));
    
    try {
      // Crear timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La solicitud tardó demasiado')), this.timeout);
      });

      // Crear fetch promise
      console.log('📡 Enviando petición al backend...');
      const fetchPromise = fetch(getApiUrl('transactions'), {
        method: 'POST',
        headers: ENVIRONMENT.DEFAULT_HEADERS,
        body: JSON.stringify(data),
      });

      // Ejecutar con timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData: TransactionError = await response.json().catch(() => ({
          error: 'HTTP_ERROR',
          message: `Error HTTP: ${response.status} ${response.statusText}`,
          statusCode: response.status,
        }));

        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Parsear respuesta exitosa
      const transactionData: TransactionResponse = await response.json();
      
      // Validar que la respuesta tenga los campos requeridos
      if (!transactionData.status || !transactionData.transactionId) {
        throw new Error('Respuesta del servidor inválida');
      }

      return transactionData;

    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error instanceof Error) {
        if (error.message.includes('Timeout')) {
          throw new Error('La conexión tardó demasiado. Verifica tu conexión a internet.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Error de conexión. Verifica que el servidor esté disponible.');
        }
        throw error;
      }
      
      throw new Error('Error desconocido al procesar la transacción');
    }
  }

  /**
   * Verifica si el servicio está disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(getApiUrl('health'), {
        method: 'GET',
        headers: ENVIRONMENT.DEFAULT_HEADERS,
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instancia por defecto del servicio
export const defaultTransactionService = new TransactionService();
