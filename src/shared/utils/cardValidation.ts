// ==================================================================
// CARD VALIDATION UTILITIES
// ==================================================================

export interface CardType {
  name: 'VISA' | 'MASTERCARD' | 'UNKNOWN';
  logo: string;
  pattern: RegExp;
}

/**
 * Tipos de tarjeta soportados
 */
export const CARD_TYPES: CardType[] = [
  {
    name: 'VISA',
    logo: '💳 VISA',
    pattern: /^4/,
  },
  {
    name: 'MASTERCARD',
    logo: '💳 MC',
    pattern: /^5[1-5]/,
  },
];

/**
 * Detecta el tipo de tarjeta basado en el número
 */
export const detectCardType = (cardNumber: string): CardType => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  
  for (const cardType of CARD_TYPES) {
    if (cardType.pattern.test(cleanNumber)) {
      return cardType;
    }
  }
  
  return {
    name: 'UNKNOWN',
    logo: '💳',
    pattern: /^$/,
  };
};

/**
 * Formatea el número de tarjeta con espacios
 */
export const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const limitedValue = cleanValue.substring(0, 16);
  return limitedValue.replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Valida número de tarjeta usando algoritmo de Luhn
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  
  // Solo validar longitudes correctas de tarjetas: 13, 15, 16 dígitos
  if (!/^\d{13}$|^\d{15}$|^\d{16}$/.test(cleanNumber)) {
    return false;
  }
  
  // Validación específica por tipo de tarjeta
  if (cleanNumber.startsWith('4')) {
    // VISA: 13, 16 dígitos
    if (cleanNumber.length !== 13 && cleanNumber.length !== 16) {
      return false;
    }
  } else if (cleanNumber.startsWith('5')) {
    // MasterCard: 16 dígitos
    if (cleanNumber.length !== 16) {
      return false;
    }
  }
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Formatea la fecha de expiración MM/YY
 */
export const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
  }
  return cleanValue;
};

/**
 * Valida la fecha de expiración
 */
export const validateExpiryDate = (expiryDate: string): boolean => {
  const [month, year] = expiryDate.split('/');
  
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return false;
  }
  
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }
  
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return false;
  }
  
  return true;
};

/**
 * Valida el código CVC
 */
export const validateCVC = (cvc: string): boolean => {
  return /^\d{3}$/.test(cvc);
};

/**
 * Valida el nombre del titular
 */
export const validateCardholderName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim());
};

/**
 * Valida el email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Tipos de documento válidos en Colombia
 */
export const COLOMBIA_DOCUMENT_TYPES = [
  { label: 'Cédula de Ciudadanía', value: 'CC' },
  { label: 'Cédula de Extranjería', value: 'CE' },
  { label: 'NIT', value: 'NIT' },
  { label: 'Pasaporte', value: 'PP' },
] as const;

/**
 * Valida número de documento
 */
export const validateDocumentNumber = (documentNumber: string, documentType: string): boolean => {
  const cleanNumber = documentNumber.replace(/\D/g, '');
  
  switch (documentType) {
    case 'CC':
      return cleanNumber.length >= 7 && cleanNumber.length <= 10;
    case 'CE':
      return cleanNumber.length >= 6 && cleanNumber.length <= 12;
    case 'NIT':
      return cleanNumber.length >= 9 && cleanNumber.length <= 15;
    case 'PP':
      return documentNumber.trim().length >= 6 && documentNumber.trim().length <= 12;
    default:
      return false;
  }
};

/**
 * Opciones de cuotas disponibles
 */
export const INSTALLMENT_OPTIONS = [
  { label: '1 cuota', value: 1 },
  { label: '3 cuotas', value: 3 },
  { label: '6 cuotas', value: 6 },
  { label: '9 cuotas', value: 9 },
  { label: '12 cuotas', value: 12 },
  { label: '18 cuotas', value: 18 },
  { label: '24 cuotas', value: 24 },
] as const;

/**
 * Enmascara un número de tarjeta mostrando solo los últimos 4 dígitos
 */
export const maskCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  if (cleanNumber.length < 4) {
    return cardNumber;
  }
  
  const lastFour = cleanNumber.slice(-4);
  const maskedPart = '**** **** ****';
  return `${maskedPart} ${lastFour}`;
};

/**
 * Obtiene el label del tipo de documento
 */
export const getDocumentTypeLabel = (documentType: string): string => {
  const docType = COLOMBIA_DOCUMENT_TYPES.find(type => type.value === documentType);
  return docType ? docType.label : documentType;
};

/**
 * Obtiene el label del número de cuotas
 */
export const getInstallmentLabel = (installments: number): string => {
  const installmentOption = INSTALLMENT_OPTIONS.find(option => option.value === installments);
  return installmentOption ? installmentOption.label : `${installments} cuotas`;
};
