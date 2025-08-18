// ==================================================================
// UTILIDADES COMPARTIDAS
// ==================================================================

/**
 * Genera un ID único para entidades
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Formatea un precio en COP (Pesos Colombianos)
 * Los precios ya vienen en COP, solo se formatea para mostrar
 */
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString('es-CO')} COP`;
};

/**
 * Valida si un email tiene formato correcto
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Debounce para optimizar búsquedas
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: any;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Valida número de tarjeta de crédito usando algoritmo de Luhn
 */
export const validateCreditCard = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/\s+/g, '');
  
  if (!/^\d+$/.test(sanitized)) {
    return false;
  }
  
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    
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
 * Valida CVV de tarjeta de crédito
 */
export const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Formatea número de tarjeta con espacios
 */
export const formatCardNumber = (cardNumber: string): string => {
  const sanitized = cardNumber.replace(/\s+/g, '');
  const match = sanitized.match(/.{1,4}/g);
  return match ? match.join(' ') : sanitized;
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Trunca texto con puntos suspensivos
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Convierte timestamp a fecha legible
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
