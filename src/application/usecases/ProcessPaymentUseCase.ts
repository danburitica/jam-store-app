// ==================================================================
// PROCESS PAYMENT USE CASE - CAPA APPLICATION
// ==================================================================

import { CartItem } from '../../domain/entities/CartItem';
import { PaymentService, CreditCardData, PaymentResult } from '../../domain/services/PaymentService';
import { TransactionRepository } from '../../domain/repositories/TransactionRepository';
import { Transaction } from '../../shared/types';

/**
 * Caso de uso para procesar pagos
 * Encapsula toda la lógica de negocio relacionada con el procesamiento de pagos
 */
export class ProcessPaymentUseCase {
  constructor(
    private paymentService: PaymentService,
    private transactionRepository: TransactionRepository
  ) {}

  /**
   * Ejecuta el caso de uso para procesar un pago
   */
  async execute(
    cartItems: CartItem[],
    cardData: CreditCardData
  ): Promise<PaymentResult> {
    try {
      // Validar que el carrito no esté vacío
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Validar datos de la tarjeta
      if (!this.paymentService.validateCreditCard(cardData)) {
        throw new Error('Invalid credit card data');
      }

      // Calcular el total
      const total = this.calculateTotal(cartItems);

      // Validar stock de todos los productos
      this.validateStock(cartItems);

      // Procesar el pago
      const paymentResult = await this.paymentService.processPayment(
        cartItems,
        total,
        cardData
      );

      // Si el pago fue exitoso, guardar la transacción
      if (paymentResult.success && paymentResult.transactionId) {
        await this.saveTransaction(cartItems, total, paymentResult.transactionId);
      }

      return paymentResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Calcula el total del carrito
   */
  private calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  /**
   * Valida que todos los productos tengan stock suficiente
   */
  private validateStock(cartItems: CartItem[]): void {
    for (const item of cartItems) {
      if (!item.product.hasEnoughStock(item.quantity)) {
        throw new Error(`Insufficient stock for product: ${item.product.name}`);
      }
    }
  }

  /**
   * Guarda la transacción en el repositorio
   */
  private async saveTransaction(
    cartItems: CartItem[],
    total: number,
    transactionId: string
  ): Promise<void> {
    const transaction: Transaction = {
      id: transactionId,
      items: cartItems.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
          category: item.product.category,
          stock: item.product.stock,
        },
        quantity: item.quantity,
      })),
      total,
      timestamp: Date.now(),
      encryptedData: '', // Será cifrado en la capa de infraestructura
    };

    await this.transactionRepository.saveTransaction(transaction);
  }
}

