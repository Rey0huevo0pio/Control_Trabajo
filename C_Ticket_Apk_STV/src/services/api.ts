// Configuración de API para el backend
export const API_CONFIG = {
  baseURL: __DEV__ 
    ? 'http://10.0.2.2:3000'  // Android Emulator
    : 'https://tu-dominio.com/api',
  timeout: 15000,
  endpoints: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Users
    USERS: '/users',
    USERS_BY_ID: (id: string) => `/users/${id}`,
    USERS_PROFILE: (id: string) => `/users/${id}/profile`,
    USERS_CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    USERS_TOGGLE_ACTIVE: (id: string) => `/users/${id}/toggle-active`,
    USERS_LAST_ACCESS: (id: string) => `/users/${id}/last-access`,
    USERS_STATS_COUNT: '/users/stats/count',
    USERS_BY_ROLE: (rol: string) => `/users/by-role/${rol}`,
    
    // Uploads
    UPLOAD_FILE: '/uploads',
    UPLOAD_MULTIPLE: '/uploads/multiple',
    UPLOADS_BY_USER: (numeroControl: string) => `/uploads/${numeroControl}`,
    
    // Instalaciones
    INSTALACIONES: '/instalaciones',
    
    // Tickets
    TICKETS: '/tickets',
    
    // Chat
    CHAT: '/chat',
    
    // Archivero
    ARCHIVERO: '/archivero',
  },
};
