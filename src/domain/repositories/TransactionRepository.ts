// ==================================================================
// TRANSACTION REPOSITORY INTERFACE - CAPA DOMAIN
// ==================================================================

import { Transaction } from '../../shared/types';

/**
 * Interface que define las operaciones disponibles para las transacciones
 * Esta interfaz pertenece al dominio y será implementada en la capa de infraestructura
 */
export interface TransactionRepository {
  /**
   * Guarda una nueva transacción de forma cifrada
   */
  saveTransaction(transaction: Transaction): Promise<void>;

  /**
   * Obtiene todas las transacciones del usuario
   */
  getAllTransactions(): Promise<Transaction[]>;

  /**
   * Obtiene una transacción por su ID
   */
  getTransactionById(id: string): Promise<Transaction | null>;

  /**
   * Elimina todas las transacciones (para casos como logout)
   */
  clearAllTransactions(): Promise<void>;
}

