// API Configuration

// For development: use localhost
// For production: use your production API URL
export const API_CONFIG = {
  // Backend API Base URL - Change this to match your backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://localhost:7257/api',
  
  // API Endpoints
  ENDPOINTS: {
    STUDENT: {
      CREATE: '/Student/create',
      GET_ALL: '/Student/all',
      GET_BY_ID: '/Student/:id',
      UPDATE: '/Student/:id',
      DELETE: '/Student/:id',
    },
  },

  // Request timeout (in milliseconds)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // milliseconds
  },
};

export default API_CONFIG;
