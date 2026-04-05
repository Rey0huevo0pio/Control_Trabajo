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

// Interceptor para agregar token JWT
api.interceptors.request.use((config) => {
  try {
    const token = api.defaults.headers.common['Authorization'];
    if (token) {
      config.headers.Authorization = token;
    }
  } catch (e) {
    // Ignorar error
  }
  return config;
});

// ==========================================
// Función para establecer el token
// ==========================================
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
