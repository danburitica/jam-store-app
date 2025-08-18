// ==================================================================
// PRODUCT ENTITY - CAPA DOMAIN
// ==================================================================

/**
 * Entidad Product que representa un instrumento musical en el dominio
 * Esta clase encapsula las reglas de negocio relacionadas con los productos
 */
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly imageUrl: string,
    public readonly category: string,
    public readonly stock: number
  ) {
    this.validateProduct();
  }

  /**
   * Valida que los datos del producto sean correctos
   */
  private validateProduct(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Product ID is required');
    }

    if (!this.name || this.name.trim() === '') {
      throw new Error('Product name is required');
    }

    if (this.price < 0) {
      throw new Error('Product price cannot be negative');
    }

    if (this.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }
  }

  /**
   * Verifica si el producto está disponible en stock
   */
  public isAvailable(): boolean {
    return this.stock > 0;
  }

  /**
   * Verifica si hay suficiente stock para una cantidad específica
   */
  public hasEnoughStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  /**
   * Obtiene el precio formateado como string
   */
  public getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }

  /**
   * Crea una copia del producto con stock actualizado
   */
  public updateStock(newStock: number): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.price,
      this.imageUrl,
      this.category,
      newStock
    );
  }
}

