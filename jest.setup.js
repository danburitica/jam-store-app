// ==================================================================
// JEST SETUP - CONFIGURACIÓN GLOBAL PARA TESTS
// ==================================================================

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

// Mock de crypto-js
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn((text, key) => ({
      toString: jest.fn(() => `encrypted_${text}`)
    })),
    decrypt: jest.fn((ciphertext, key) => ({
      toString: jest.fn((encoding) => {
        // Simular descifrado - extraer el texto original del mock
        const match = ciphertext.toString().match(/encrypted_(.+)/);
        if (match) {
          return match[1];
        }
        // Si no es un mock válido, simular error
        if (ciphertext === 'invalid' || ciphertext === '') {
          throw new Error('Invalid encrypted data');
        }
        return 'decrypted_data_mock';
      })
    }))
  },
  enc: {
    Utf8: 'utf8'
  }
}));

// Mock de console.log para tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configuración global de tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock de setTimeout para tests asíncronos
global.setTimeout = jest.fn((callback, delay) => {
  if (delay === 0) {
    callback();
    return 1;
  }
  return 1; // Return mock ID instead of recursive call
});

// Mock de Date.now para tests consistentes
Date.now = jest.fn(() => 1640995200000); // 2022-01-01 00:00:00 UTC
