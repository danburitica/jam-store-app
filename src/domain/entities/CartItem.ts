// ==================================================================
// CART ITEM ENTITY - CAPA DOMAIN
// ==================================================================

import { Product } from './Product';

/**
 * Entidad CartItem que representa un item en el carrito de compras
 * Encapsula las reglas de negocio relacionadas con los items del carrito
 */
export class CartItem {
  constructor(
    public readonly product: Product,
    public readonly quantity: number
  ) {
    this.validateCartItem();
  }

  /**
   * Valida que los datos del item del carrito sean correctos
   */
  private validateCartItem(): void {
    if (!this.product) {
      throw new Error('Product is required for cart item');
    }

    if (this.quantity <= 0) {
      throw new Error('Cart item quantity must be greater than 0');
    }

    if (!this.product.hasEnoughStock(this.quantity)) {
      throw new Error(`Not enough stock. Available: ${this.product.stock}, Requested: ${this.quantity}`);
    }
  }

  /**
   * Calcula el subtotal del item (precio * cantidad)
   */
  public getSubtotal(): number {
    return this.product.price * this.quantity;
  }

  /**
   * Obtiene el subtotal formateado como string
   */
  public getFormattedSubtotal(): string {
    return `$${this.getSubtotal().toFixed(2)}`;
  }

  /**
   * Actualiza la cantidad del item
   */
  public updateQuantity(newQuantity: number): CartItem {
    return new CartItem(this.product, newQuantity);
  }

  /**
   * Verifica si este item es del mismo producto que otro
   */
  public isSameProduct(other: CartItem): boolean {
    return this.product.id === other.product.id;
  }
}

