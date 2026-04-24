/**
 * ============================================================================
 * 📡 API SERVICE - Configuración de Axios
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Configura Axios interceptor para agregar token JWT
 * - Maneja errores de autenticación
 * - Base URL desde constants
 * 
 * CONEXIONES:
 * - Backend: backen_cerebro/ (API_URL)
 * - Store: authStore.ts (obtiene token)
 * - Mobile: C_Ticket_Apk_STV/src/services/api.ts (mismo patrón)
 * 
 * ============================================================================
 */
import axios from 'axios';
import { API_URL, API_TIMEOUT } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => authToken;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

api.interceptors.response.use(
  (response: import('axios').AxiosResponse) => response,
  (error: import('axios').AxiosError) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;