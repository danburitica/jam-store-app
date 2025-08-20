// ==================================================================
// CONFIGURACIÓN DE ENTORNO - CAPA SHARED
// ==================================================================

export const ENVIRONMENT = {
  // Cambiar según el entorno
  API_BASE_URL: 'http://localhost:3000',  // Desarrollo local
  
  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 segundos
  
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
