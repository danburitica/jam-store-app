// ==================================================================
// CARD VALIDATION UTILITIES TESTS
// ==================================================================

import {
  detectCardType,
  formatCardNumber,
  validateCardNumber,
  formatExpiryDate,
  validateExpiryDate,
  validateCVC,
  validateCardholderName,
  validateEmail,
  validateDocumentNumber,
  maskCardNumber,
  getDocumentTypeLabel,
  getInstallmentLabel,
  CARD_TYPES,
  COLOMBIA_DOCUMENT_TYPES,
  INSTALLMENT_OPTIONS
} from '../../../src/shared/utils/cardValidation';

describe('Card Validation Utilities', () => {
  describe('detectCardType', () => {
    it('should detect VISA cards correctly', () => {
      expect(detectCardType('4111111111111111')).toEqual({
        name: 'VISA',
        logo: '💳 VISA',
        pattern: /^4/
      });
      expect(detectCardType('4000000000000002')).toEqual({
        name: 'VISA',
        logo: '💳 VISA',
        pattern: /^4/
      });
    });

    it('should detect MasterCard cards correctly', () => {
      expect(detectCardType('5555555555554444')).toEqual({
        name: 'MASTERCARD',
        logo: '💳 MC',
        pattern: /^5[1-5]/
      });
      expect(detectCardType('5105105105105100')).toEqual({
        name: 'MASTERCARD',
        logo: '💳 MC',
        pattern: /^5[1-5]/
      });
    });

    it('should return UNKNOWN for unsupported cards', () => {
      expect(detectCardType('3000000000000004')).toEqual({
        name: 'UNKNOWN',
        logo: '💳',
        pattern: /^$/
      });
      expect(detectCardType('6000000000000004')).toEqual({
        name: 'UNKNOWN',
        logo: '💳',
        pattern: /^$/
      });
    });

    it('should handle cards with spaces', () => {
      expect(detectCardType('4111 1111 1111 1111')).toEqual({
        name: 'VISA',
        logo: '💳 VISA',
        pattern: /^4/
      });
    });
  });

  describe('formatCardNumber', () => {
    it('should format card numbers with spaces every 4 digits', () => {
      expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
      expect(formatCardNumber('5555555555554444')).toBe('5555 5555 5555 4444');
    });

    it('should remove non-digit characters', () => {
      expect(formatCardNumber('4111-1111-1111-1111')).toBe('4111 1111 1111 1111');
      expect(formatCardNumber('4111.1111.1111.1111')).toBe('4111 1111 1111 1111');
    });

    it('should limit to 16 digits', () => {
      expect(formatCardNumber('411111111111111111111')).toBe('4111 1111 1111 1111');
    });

    it('should handle empty strings', () => {
      expect(formatCardNumber('')).toBe('');
    });

    it('should handle partial numbers', () => {
      expect(formatCardNumber('4111')).toBe('4111');
      expect(formatCardNumber('411111')).toBe('4111 11');
    });
  });

  describe('validateCardNumber', () => {
    it('should validate correct VISA card numbers', () => {
      expect(validateCardNumber('4111111111111111')).toBe(true);
      expect(validateCardNumber('4000000000000002')).toBe(true);
      expect(validateCardNumber('4111111111111111')).toBe(true);
    });

    it('should validate correct MasterCard numbers', () => {
      expect(validateCardNumber('5555555555554444')).toBe(true);
      expect(validateCardNumber('5105105105105100')).toBe(true);
    });

    it('should reject invalid card numbers', () => {
      expect(validateCardNumber('4111111111111112')).toBe(false);
      expect(validateCardNumber('5555555555554445')).toBe(false);
      expect(validateCardNumber('1234567890123456')).toBe(false);
    });

    it('should reject cards with wrong length', () => {
      expect(validateCardNumber('411111111111111')).toBe(false); // 15 digits
      expect(validateCardNumber('41111111111111111')).toBe(false); // 17 digits
    });

    it('should handle cards with spaces', () => {
      expect(validateCardNumber('4111 1111 1111 1111')).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(validateCardNumber('')).toBe(false);
    });
  });

  describe('formatExpiryDate', () => {
    it('should format expiry date correctly', () => {
      expect(formatExpiryDate('1225')).toBe('12/25');
      expect(formatExpiryDate('0126')).toBe('01/26');
    });

    it('should handle partial input', () => {
      expect(formatExpiryDate('12')).toBe('12/');
      expect(formatExpiryDate('1')).toBe('1');
    });

    it('should remove non-digit characters', () => {
      expect(formatExpiryDate('12-25')).toBe('12/25');
      expect(formatExpiryDate('12.25')).toBe('12/25');
    });

    it('should handle empty string', () => {
      expect(formatExpiryDate('')).toBe('');
    });
  });

  describe('validateExpiryDate', () => {
    beforeEach(() => {
      // Mock current date to 2022-01-01
      jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2022);
      jest.spyOn(Date.prototype, 'getMonth').mockReturnValue(0); // January
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should validate future expiry dates', () => {
      expect(validateExpiryDate('12/25')).toBe(true);
      expect(validateExpiryDate('01/23')).toBe(true);
      expect(validateExpiryDate('06/22')).toBe(true);
    });

    it('should reject past expiry dates', () => {
      expect(validateExpiryDate('12/20')).toBe(false);
      expect(validateExpiryDate('01/21')).toBe(false);
    });

    it('should reject invalid month values', () => {
      expect(validateExpiryDate('00/25')).toBe(false);
      expect(validateExpiryDate('13/25')).toBe(false);
    });

    it('should reject malformed dates', () => {
      expect(validateExpiryDate('12')).toBe(false);
      expect(validateExpiryDate('12/')).toBe(false);
      expect(validateExpiryDate('/25')).toBe(false);
      expect(validateExpiryDate('12/2')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateExpiryDate('')).toBe(false);
    });
  });

  describe('validateCVC', () => {
    it('should validate correct CVC codes', () => {
      expect(validateCVC('123')).toBe(true);
      expect(validateCVC('000')).toBe(true);
      expect(validateCVC('999')).toBe(true);
    });

    it('should reject invalid CVC codes', () => {
      expect(validateCVC('12')).toBe(false);
      expect(validateCVC('1234')).toBe(false);
      expect(validateCVC('12a')).toBe(false);
      expect(validateCVC('')).toBe(false);
    });
  });

  describe('validateCardholderName', () => {
    it('should validate correct cardholder names', () => {
      expect(validateCardholderName('John Doe')).toBe(true);
      expect(validateCardholderName('María José')).toBe(true);
      expect(validateCardholderName('José María González')).toBe(true);
    });

    it('should reject names that are too short', () => {
      expect(validateCardholderName('John')).toBe(false);
      expect(validateCardholderName('A')).toBe(false);
      expect(validateCardholderName('')).toBe(false);
    });

    it('should reject names with invalid characters', () => {
      expect(validateCardholderName('John123')).toBe(false);
      expect(validateCardholderName('John@Doe')).toBe(false);
      expect(validateCardholderName('John_Doe')).toBe(false);
    });

    it('should handle names with accents and spaces', () => {
      expect(validateCardholderName('José María')).toBe(true);
      expect(validateCardholderName('María del Carmen')).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });

  describe('validateDocumentNumber', () => {
    it('should validate Colombian CC numbers', () => {
      expect(validateDocumentNumber('12345678', 'CC')).toBe(true);
      expect(validateDocumentNumber('1234567890', 'CC')).toBe(true);
    });

    it('should validate Colombian CE numbers', () => {
      expect(validateDocumentNumber('123456', 'CE')).toBe(true);
      expect(validateDocumentNumber('123456789012', 'CE')).toBe(true);
    });

    it('should validate NIT numbers', () => {
      expect(validateDocumentNumber('123456789', 'NIT')).toBe(true);
      expect(validateDocumentNumber('123456789012345', 'NIT')).toBe(true);
    });

    it('should validate passport numbers', () => {
      expect(validateDocumentNumber('AB123456', 'PP')).toBe(true);
      expect(validateDocumentNumber('123456789012', 'PP')).toBe(true);
    });

    it('should reject invalid document numbers', () => {
      expect(validateDocumentNumber('123', 'CC')).toBe(false);
      expect(validateDocumentNumber('1234567890123456', 'CC')).toBe(false);
      expect(validateDocumentNumber('', 'CC')).toBe(false);
    });

    it('should reject unknown document types', () => {
      expect(validateDocumentNumber('12345678', 'UNKNOWN')).toBe(false);
    });
  });

  describe('maskCardNumber', () => {
    it('should mask card numbers correctly', () => {
      expect(maskCardNumber('4111111111111111')).toBe('**** **** **** 1111');
      expect(maskCardNumber('5555555555554444')).toBe('**** **** **** 4444');
    });

    it('should handle short numbers', () => {
      expect(maskCardNumber('4111')).toBe('**** **** **** 4111');
      expect(maskCardNumber('411111')).toBe('**** **** **** 1111');
    });

    it('should handle numbers with spaces', () => {
      expect(maskCardNumber('4111 1111 1111 1111')).toBe('**** **** **** 1111');
    });
  });

  describe('getDocumentTypeLabel', () => {
    it('should return correct labels for document types', () => {
      expect(getDocumentTypeLabel('CC')).toBe('Cédula de Ciudadanía');
      expect(getDocumentTypeLabel('CE')).toBe('Cédula de Extranjería');
      expect(getDocumentTypeLabel('NIT')).toBe('NIT');
      expect(getDocumentTypeLabel('PP')).toBe('Pasaporte');
    });

    it('should return the input for unknown types', () => {
      expect(getDocumentTypeLabel('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('getInstallmentLabel', () => {
    it('should return correct labels for installments', () => {
      expect(getInstallmentLabel(1)).toBe('1 cuota');
      expect(getInstallmentLabel(3)).toBe('3 cuotas');
      expect(getInstallmentLabel(12)).toBe('12 cuotas');
    });

    it('should handle unknown installment numbers', () => {
      expect(getInstallmentLabel(99)).toBe('99 cuotas');
    });
  });

  describe('Constants', () => {
    it('should have correct CARD_TYPES structure', () => {
      expect(CARD_TYPES).toHaveLength(2);
      expect(CARD_TYPES[0].name).toBe('VISA');
      expect(CARD_TYPES[1].name).toBe('MASTERCARD');
    });

    it('should have correct COLOMBIA_DOCUMENT_TYPES structure', () => {
      expect(COLOMBIA_DOCUMENT_TYPES).toHaveLength(4);
      expect(COLOMBIA_DOCUMENT_TYPES[0].value).toBe('CC');
      expect(COLOMBIA_DOCUMENT_TYPES[1].value).toBe('CE');
    });

    it('should have correct INSTALLMENT_OPTIONS structure', () => {
      expect(INSTALLMENT_OPTIONS).toHaveLength(7);
      expect(INSTALLMENT_OPTIONS[0].value).toBe(1);
      expect(INSTALLMENT_OPTIONS[6].value).toBe(24);
    });
  });
});
