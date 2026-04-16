/**
 * ============================================================================
 * 👤 USER SERVICE - Servicio de Usuarios (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/src/services/userService.ts
 * 
 * QUÉ HACE:
 * - CRUD de usuarios
 * - Búsqueda y filtros
 * - Gestión de roles y permisos
 * 
 * ============================================================================
 */
import api from './api';

const USERS_ENDPOINT = '/users';

export const userService = {
  async createUser(data) {
    console.log('[UserService] createUser:', data.Control_Usuario);
    const response = await api.post(USERS_ENDPOINT, data);
    return response.data;
  },

  async getUsers(params = {}) {
    console.log('[UserService] getUsers');
    const response = await api.get(USERS_ENDPOINT, { params });
    return response.data;
  },

  async getUserById(id) {
    console.log('[UserService] getUserById:', id);
    const response = await api.get(`${USERS_ENDPOINT}/${id}`);
    return response.data;
  },

  async updateUser(id, data) {
    console.log('[UserService] updateUser:', id);
    const response = await api.patch(`${USERS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  async deleteUser(id) {
    console.log('[UserService] deleteUser:', id);
    const response = await api.delete(`${USERS_ENDPOINT}/${id}`);
    return response.data;
  },

  async toggleUserStatus(id) {
    console.log('[UserService] toggleUserStatus:', id);
    const response = await api.patch(`${USERS_ENDPOINT}/${id}/toggle-status`);
    return response.data;
  },

  async changePassword(id, passwords) {
    console.log('[UserService] changePassword:', id);
    const response = await api.patch(`${USERS_ENDPOINT}/${id}/password`, passwords);
    return response.data;
  },

  async searchUsers(query) {
    console.log('[UserService] searchUsers:', query);
    const response = await api.get(USERS_ENDPOINT, { params: { search: query } });
    return response.data;
  },

  async getAllRoles() {
    return ['admin', 'it', 'rh', 'supervisor', 'vigilante'];
  },
};

export default userService;