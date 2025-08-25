// ==================================================================
// SHARED TYPES TESTS
// ==================================================================

import {
  RootState,
  BaseAction,
  LoadingState,
  Product,
  CartItem,
  Transaction,
  User
} from '../../src/shared/types';

describe('Shared Types', () => {
  describe('RootState interface', () => {
    it('should allow empty state object', () => {
      const state: RootState = {};
      expect(state).toBeDefined();
      expect(typeof state).toBe('object');
    });

    it('should allow state with additional properties', () => {
      const state: RootState = {
        customProperty: 'value',
        anotherProperty: 123
      };
      expect(state.customProperty).toBe('value');
      expect(state.anotherProperty).toBe(123);
    });
  });

  describe('BaseAction interface', () => {
    it('should allow action with only type', () => {
      const action: BaseAction = {
        type: 'TEST_ACTION'
      };
      expect(action.type).toBe('TEST_ACTION');
      expect(action.payload).toBeUndefined();
    });

    it('should allow action with type and payload', () => {
      const action: BaseAction = {
        type: 'TEST_ACTION',
        payload: { data: 'test' }
      };
      expect(action.type).toBe('TEST_ACTION');
      expect(action.payload).toEqual({ data: 'test' });
    });

    it('should allow action with any payload type', () => {
      const stringPayload: BaseAction = { type: 'STRING', payload: 'test' };
      const numberPayload: BaseAction = { type: 'NUMBER', payload: 123 };
      const objectPayload: BaseAction = { type: 'OBJECT', payload: { key: 'value' } };
      const arrayPayload: BaseAction = { type: 'ARRAY', payload: [1, 2, 3] };
      const nullPayload: BaseAction = { type: 'NULL', payload: null };
      const undefinedPayload: BaseAction = { type: 'UNDEFINED' };

      expect(stringPayload.payload).toBe('test');
      expect(numberPayload.payload).toBe(123);
      expect(objectPayload.payload).toEqual({ key: 'value' });
      expect(arrayPayload.payload).toEqual([1, 2, 3]);
      expect(nullPayload.payload).toBeNull();
      expect(undefinedPayload.payload).toBeUndefined();
    });
  });

  describe('LoadingState interface', () => {
    it('should allow loading state with isLoading true', () => {
      const loadingState: LoadingState = {
        isLoading: true,
        error: null
      };
      expect(loadingState.isLoading).toBe(true);
      expect(loadingState.error).toBeNull();
    });

    it('should allow loading state with isLoading false', () => {
      const loadingState: LoadingState = {
        isLoading: false,
        error: 'Some error occurred'
      };
      expect(loadingState.isLoading).toBe(false);
      expect(loadingState.error).toBe('Some error occurred');
    });

    it('should allow loading state with null error', () => {
      const loadingState: LoadingState = {
        isLoading: false,
        error: null
      };
      expect(loadingState.isLoading).toBe(false);
      expect(loadingState.error).toBeNull();
    });

    it('should allow loading state with string error', () => {
      const loadingState: LoadingState = {
        isLoading: true,
        error: 'Network error'
      };
      expect(loadingState.isLoading).toBe(true);
      expect(loadingState.error).toBe('Network error');
    });
  });

  describe('Product interface', () => {
    it('should allow product with all required fields', () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 1000,
        description: 'Test description',
        image: 'https://example.com/image.jpg'
      };
      expect(product.id).toBe('1');
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(1000);
      expect(product.description).toBe('Test description');
      expect(product.image).toBe('https://example.com/image.jpg');
    });

    it('should allow product without optional fields', () => {
      const product: Product = {
        id: '2',
        name: 'Minimal Product',
        price: 500
      };
      expect(product.id).toBe('2');
      expect(product.name).toBe('Minimal Product');
      expect(product.price).toBe(500);
      expect(product.description).toBeUndefined();
      expect(product.image).toBeUndefined();
    });

    it('should allow product with empty string optional fields', () => {
      const product: Product = {
        id: '3',
        name: 'Empty Fields Product',
        price: 750,
        description: '',
        image: ''
      };
      expect(product.description).toBe('');
      expect(product.image).toBe('');
    });

    it('should allow product with very long text fields', () => {
      const longText = 'a'.repeat(1000);
      const product: Product = {
        id: '4',
        name: longText,
        price: 999,
        description: longText,
        image: longText
      };
      expect(product.name).toBe(longText);
      expect(product.description).toBe(longText);
      expect(product.image).toBe(longText);
    });
  });

  describe('CartItem interface', () => {
    it('should allow cart item with valid product and quantity', () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 1000
      };
      const cartItem: CartItem = {
        product,
        quantity: 5
      };
      expect(cartItem.product).toBe(product);
      expect(cartItem.quantity).toBe(5);
    });

    it('should allow cart item with decimal quantity', () => {
      const product: Product = {
        id: '2',
        name: 'Decimal Product',
        price: 500
      };
      const cartItem: CartItem = {
        product,
        quantity: 2.5
      };
      expect(cartItem.quantity).toBe(2.5);
    });

    it('should allow cart item with zero quantity', () => {
      const product: Product = {
        id: '3',
        name: 'Zero Quantity Product',
        price: 100
      };
      const cartItem: CartItem = {
        product,
        quantity: 0
      };
      expect(cartItem.quantity).toBe(0);
    });

    it('should allow cart item with negative quantity', () => {
      const product: Product = {
        id: '4',
        name: 'Negative Quantity Product',
        price: 200
      };
      const cartItem: CartItem = {
        product,
        quantity: -1
      };
      expect(cartItem.quantity).toBe(-1);
    });

    it('should allow cart item with very large quantity', () => {
      const product: Product = {
        id: '5',
        name: 'Large Quantity Product',
        price: 50
      };
      const cartItem: CartItem = {
        product,
        quantity: Number.MAX_SAFE_INTEGER
      };
      expect(cartItem.quantity).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('Transaction interface', () => {
    it('should allow transaction with all fields', () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 1000
      };
      const cartItem: CartItem = {
        product,
        quantity: 2
      };
      const transaction: Transaction = {
        id: 'txn_1',
        items: [cartItem],
        total: 2000,
        timestamp: Date.now(),
        encryptedData: 'encrypted_string_data'
      };
      expect(transaction.id).toBe('txn_1');
      expect(transaction.items).toEqual([cartItem]);
      expect(transaction.total).toBe(2000);
      expect(transaction.timestamp).toBeGreaterThan(0);
      expect(transaction.encryptedData).toBe('encrypted_string_data');
    });

    it('should allow transaction with empty items array', () => {
      const transaction: Transaction = {
        id: 'txn_2',
        items: [],
        total: 0,
        timestamp: Date.now(),
        encryptedData: ''
      };
      expect(transaction.items).toEqual([]);
      expect(transaction.total).toBe(0);
    });

    it('should allow transaction with multiple items', () => {
      const product1: Product = { id: '1', name: 'Product 1', price: 100 };
      const product2: Product = { id: '2', name: 'Product 2', price: 200 };
      const cartItem1: CartItem = { product: product1, quantity: 1 };
      const cartItem2: CartItem = { product: product2, quantity: 3 };
      
      const transaction: Transaction = {
        id: 'txn_3',
        items: [cartItem1, cartItem2],
        total: 700,
        timestamp: Date.now(),
        encryptedData: 'multi_item_encrypted'
      };
      expect(transaction.items).toHaveLength(2);
      expect(transaction.total).toBe(700);
    });

    it('should allow transaction with very large values', () => {
      const product: Product = {
        id: 'large',
        name: 'Large Value Product',
        price: Number.MAX_SAFE_INTEGER
      };
      const cartItem: CartItem = {
        product,
        quantity: 1
      };
      const transaction: Transaction = {
        id: 'txn_large',
        items: [cartItem],
        total: Number.MAX_SAFE_INTEGER,
        timestamp: Number.MAX_SAFE_INTEGER,
        encryptedData: 'a'.repeat(10000)
      };
      expect(transaction.total).toBe(Number.MAX_SAFE_INTEGER);
      expect(transaction.timestamp).toBe(Number.MAX_SAFE_INTEGER);
      expect(transaction.encryptedData.length).toBe(10000);
    });
  });

  describe('User interface', () => {
    it('should allow user with all fields', () => {
      const user: User = {
        id: 'user_1',
        email: 'test@example.com',
        name: 'Test User'
      };
      expect(user.id).toBe('user_1');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
    });

    it('should allow user with very long text fields', () => {
      const longText = 'a'.repeat(1000);
      const user: User = {
        id: longText,
        email: `${longText}@example.com`,
        name: longText
      };
      expect(user.id).toBe(longText);
      expect(user.email).toBe(`${longText}@example.com`);
      expect(user.name).toBe(longText);
    });

    it('should allow user with special characters', () => {
      const user: User = {
        id: 'user_special_123!@#',
        email: 'test+special@example-domain.co.uk',
        name: 'José María O\'Connor-Smith'
      };
      expect(user.id).toBe('user_special_123!@#');
      expect(user.email).toBe('test+special@example-domain.co.uk');
      expect(user.name).toBe('José María O\'Connor-Smith');
    });
  });

  describe('Type Integration', () => {
    it('should allow complex nested structures', () => {
      const user: User = {
        id: 'user_1',
        email: 'user@example.com',
        name: 'John Doe'
      };

      const product: Product = {
        id: 'prod_1',
        name: 'Guitar',
        price: 1000,
        description: 'Acoustic guitar',
        image: 'guitar.jpg'
      };

      const cartItem: CartItem = {
        product,
        quantity: 2
      };

      const transaction: Transaction = {
        id: 'txn_1',
        items: [cartItem],
        total: 2000,
        timestamp: Date.now(),
        encryptedData: 'encrypted_data'
      };

      const state: RootState = {
        user,
        products: [product],
        cart: [cartItem],
        transactions: [transaction]
      };

      expect(state.user).toBe(user);
      expect(state.products).toEqual([product]);
      expect(state.cart).toEqual([cartItem]);
      expect(state.transactions).toEqual([transaction]);
    });

    it('should allow action with complex payload', () => {
      const product: Product = {
        id: 'prod_1',
        name: 'Test Product',
        price: 100
      };

      const action: BaseAction = {
        type: 'ADD_PRODUCT',
        payload: product
      };

      expect(action.type).toBe('ADD_PRODUCT');
      expect(action.payload).toBe(product);
    });

    it('should allow loading state with complex error', () => {
      const error = {
        code: 'NETWORK_ERROR',
        message: 'Connection failed',
        details: { retryCount: 3, lastAttempt: Date.now() }
      };

      const loadingState: LoadingState = {
        isLoading: false,
        error: JSON.stringify(error)
      };

      expect(loadingState.isLoading).toBe(false);
      expect(loadingState.error).toBe(JSON.stringify(error));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings in required fields', () => {
      const product: Product = {
        id: '',
        name: '',
        price: 0
      };
      expect(product.id).toBe('');
      expect(product.name).toBe('');
      expect(product.price).toBe(0);
    });

    it('should handle null-like values in optional fields', () => {
      const product: Product = {
        id: 'null_test',
        name: 'Null Test Product',
        price: 100,
        description: null as any,
        image: undefined
      };
      expect(product.description).toBeNull();
      expect(product.image).toBeUndefined();
    });

    it('should handle extreme numeric values', () => {
      const product: Product = {
        id: 'extreme',
        name: 'Extreme Values',
        price: Number.MAX_VALUE
      };
      expect(product.price).toBe(Number.MAX_VALUE);
    });

    it('should handle very long IDs and names', () => {
      const longId = 'a'.repeat(10000);
      const longName = 'b'.repeat(10000);
      
      const product: Product = {
        id: longId,
        name: longName,
        price: 100
      };
      expect(product.id).toBe(longId);
      expect(product.name).toBe(longName);
    });
  });
});
