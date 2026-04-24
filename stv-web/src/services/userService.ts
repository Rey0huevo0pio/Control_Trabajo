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

interface User {
  id: string;
  Control_Usuario: string;
  nombre: string;
  apellido: string;
  rol: string;
  activo: boolean;
  telefono?: string;
  email?: string;
}

interface CreateUserRequest {
  Control_Usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: string;
  email?: string;
  telefono?: string;
}

interface UpdateUserRequest {
  nombre?: string;
  apellido?: string;
  rol?: string;
  telefono?: string;
  email?: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const USERS_ENDPOINT = '/users';

export const userService = {
  async createUser(data: CreateUserRequest): Promise<any> {
    console.log('[UserService] createUser:', data.Control_Usuario);
    const response = await api.post(USERS_ENDPOINT, data);
    return response.data;
  },

  async getUsers(params: Record<string, any> = {}): Promise<any> {
    console.log('[UserService] getUsers');
    const response = await api.get(USERS_ENDPOINT, { params });
    return response.data;
  },

  async getUserById(id: string): Promise<any> {
    console.log('[UserService] getUserById:', id);
    const response = await api.get(`${USERS_ENDPOINT}/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<any> {
    console.log('[UserService] updateUser:', id);
    const response = await api.patch(`${USERS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<any> {
    console.log('[UserService] deleteUser:', id);
    const response = await api.delete(`${USERS_ENDPOINT}/${id}`);
    return response.data;
  },

  async toggleUserStatus(id: string): Promise<any> {
    console.log('[UserService] toggleUserStatus:', id);
    const response = await api.patch(`${USERS_ENDPOINT}/${id}/toggle-status`);
    return response.data;
  },

  async changePassword(id: string, passwords: ChangePasswordRequest): Promise<any> {
    console.log('[UserService] changePassword:', id);
    const response = await api.patch(`${USERS_ENDPOINT}/${id}/password`, passwords);
    return response.data;
  },

  async searchUsers(query: string): Promise<any> {
    console.log('[UserService] searchUsers:', query);
    const response = await api.get(USERS_ENDPOINT, { params: { search: query } });
    return response.data;
  },

  async getAllRoles(): Promise<string[]> {
    return ['admin', 'it', 'rh', 'supervisor', 'vigilante'];
  },
};

export default userService;