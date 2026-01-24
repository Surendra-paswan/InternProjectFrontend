// API Configuration

// For development: use localhost
// For production: use your production API URL
export const API_CONFIG = {
  // Backend API Base URL - Change this to match your backend
  BASE_URL: import.meta.env.VITE_API_URL || 'https://localhost:7257/api',
  
  // Uploads Base URL for displaying uploaded documents
  UPLOADS_BASE_URL: import.meta.env.VITE_UPLOADS_URL || 'https://localhost:7257/Uploads/',
  
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

// Helper function to construct full document URL
export const getDocumentUrl = (filePath: string): string => {
  if (!filePath) return '';

  // If already a complete URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // Normalize path separators (backslash to forward slash) but keep the full path content intact
  let cleanPath = filePath.replace(/\\/g, '/');

  // Avoid double slashes when combining with the base URL
  cleanPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

  // Construct full URL with the Uploads base; do not strip any path segments returned by backend
  const baseUrl = API_CONFIG.UPLOADS_BASE_URL;
  return `${baseUrl}${cleanPath}`;
};

export default API_CONFIG;
