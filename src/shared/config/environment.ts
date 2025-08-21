// ==================================================================
// CONFIGURACIÓN DE ENTORNO - CAPA SHARED
// ==================================================================
import { API_BASE_URL, REQUEST_TIMEOUT } from "@env"

export const ENVIRONMENT = {
  // URL del backend según entorno
  API_BASE_URL,
  
  // Timeouts
  REQUEST_TIMEOUT: parseInt(REQUEST_TIMEOUT, 10) || 30000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = ENVIRONMENT.API_BASE_URL.replace(/\/$/, ''); // Remover trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remover leading slash
  return `${baseUrl}/${cleanEndpoint}`;
};
