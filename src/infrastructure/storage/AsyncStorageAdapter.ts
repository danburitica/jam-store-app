// ==================================================================
// ASYNC STORAGE ADAPTER - CAPA INFRASTRUCTURE
// ==================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Adaptador para AsyncStorage de React Native
 * Proporciona una interfaz consistente para el almacenamiento local
 */
export class AsyncStorageAdapter {
  /**
   * Guarda un valor en el storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw new Error(`Error saving to storage: ${error}`);
    }
  }

  /**
   * Obtiene un valor del storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      throw new Error(`Error reading from storage: ${error}`);
    }
  }

  /**
   * Elimina un valor del storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new Error(`Error removing from storage: ${error}`);
    }
  }

  /**
   * Limpia todo el storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new Error(`Error clearing storage: ${error}`);
    }
  }

  /**
   * Obtiene todas las claves del storage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      throw new Error(`Error getting all keys: ${error}`);
    }
  }

  /**
   * Guarda un objeto JSON en el storage
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      throw new Error(`Error saving object to storage: ${error}`);
    }
  }

  /**
   * Obtiene un objeto JSON del storage
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      throw new Error(`Error reading object from storage: ${error}`);
    }
  }
}

