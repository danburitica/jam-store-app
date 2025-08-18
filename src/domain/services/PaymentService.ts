// ==================================================================
// PAYMENT SERVICE INTERFACE - CAPA DOMAIN
// ==================================================================

import { CartItem } from '../entities/CartItem';

/**
 * Interface para el servicio de pagos
 * Define las operaciones relacionadas con el procesamiento de pagos
 */
export interface PaymentService {
  /**
   * Procesa un pago con tarjeta de crédito
   */
  processPayment(
    items: CartItem[],
    total: number,
    cardData: CreditCardData
  ): Promise<PaymentResult>;

  /**
   * Valida los datos de una tarjeta de crédito
   */
  validateCreditCard(cardData: CreditCardData): boolean;
}

/**
 * Datos de tarjeta de crédito para el pago
 */
export interface CreditCardData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

/**
 * Resultado del procesamiento de pago
 */
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  timestamp: number;
}

