// ==================================================================
// PRODUCT ENTITY - CAPA DOMAIN (SIMPLIFICADA)
// ==================================================================

/**
 * Entidad Product que representa un instrumento musical
 * Versión simplificada sin categorías ni complejidad innecesaria
 */
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly description?: string,
    public readonly image?: string
  ) {
    this.validateProduct();
  }

  /**
   * Valida que los datos esenciales del producto sean correctos
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
  }

  /**
   * Obtiene el precio formateado en COP
   */
  public getFormattedPrice(): string {
    return `$${this.price.toLocaleString('es-CO')} COP`;
  }

  /**
   * Obtiene la descripción o un texto por defecto
   */
  public getDescription(): string {
    return this.description || 'Instrumento musical disponible';
  }

  /**
   * Verifica si el producto tiene imagen
   */
  public hasImage(): boolean {
    return !!this.image && this.image.trim() !== '';
  }
}

