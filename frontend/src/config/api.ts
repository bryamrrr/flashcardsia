/**
 * Configuración de la API
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

// Debug logging (remover en producción)
console.log('🔧 API Configuration Debug:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('Environment:', ENVIRONMENT);

export const apiConfig = {
  baseURL: API_BASE_URL,
  environment: ENVIRONMENT,
  endpoints: {
    uploadDocument: '/api/upload-document',
    generateFlashcards: '/api/generate-flashcards',
    health: '/health',
  },
};

// Helper function para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  const fullUrl = `${apiConfig.baseURL}${endpoint}`;
  console.log('🌐 Building API URL:', fullUrl);
  return fullUrl;
};

// Configuración para fetch requests
export const apiHeaders = {
  'Content-Type': 'application/json',
};

export default apiConfig;
