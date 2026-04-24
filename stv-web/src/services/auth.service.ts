/**
 * ============================================================================
 * 🔐 AUTH SERVICE - Servicio de Autenticación
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Llamadas API de autenticación
 * - Login, register, logout
 * - Mismo patrón que el móvil
 * 
 * CONEXIONES:
 * - Backend: backen_cerebro/src/Controllers/Usuarios/auth.controller.ts
 * - Frontend Mobile: C_Ticket_Apk_STV/src/services/auth.service.ts
 * - Store: authStore.ts (usa estos métodos)
 * 
 * ENDPOINTS:
 * - POST /auth/register → Registro
 * - POST /auth/login → Login
 * - GET /users/me → Obtener usuario actual
 * 
 * ============================================================================
 */
import api, { ApiResponse } from './api';

interface LoginRequest {
  Control_Usuario: string;
  password: string;
}

interface RegisterRequest {
  Control_Usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  rol?: string;
  email?: string;
  telefono?: string;
}

interface User {
  id: string;
  Control_Usuario: string;
  nombre: string;
  apellido: string;
  rol: string;
  activo: boolean;
}

interface AuthData {
  user: User;
  token: string;
}

export const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthData>> => {
  const response = await api.post<ApiResponse<AuthData>>('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterRequest): Promise<ApiResponse<AuthData>> => {
  const response = await api.post<ApiResponse<AuthData>>('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>('/users/me');
  return response.data;
};

export const logout = (): Promise<void> => {
  return Promise.resolve();
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
};