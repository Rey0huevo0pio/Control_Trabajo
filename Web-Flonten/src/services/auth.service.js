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
import api from './api';

/**
 * Iniciar sesión
 * @param {Object} credentials - Credenciales de login
 * @param {string} credentials.Control_Usuario - Control de usuario
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<Object>} Response con user y token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Registrar nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Response con user y token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Obtener usuario actual
 * @returns {Promise<Object>} Datos del usuario
 */
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

/**
 * Cerrar sesión (solo limpia local, el token se limpia en el store)
 */
export const logout = () => {
  // No requiere llamada API (JWT es stateless)
  return Promise.resolve();
};

export default {
  login,
  register,
  getCurrentUser,
  logout,
};
