import axios from 'axios';

// ==========================================
// CONFIGURACIÓN DE API
// ==========================================

// URL base de tu backend (IP de tu computadora en la red local)
const BASE_URL = __DEV__
  ? 'http://192.168.100.29:3000'  // Tu IP local
  : 'https://tu-dominio.com';      // Producción

export const API_CONFIG = {
  baseURL: BASE_URL,
  timeout: 15000,
  endpoints: {
    // Auth (con prefijo /api del backend)
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',

    // Users
    USERS: '/api/users',
    USERS_BY_ID: (id: string) => `/api/users/${id}`,
    USERS_PROFILE: (id: string) => `/api/users/${id}/profile`,
    USERS_CHANGE_PASSWORD: (id: string) => `/api/users/${id}/change-password`,
    USERS_TOGGLE_ACTIVE: (id: string) => `/api/users/${id}/toggle-active`,
    USERS_LAST_ACCESS: (id: string) => `/api/users/${id}/last-access`,
    USERS_STATS_COUNT: '/api/users/stats/count',
    USERS_BY_ROLE: (rol: string) => `/api/users/by-role/${rol}`,

    // Uploads
    UPLOAD_FILE: '/api/uploads',
    UPLOAD_MULTIPLE: '/api/uploads/multiple',
    UPLOADS_BY_USER: (numeroControl: string) => `/api/uploads/${numeroControl}`,

    // Instalaciones
    INSTALACIONES: '/api/instalaciones',

    // Tickets
    TICKETS: '/api/tickets',

    // Chat
    CHAT: '/api/chat',

    // Archivero
    ARCHIVERO: '/api/archivero',

    // Email
    EMAIL_CONFIG: '/api/email/config',
    EMAIL_TEST: '/api/email/config/test',
    EMAIL_MESSAGES: '/api/email/messages',
    EMAIL_SEND: '/api/email/send',
  },
};

// Instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable global para el token
let authToken: string | null = null;

// ==========================================
// Función para establecer el token
// ==========================================
export const setAuthToken = (token: string | null) => {
  console.log('🔧 [API] setAuthToken llamado con:', token ? `${token.substring(0, 30)}...` : 'NULL');
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('✅ [API] Token establecido en axios defaults');
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('❌ [API] Token eliminado de axios defaults');
  }
};

// ==========================================
// Función para obtener el token actual
// ==========================================
export const getAuthToken = () => {
  console.log('🔍 [API] getAuthToken llamado. Token:', authToken ? '✅ PRESENTE' : '❌ NULL');
  return authToken;
};

// Interceptor para verificar token en cada request
api.interceptors.request.use((config) => {
  console.log('\n📤 [API Interceptor] Request saliente:');
  console.log('URL:', config.url);
  console.log('Method:', config.method);
  console.log('AuthToken variable:', authToken ? '✅ PRESENTE' : '❌ NULL');
  console.log('Authorization header:', config.headers['Authorization'] ? '✅ PRESENTE' : '❌ AUSENTE');
  
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
    console.log('✅ [API Interceptor] Token agregado al header');
  } else {
    console.log('⚠️ [API Interceptor] NO hay token para agregar');
  }
  
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.warn('Token expirado o inválido - 401 Unauthorized');
      // Opcional: redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;
