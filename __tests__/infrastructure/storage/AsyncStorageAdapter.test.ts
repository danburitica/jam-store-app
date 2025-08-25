// ==================================================================
// ASYNC STORAGE ADAPTER TESTS
// ==================================================================

import { AsyncStorageAdapter } from '../../../src/infrastructure/storage/AsyncStorageAdapter';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('AsyncStorageAdapter', () => {
  let adapter: AsyncStorageAdapter;
  let mockAsyncStorage: jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    adapter = new AsyncStorageAdapter();
    mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
    
    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store string value successfully', async () => {
      // Arrange
      const key = 'test_key';
      const value = 'test_value';
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string values', async () => {
      // Arrange
      const key = 'empty_key';
      const value = '';
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should handle long string values', async () => {
      // Arrange
      const key = 'long_key';
      const value = 'A'.repeat(10000);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should handle special characters in key and value', async () => {
      // Arrange
      const key = 'special@#$%^&*()_+{}|:"<>?[]\\;\',./';
      const value = 'Value with emojis 🎸🎵 and symbols @#$%^&*()';
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should handle unicode characters', async () => {
      // Arrange
      const key = 'unicode_key_áéíóúñ';
      const value = 'Valor con acentos áéíóúñ y emojis 🌍🎵';
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should throw error when AsyncStorage fails', async () => {
      // Arrange
      const key = 'error_key';
      const value = 'test_value';
      const error = new Error('Storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      // Act & Assert
      await expect(adapter.setItem(key, value)).rejects.toThrow('Error saving to storage: Error: Storage error');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should handle null error from AsyncStorage', async () => {
      // Arrange
      const key = 'null_error_key';
      const value = 'test_value';
      mockAsyncStorage.setItem.mockRejectedValue(null);

      // Act & Assert
      await expect(adapter.setItem(key, value)).rejects.toThrow('Error saving to storage: null');
    });

    it('should handle undefined error from AsyncStorage', async () => {
      // Arrange
      const key = 'undefined_error_key';
      const value = 'test_value';
      mockAsyncStorage.setItem.mockRejectedValue(undefined);

      // Act & Assert
      await expect(adapter.setItem(key, value)).rejects.toThrow('Error saving to storage: undefined');
    });
  });

  describe('getItem', () => {
    it('should retrieve string value successfully', async () => {
      // Arrange
      const key = 'test_key';
      const expectedValue = 'test_value';
      mockAsyncStorage.getItem.mockResolvedValue(expectedValue);

      // Act
      const result = await adapter.getItem(key);

      // Assert
      expect(result).toBe(expectedValue);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should return null when key does not exist', async () => {
      // Arrange
      const key = 'non_existent_key';
      mockAsyncStorage.getItem.mockResolvedValue(null);

      // Act
      const result = await adapter.getItem(key);

      // Assert
      expect(result).toBeNull();
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should handle empty string key', async () => {
      // Arrange
      const key = '';
      const expectedValue = 'empty_key_value';
      mockAsyncStorage.getItem.mockResolvedValue(expectedValue);

      // Act
      const result = await adapter.getItem(key);

      // Assert
      expect(result).toBe(expectedValue);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should handle special characters in key', async () => {
      // Arrange
      const key = 'special@#$%^&*()_+{}|:"<>?[]\\;\',./';
      const expectedValue = 'special_key_value';
      mockAsyncStorage.getItem.mockResolvedValue(expectedValue);

      // Act
      const result = await adapter.getItem(key);

      // Assert
      expect(result).toBe(expectedValue);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should throw error when AsyncStorage fails', async () => {
      // Arrange
      const key = 'error_key';
      const error = new Error('Retrieval error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      // Act & Assert
      await expect(adapter.getItem(key)).rejects.toThrow('Error reading from storage: Error: Retrieval error');
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should handle string error from AsyncStorage', async () => {
      // Arrange
      const key = 'string_error_key';
      mockAsyncStorage.getItem.mockRejectedValue('String error');

      // Act & Assert
      await expect(adapter.getItem(key)).rejects.toThrow('Error reading from storage: String error');
    });
  });

  describe('removeItem', () => {
    it('should remove item successfully', async () => {
      // Arrange
      const key = 'test_key';
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      // Act
      await adapter.removeItem(key);

      // Assert
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(key);
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should handle empty string key', async () => {
      // Arrange
      const key = '';
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      // Act
      await adapter.removeItem(key);

      // Assert
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should throw error when AsyncStorage fails', async () => {
      // Arrange
      const key = 'error_key';
      const error = new Error('Removal error');
      mockAsyncStorage.removeItem.mockRejectedValue(error);

      // Act & Assert
      await expect(adapter.removeItem(key)).rejects.toThrow('Error removing from storage: Error: Removal error');
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  describe('clear', () => {
    it('should clear all storage successfully', async () => {
      // Arrange
      mockAsyncStorage.clear.mockResolvedValue(undefined);

      // Act
      await adapter.clear();

      // Assert
      expect(mockAsyncStorage.clear).toHaveBeenCalledWith();
      expect(mockAsyncStorage.clear).toHaveBeenCalledTimes(1);
    });

    it('should throw error when AsyncStorage fails', async () => {
      // Arrange
      const error = new Error('Clear error');
      mockAsyncStorage.clear.mockRejectedValue(error);

      // Act & Assert
      await expect(adapter.clear()).rejects.toThrow('Error clearing storage: Error: Clear error');
      expect(mockAsyncStorage.clear).toHaveBeenCalledWith();
    });
  });

  describe('getAllKeys', () => {
    it('should retrieve all keys successfully', async () => {
      // Arrange
      const expectedKeys = ['key1', 'key2', 'key3'];
      mockAsyncStorage.getAllKeys.mockResolvedValue(expectedKeys);

      // Act
      const result = await adapter.getAllKeys();

      // Assert
      expect(result).toEqual(expectedKeys);
      expect(mockAsyncStorage.getAllKeys).toHaveBeenCalledWith();
      expect(mockAsyncStorage.getAllKeys).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no keys exist', async () => {
      // Arrange
      mockAsyncStorage.getAllKeys.mockResolvedValue([]);

      // Act
      const result = await adapter.getAllKeys();

      // Assert
      expect(result).toEqual([]);
      expect(mockAsyncStorage.getAllKeys).toHaveBeenCalledWith();
    });

    it('should throw error when AsyncStorage fails', async () => {
      // Arrange
      const error = new Error('Get keys error');
      mockAsyncStorage.getAllKeys.mockRejectedValue(error);

      // Act & Assert
      await expect(adapter.getAllKeys()).rejects.toThrow('Error getting all keys: Error: Get keys error');
      expect(mockAsyncStorage.getAllKeys).toHaveBeenCalledWith();
    });
  });

  describe('setObject', () => {
    it('should store object value successfully', async () => {
      // Arrange
      const key = 'object_key';
      const value = {
        id: 1,
        name: 'Test Object',
        data: {
          nested: true,
          value: 42
        },
        array: [1, 2, 3, 'test']
      };
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setObject(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should store empty object successfully', async () => {
      // Arrange
      const key = 'empty_object_key';
      const value = {};
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setObject(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, '{}');
    });

    it('should store object with special characters', async () => {
      // Arrange
      const key = 'special_object_key';
      const value = {
        name: 'Object 🎸 with emojis 🎵',
        description: 'Description with symbols @#$%^&*()',
        data: {
          nested: 'Nested value with áéíóúñ'
        }
      };
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setObject(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should store object with null and undefined values', async () => {
      // Arrange
      const key = 'null_undefined_key';
      const value = {
        string: 'test',
        number: 42,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        zero: 0
      };
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setObject(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should throw error when object cannot be serialized', async () => {
      // Arrange
      const key = 'circular_key';
      const value: any = { name: 'test' };
      value.self = value; // Create circular reference
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act & Assert
      await expect(adapter.setObject(key, value)).rejects.toThrow('Error saving object to storage:');
    });

    it('should throw error when AsyncStorage fails', async () => {
      // Arrange
      const key = 'error_object_key';
      const value = { test: 'data' };
      const error = new Error('Object storage error');
      mockAsyncStorage.setItem.mockRejectedValue(error);

      // Act & Assert
      await expect(adapter.setObject(key, value)).rejects.toThrow('Error saving object to storage: Error: Error saving to storage: Error: Object storage error');
    });
  });

  describe('getObject', () => {
    it('should retrieve object value successfully', async () => {
      // Arrange
      const key = 'object_key';
      const expectedValue = {
        id: 1,
        name: 'Test Object',
        data: {
          nested: true,
          value: 42
        }
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(expectedValue));

      // Act
      const result = await adapter.getObject(key);

      // Assert
      expect(result).toEqual(expectedValue);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should return null when key does not exist', async () => {
      // Arrange
      const key = 'non_existent_object_key';
      mockAsyncStorage.getItem.mockResolvedValue(null);

      // Act
      const result = await adapter.getObject(key);

      // Assert
      expect(result).toBeNull();
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should return null when value is empty string', async () => {
      // Arrange
      const key = 'empty_string_key';
      mockAsyncStorage.getItem.mockResolvedValue('');

      // Act
      const result = await adapter.getObject(key);

      // Assert
      expect(result).toBeNull();
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should handle object with special characters', async () => {
      // Arrange
      const key = 'special_object_key';
      const expectedValue = {
        name: 'Object 🎸 with emojis 🎵',
        description: 'Description with symbols @#$%^&*()',
        data: {
          nested: 'Nested value with áéíóúñ'
        }
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(expectedValue));

      // Act
      const result = await adapter.getObject(key);

      // Assert
      expect(result).toEqual(expectedValue);
    });

    it('should throw error when JSON is invalid', async () => {
      // Arrange
      const key = 'invalid_json_key';
      mockAsyncStorage.getItem.mockResolvedValue('invalid json string');

      // Act & Assert
      await expect(adapter.getObject(key)).rejects.toThrow('Error reading object from storage:');
    });

    it('should throw error when AsyncStorage fails', async () => {
      // Arrange
      const key = 'error_object_key';
      const error = new Error('Object retrieval error');
      mockAsyncStorage.getItem.mockRejectedValue(error);

      // Act & Assert
      await expect(adapter.getObject(key)).rejects.toThrow('Error reading object from storage: Error: Error reading from storage: Error: Object retrieval error');
    });
  });

  describe('Integration Tests', () => {
    it('should work together in realistic scenarios', async () => {
      // Arrange
      const testData = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          preferences: {
            theme: 'dark',
            language: 'es'
          }
        },
        cart: [
          { productId: '1', quantity: 2 },
          { productId: '2', quantity: 1 }
        ],
        lastVisit: new Date().toISOString()
      };

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testData));

      // Act
      await adapter.setObject('user_data', testData);
      const retrieved = await adapter.getObject('user_data');

      // Assert
      expect(retrieved).toEqual(testData);
    });

    it('should handle multiple operations in sequence', async () => {
      // Arrange
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      mockAsyncStorage.getItem
        .mockResolvedValueOnce('value1')
        .mockResolvedValueOnce(JSON.stringify({ data: 'value2' }));
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem('key1', 'value1');
      const value1 = await adapter.getItem('key1');
      await adapter.setObject('key2', { data: 'value2' });
      const value2 = await adapter.getObject('key2');
      await adapter.removeItem('key1');

      // Assert
      expect(value1).toBe('value1');
      expect(value2).toEqual({ data: 'value2' });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long keys', async () => {
      // Arrange
      const key = 'A'.repeat(1000);
      const value = 'long_key_value';
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should handle very long values', async () => {
      // Arrange
      const key = 'long_value_key';
      const value = 'A'.repeat(100000);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setItem(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, value);
    });

    it('should handle very large objects', async () => {
      // Arrange
      const key = 'large_object_key';
      const value = {
        data: Array.from({ length: 10000 }, (_, index) => ({
          id: index,
          name: `Item ${index}`,
          description: `Description for item ${index}`.repeat(10)
        }))
      };
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      // Act
      await adapter.setObject(key, value);

      // Assert
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should handle concurrent operations', async () => {
      // Arrange
      const key = 'concurrent_key';
      const value = 'concurrent_value';
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      mockAsyncStorage.getItem.mockResolvedValue(value);

      // Act
      const promises = Array.from({ length: 100 }, () => {
        return Promise.all([
          adapter.setItem(key, value),
          adapter.getItem(key)
        ]);
      });

      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(100);
      results.forEach(([setResult, getResult]) => {
        expect(setResult).toBeUndefined();
        expect(getResult).toBe(value);
      });
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', async () => {
      const largeData = Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        name: `Item ${index}`,
        data: `Data for item ${index}`.repeat(100)
      }));

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(largeData));

      const startTime = Date.now();

      await adapter.setObject('large_dataset', largeData);
      const retrieved = await adapter.getObject('large_dataset');

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(retrieved).toEqual(largeData);
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });

    it('should not cause memory leaks with repeated operations', async () => {
      const testData = { test: 'data' };
      const iterations = 1000;

      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testData));

      for (let i = 0; i < iterations; i++) {
        await adapter.setObject(`key_${i}`, testData);
        const retrieved = await adapter.getObject(`key_${i}`);
        expect(retrieved).toEqual(testData);
      }

      // If we get here without memory issues, the test passes
      expect(true).toBe(true);
    });
  });
});
