// ==================================================================
// SHARED UTILS TESTS
// ==================================================================

import {
  generateId,
  formatPrice,
  isValidEmail,
  debounce,
  validateCreditCard,
  validateCVV,
  formatCardNumber,
  capitalizeWords,
  truncateText,
  formatDate
} from '../../../src/shared/utils';

describe('Shared Utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with correct format', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate different IDs on consecutive calls', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('formatPrice', () => {
    it('should format zero price correctly', () => {
      const result = formatPrice(0);
      expect(result).toBe('$0 COP');
    });

    it('should format small prices correctly', () => {
      const result = formatPrice(100);
      expect(result).toBe('$100 COP');
    });

    it('should format large prices with Colombian locale', () => {
      const result = formatPrice(1000000);
      expect(result).toBe('$1.000.000 COP');
    });

    it('should format decimal prices correctly', () => {
      const result = formatPrice(1234.56);
      expect(result).toBe('$1.234,56 COP'); // Colombian locale preserves decimals
    });

    it('should format very large prices', () => {
      const result = formatPrice(999999999);
      expect(result).toBe('$999.999.999 COP');
    });

    it('should handle negative prices', () => {
      const result = formatPrice(-1000);
      expect(result).toBe('$-1.000 COP');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
        'UPPERCASE@EMAIL.COM'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user@example.',
        'user name@example.com',
        'user@example com',
        '',
        '   '
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(isValidEmail('a@b.c')).toBe(true); // Minimal valid email
      expect(isValidEmail('very.long.email.address@very.long.domain.name')).toBe(true);
      expect(isValidEmail('user-name@domain-name.com')).toBe(true);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('test');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous calls when called again', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      jest.advanceTimersByTime(50);
      debouncedFn('second');
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('second');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple rapid calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('call1');
      debouncedFn('call2');
      debouncedFn('call3');
      debouncedFn('call4');
      debouncedFn('final');

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('final');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with different wait times', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn('test');
      jest.advanceTimersByTime(250);
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(250);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should handle function with multiple parameters', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('param1', 'param2', 123);
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith('param1', 'param2', 123);
    });
  });

  describe('validateCreditCard', () => {
    it('should validate correct credit card numbers', () => {
      const validCards = [
        '4532015112830366', // Visa
        '5555555555554444', // Mastercard
        '378282246310005',  // American Express
        '6011111111111117', // Discover
        '4111111111111111'  // Visa
      ];

      validCards.forEach(card => {
        expect(validateCreditCard(card)).toBe(true);
      });
    });

    it('should reject invalid credit card numbers', () => {
      const invalidCards = [
        '4532015112830367', // Invalid checksum
        '1234567890123456', // Invalid checksum
        '1111111111111111', // Invalid checksum
        '453201511283036',  // Too short
        '45320151128303666', // Too long
        '453201511283036a',  // Contains letters
        '',
        '   '
      ];

      invalidCards.forEach(card => {
        expect(validateCreditCard(card)).toBe(false);
      });
    });

    it('should handle cards with spaces', () => {
      expect(validateCreditCard('4532 0151 1283 0366')).toBe(true);
      expect(validateCreditCard('5555 5555 5555 4444')).toBe(true);
    });

    it('should handle edge cases', () => {
      expect(validateCreditCard('12345678901234567890')).toBe(false); // Very long
    });
  });

  describe('validateCVV', () => {
    it('should validate correct CVV formats', () => {
      const validCVVs = ['123', '456', '789', '1234', '5678'];
      
      validCVVs.forEach(cvv => {
        expect(validateCVV(cvv)).toBe(true);
      });
    });

    it('should reject invalid CVV formats', () => {
      const invalidCVVs = [
        '12',      // Too short
        '12345',   // Too long
        '12a',     // Contains letters
        '12 3',    // Contains spaces
        'abc',     // All letters
        '',        // Empty
        '   '      // Only spaces
      ];

      invalidCVVs.forEach(cvv => {
        expect(validateCVV(cvv)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(validateCVV('000')).toBe(true);
      expect(validateCVV('999')).toBe(true);
      expect(validateCVV('0000')).toBe(true);
      expect(validateCVV('9999')).toBe(true);
    });
  });

  describe('formatCardNumber', () => {
    it('should format card numbers with spaces', () => {
      expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
      expect(formatCardNumber('5555555555554444')).toBe('5555 5555 5555 4444');
      expect(formatCardNumber('378282246310005')).toBe('3782 8224 6310 005');
    });

    it('should handle card numbers with existing spaces', () => {
      expect(formatCardNumber('4111 1111 1111 1111')).toBe('4111 1111 1111 1111');
      expect(formatCardNumber('5555  5555  5555  4444')).toBe('5555 5555 5555 4444');
    });

    it('should handle short card numbers', () => {
      expect(formatCardNumber('1234')).toBe('1234');
      expect(formatCardNumber('12345')).toBe('1234 5');
      expect(formatCardNumber('123456')).toBe('1234 56');
    });

    it('should handle edge cases', () => {
      expect(formatCardNumber('')).toBe('');
      expect(formatCardNumber('   ')).toBe('');
      expect(formatCardNumber('1')).toBe('1');
      expect(formatCardNumber('12')).toBe('12');
      expect(formatCardNumber('123')).toBe('123');
    });

    it('should handle very long numbers', () => {
      const longNumber = '123456789012345678901234567890';
      const expected = '1234 5678 9012 3456 7890 1234 5678 90';
      expect(formatCardNumber(longNumber)).toBe(expected);
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('john doe smith')).toBe('John Doe Smith');
      expect(capitalizeWords('react native app')).toBe('React Native App');
    });

    it('should handle single words', () => {
      expect(capitalizeWords('hello')).toBe('Hello');
      expect(capitalizeWords('WORLD')).toBe('World');
      expect(capitalizeWords('hello')).toBe('Hello');
    });

    it('should handle mixed case', () => {
      expect(capitalizeWords('hElLo WoRlD')).toBe('Hello World');
      expect(capitalizeWords('JOHN doe SMITH')).toBe('John Doe Smith');
    });

    it('should handle edge cases', () => {
      expect(capitalizeWords('')).toBe('');
      expect(capitalizeWords('   ')).toBe('   ');
      expect(capitalizeWords('a')).toBe('A');
      expect(capitalizeWords('A')).toBe('A');
    });

    it('should handle special characters', () => {
      expect(capitalizeWords('hello-world')).toBe('Hello-world');
      expect(capitalizeWords('hello_world')).toBe('Hello_world');
      expect(capitalizeWords('hello.world')).toBe('Hello.world');
    });

    it('should handle numbers', () => {
      expect(capitalizeWords('hello 123 world')).toBe('Hello 123 World');
      expect(capitalizeWords('123 hello')).toBe('123 Hello');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
      expect(truncateText('This is a very long text', 15)).toBe('This is a ve...');
      expect(truncateText('Short', 10)).toBe('Short');
    });

    it('should not truncate text shorter than max length', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('Hi', 2)).toBe('Hi');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 0)).toBe('');
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('Hello', 0)).toBe('...');
      expect(truncateText('Hello', 1)).toBe('...');
      expect(truncateText('Hello', 2)).toBe('...');
      expect(truncateText('Hello', 3)).toBe('...');
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      const result = truncateText(longText, 100);
      expect(result.length).toBe(100);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should handle exact length matches', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
      expect(truncateText('Hello World', 11)).toBe('Hello World');
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock Date.now() to return a fixed timestamp
      jest.spyOn(Date, 'now').mockReturnValue(1640995200000); // 2022-01-01 00:00:00 UTC
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should format timestamp to Spanish locale', () => {
      const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC
      const result = formatDate(timestamp);
      
      // The exact format depends on the system locale, but should contain date components
      expect(result).toContain('2021');
      expect(result).toContain('diciembre'); // December in Spanish (UTC offset)
      expect(result).toContain('31');
    });

    it('should handle different timestamps', () => {
      const timestamp1 = 0; // Unix epoch
      const timestamp2 = 1640995200000; // 2022-01-01
      const timestamp3 = Date.now(); // Current time
      
      expect(formatDate(timestamp1)).toBeDefined();
      expect(formatDate(timestamp2)).toBeDefined();
      expect(formatDate(timestamp3)).toBeDefined();
    });

    it('should handle edge cases', () => {
      expect(formatDate(0)).toBeDefined(); // Unix epoch
      expect(formatDate(-1000)).toBeDefined(); // Negative timestamp
      expect(formatDate(Number.MAX_SAFE_INTEGER)).toBeDefined(); // Very large timestamp
    });

    it('should include time information', () => {
      const timestamp = 1640995200000;
      const result = formatDate(timestamp);
      
      // Should include hour and minute
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a realistic scenario', () => {
      // Simulate a user entering credit card information
      const cardNumber = '4111111111111111';
      const cvv = '123';
      
      // Validate inputs
      expect(validateCreditCard(cardNumber)).toBe(true);
      expect(validateCVV(cvv)).toBe(true);
      
      // Format for display
      const formattedCard = formatCardNumber(cardNumber);
      expect(formattedCard).toBe('4111 1111 1111 1111');
      
      // Generate transaction ID
      const transactionId = generateId();
      expect(transactionId).toBeDefined();
      
      // Format price
      const price = 1000000;
      const formattedPrice = formatPrice(price);
      expect(formattedPrice).toBe('$1.000.000 COP');
      
      // Validate email
      const email = 'user@example.com';
      expect(isValidEmail(email)).toBe(true);
      
      // Format user name
      const userName = 'john doe smith';
      const formattedName = capitalizeWords(userName);
      expect(formattedName).toBe('John Doe Smith');
    });

    it('should handle debounced search with validation', () => {
      jest.useFakeTimers();
      
      const mockSearchFn = jest.fn();
      const debouncedSearch = debounce(mockSearchFn, 100);
      
      // Simulate user typing
      debouncedSearch('guitar');
      debouncedSearch('guitarra');
      debouncedSearch('guitarra acustica');
      
      // Wait for the debounce delay
      jest.runAllTimers();
      
      expect(mockSearchFn).toHaveBeenCalledWith('guitarra acustica');
      expect(mockSearchFn).toHaveBeenCalledTimes(1);
      
      jest.useRealTimers();
    });
  });
});
