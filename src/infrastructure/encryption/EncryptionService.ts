// ==================================================================
// ENCRYPTION SERVICE - CAPA INFRASTRUCTURE
// ==================================================================

import CryptoJS from 'crypto-js';
import { APP_CONFIG } from '../../shared/constants';

/**
 * Servicio de cifrado para proteger datos sensibles
 * Utiliza AES-256 para cifrar/descifrar información
 */
export class EncryptionService {
  private readonly secretKey: string;

  constructor() {
    // En un entorno real, esta clave debería venir de un lugar seguro
    // como variables de entorno o un servicio de gestión de claves
    this.secretKey = this.generateSecretKey();
  }

  /**
   * Cifra un string utilizando AES-256
   */
  encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      throw new Error(`Error encrypting data: ${error}`);
    }
  }

  /**
   * Descifra un string cifrado con AES-256
   */
  decrypt(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error(`Error decrypting data: ${error}`);
    }
  }

  /**
   * Cifra un objeto JSON
   */
  encryptObject<T>(data: T): string {
    try {
      const jsonString = JSON.stringify(data);
      return this.encrypt(jsonString);
    } catch (error) {
      throw new Error(`Error encrypting object: ${error}`);
    }
  }

  /**
   * Descifra un objeto JSON
   */
  decryptObject<T>(encryptedData: string): T {
    try {
      const decryptedString = this.decrypt(encryptedData);
      return JSON.parse(decryptedString);
    } catch (error) {
      throw new Error(`Error decrypting object: ${error}`);
    }
  }

  /**
   * Genera una clave secreta para el cifrado
   * En producción, esto debería ser más robusto
   */
  private generateSecretKey(): string {
    // Esta es una implementación simple para desarrollo
    // En producción, usar un método más seguro
    return 'JamStore2024SecretKey!@#$%^&*()_+';
  }

  /**
   * Valida si un string está cifrado correctamente
   */
  isValidEncryptedData(encryptedData: string): boolean {
    try {
      this.decrypt(encryptedData);
      return true;
    } catch {
      return false;
    }
  }
}

