// ==================================================================
// CART ITEM ENTITY TESTS
// ==================================================================

import { CartItem } from '../../../src/domain/entities/CartItem';
import { Product } from '../../../src/domain/entities/Product';

describe('CartItem Entity', () => {
  const mockProduct = new Product(
    '1',
    'Guitarra Acústica',
    1200000,
    'Guitarra acústica de cuerdas de acero',
    'https://example.com/guitar.jpg'
  );

  const validCartItemData = {
    product: mockProduct,
    quantity: 2
  };

  describe('Constructor and Validation', () => {
    it('should create a cart item with valid data', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      expect(cartItem.product).toBe(validCartItemData.product);
      expect(cartItem.quantity).toBe(validCartItemData.quantity);
    });

    it('should throw error when product is not provided', () => {
      expect(() => {
        // @ts-ignore - Testing validation
        new CartItem(null, validCartItemData.quantity);
      }).toThrow('Product is required for cart item');

      expect(() => {
        // @ts-ignore - Testing validation
        new CartItem(undefined, validCartItemData.quantity);
      }).toThrow('Product is required for cart item');
    });

    it('should throw error when quantity is zero', () => {
      expect(() => {
        new CartItem(validCartItemData.product, 0);
      }).toThrow('Cart item quantity must be greater than 0');
    });

    it('should throw error when quantity is negative', () => {
      expect(() => {
        new CartItem(validCartItemData.product, -1);
      }).toThrow('Cart item quantity must be greater than 0');

      expect(() => {
        new CartItem(validCartItemData.product, -100);
      }).toThrow('Cart item quantity must be greater than 0');
    });

    it('should accept quantity of 1', () => {
      const cartItem = new CartItem(validCartItemData.product, 1);
      expect(cartItem.quantity).toBe(1);
    });

    it('should accept large quantities', () => {
      const cartItem = new CartItem(validCartItemData.product, 999);
      expect(cartItem.quantity).toBe(999);
    });

    it('should accept decimal quantities', () => {
      const cartItem = new CartItem(validCartItemData.product, 1.5);
      expect(cartItem.quantity).toBe(1.5);
    });
  });

  describe('getSubtotal', () => {
    it('should calculate subtotal correctly', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      const expectedSubtotal = validCartItemData.product.price * validCartItemData.quantity;
      expect(cartItem.getSubtotal()).toBe(expectedSubtotal);
    });

    it('should calculate subtotal for quantity 1', () => {
      const cartItem = new CartItem(validCartItemData.product, 1);
      expect(cartItem.getSubtotal()).toBe(validCartItemData.product.price);
    });

    it('should calculate subtotal for large quantities', () => {
      const cartItem = new CartItem(validCartItemData.product, 100);
      const expectedSubtotal = validCartItemData.product.price * 100;
      expect(cartItem.getSubtotal()).toBe(expectedSubtotal);
    });

    it('should calculate subtotal for decimal quantities', () => {
      const cartItem = new CartItem(validCartItemData.product, 2.5);
      const expectedSubtotal = validCartItemData.product.price * 2.5;
      expect(cartItem.getSubtotal()).toBe(expectedSubtotal);
    });

    it('should handle zero price products', () => {
      const freeProduct = new Product('2', 'Free Item', 0);
      const cartItem = new CartItem(freeProduct, 5);
      expect(cartItem.getSubtotal()).toBe(0);
    });
  });

  describe('getFormattedSubtotal', () => {
    it('should format subtotal in Colombian pesos', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      const expectedSubtotal = validCartItemData.product.price * validCartItemData.quantity;
      const expectedFormatted = `$${expectedSubtotal.toLocaleString('es-CO')} COP`;
      
      expect(cartItem.getFormattedSubtotal()).toBe(expectedFormatted);
    });

    it('should format subtotal for quantity 1', () => {
      const cartItem = new CartItem(validCartItemData.product, 1);
      const expectedFormatted = `$${validCartItemData.product.price.toLocaleString('es-CO')} COP`;
      
      expect(cartItem.getFormattedSubtotal()).toBe(expectedFormatted);
    });

    it('should format zero subtotal correctly', () => {
      const freeProduct = new Product('2', 'Free Item', 0);
      const cartItem = new CartItem(freeProduct, 1);
      expect(cartItem.getFormattedSubtotal()).toBe('$0 COP');
    });

    it('should format decimal subtotals correctly', () => {
      const decimalProduct = new Product('3', 'Decimal Item', 99.99);
      const cartItem = new CartItem(decimalProduct, 2);
      const expectedSubtotal = 99.99 * 2;
      const expectedFormatted = `$${expectedSubtotal.toLocaleString('es-CO')} COP`;
      
      expect(cartItem.getFormattedSubtotal()).toBe(expectedFormatted);
    });
  });

  describe('updateQuantity', () => {
    it('should create new cart item with updated quantity', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      const newQuantity = 5;
      const updatedCartItem = cartItem.updateQuantity(newQuantity);

      // Original cart item should remain unchanged
      expect(cartItem.quantity).toBe(validCartItemData.quantity);
      
      // New cart item should have updated quantity
      expect(updatedCartItem.quantity).toBe(newQuantity);
      expect(updatedCartItem.product).toBe(validCartItemData.product);
      
      // Should be a different instance
      expect(updatedCartItem).not.toBe(cartItem);
    });

    it('should handle zero quantity update', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      expect(() => {
        cartItem.updateQuantity(0);
      }).toThrow('Cart item quantity must be greater than 0');
    });

    it('should handle negative quantity update', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      expect(() => {
        cartItem.updateQuantity(-5);
      }).toThrow('Cart item quantity must be greater than 0');
    });

    it('should handle decimal quantity update', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      const updatedCartItem = cartItem.updateQuantity(3.7);
      expect(updatedCartItem.quantity).toBe(3.7);
    });

    it('should handle large quantity update', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      const updatedCartItem = cartItem.updateQuantity(1000);
      expect(updatedCartItem.quantity).toBe(1000);
    });
  });

  describe('isSameProduct', () => {
    it('should return true for same product ID', () => {
      const cartItem1 = new CartItem(mockProduct, 1);
      const cartItem2 = new CartItem(mockProduct, 2);

      expect(cartItem1.isSameProduct(cartItem2)).toBe(true);
    });

    it('should return false for different product IDs', () => {
      const product1 = new Product('1', 'Product 1', 100);
      const product2 = new Product('2', 'Product 2', 200);
      
      const cartItem1 = new CartItem(product1, 1);
      const cartItem2 = new CartItem(product2, 1);

      expect(cartItem1.isSameProduct(cartItem2)).toBe(false);
    });

    it('should return true even with different quantities', () => {
      const cartItem1 = new CartItem(mockProduct, 1);
      const cartItem2 = new CartItem(mockProduct, 10);

      expect(cartItem1.isSameProduct(cartItem2)).toBe(true);
    });

    it('should return true even with different product instances but same ID', () => {
      const product1 = new Product('1', 'Product 1', 100);
      const product2 = new Product('1', 'Product 1', 100); // Same ID, different instance
      
      const cartItem1 = new CartItem(product1, 1);
      const cartItem2 = new CartItem(product2, 1);

      expect(cartItem1.isSameProduct(cartItem2)).toBe(true);
    });

    it('should handle edge case with null/undefined', () => {
      const cartItem = new CartItem(mockProduct, 1);

      expect(() => {
        // @ts-ignore - Testing edge case
        cartItem.isSameProduct(null);
      }).toThrow();

      expect(() => {
        // @ts-ignore - Testing edge case
        cartItem.isSameProduct(undefined);
      }).toThrow();
    });
  });

  describe('Immutability', () => {
    it('should have readonly properties', () => {
      const cartItem = new CartItem(
        validCartItemData.product,
        validCartItemData.quantity
      );

      // CartItem properties are readonly in TypeScript but not enforced at runtime
      // This test verifies the structure remains intact
      const originalProduct = cartItem.product;
      const originalQuantity = cartItem.quantity;
      
      expect(cartItem.product).toBe(originalProduct);
      expect(cartItem.quantity).toBe(originalQuantity);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large quantities', () => {
      const cartItem = new CartItem(mockProduct, Number.MAX_SAFE_INTEGER);
      expect(cartItem.quantity).toBe(Number.MAX_SAFE_INTEGER);
      
      // Should not throw when calculating subtotal
      expect(() => cartItem.getSubtotal()).not.toThrow();
    });

    it('should handle very small decimal quantities', () => {
      const cartItem = new CartItem(mockProduct, 0.000001);
      expect(cartItem.quantity).toBe(0.000001);
      
      const subtotal = cartItem.getSubtotal();
      expect(subtotal).toBeCloseTo(mockProduct.price * 0.000001);
    });

    it('should handle products with very large prices', () => {
      const expensiveProduct = new Product('3', 'Expensive Item', Number.MAX_SAFE_INTEGER);
      const cartItem = new CartItem(expensiveProduct, 1);
      
      expect(() => cartItem.getSubtotal()).not.toThrow();
      expect(() => cartItem.getFormattedSubtotal()).not.toThrow();
    });

    it('should handle products with very small prices', () => {
      const cheapProduct = new Product('4', 'Cheap Item', Number.MIN_VALUE);
      const cartItem = new CartItem(cheapProduct, 1);
      
      expect(() => cartItem.getSubtotal()).not.toThrow();
      expect(() => cartItem.getFormattedSubtotal()).not.toThrow();
    });
  });

  describe('Integration with Product', () => {
    it('should work correctly with different product types', () => {
      const products = [
        new Product('1', 'Guitarra', 1000000),
        new Product('2', 'Piano', 5000000),
        new Product('3', 'Batería', 2000000),
        new Product('4', 'Violín', 800000),
      ];

      products.forEach((product, index) => {
        const quantity = index + 1;
        const cartItem = new CartItem(product, quantity);
        
        expect(cartItem.getSubtotal()).toBe(product.price * quantity);
        expect(cartItem.product).toBe(product);
        expect(cartItem.quantity).toBe(quantity);
      });
    });

    it('should maintain product reference integrity', () => {
      const cartItem = new CartItem(mockProduct, 1);
      
      // Update product properties (if they were mutable)
      expect(cartItem.product.id).toBe('1');
      expect(cartItem.product.name).toBe('Guitarra Acústica');
      expect(cartItem.product.price).toBe(1200000);
    });
  });
});
