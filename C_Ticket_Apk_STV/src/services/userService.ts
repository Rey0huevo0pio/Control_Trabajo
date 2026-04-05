import api, { API_CONFIG, getAuthToken } from './api';
import { User, UserRole } from '../types';

// ==========================================
// INTERFACES
// ==========================================
export interface CreateUserDto {
  Control_Usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  rol?: UserRole;
  telefono?: string;
  email?: string;
  fechaIngreso?: string;
  departamento?: string;
  puesto?: string;
}

export interface UpdateUserDto {
  Control_Usuario?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  rol?: UserRole;
  activo?: boolean;
  telefono?: string;
  email?: string;
  fechaIngreso?: string;
  avatar?: string;
  departamento?: string;
  puesto?: string;
  permisos?: string[];
}

export interface SearchParams {
  search?: string;
  rol?: UserRole;
  activo?: boolean;
  departamento?: string;
}

// ==========================================
// SERVICIO DE USUARIOS
// ==========================================
class UserService {
  // Usar la MISMA instancia de api.ts, NO crear una nueva
  private api = api;

  // ==========================================
  // CREAR USUARIO
  // ==========================================
  async createUser(data: CreateUserDto): Promise<User> {
    console.log('📤 [UserService] createUser:', data.Control_Usuario);
    const response = await this.api.post(API_CONFIG.endpoints.USERS, data);
    return response.data;
  }

  // ==========================================
  // OBTENER TODOS LOS USUARIOS
  // ==========================================
  async getUsers(params?: SearchParams): Promise<User[]> {
    console.log('📤 [UserService] getUsers - Token:', getAuthToken() ? '✅' : '❌');
    
    const response = await this.api.get(API_CONFIG.endpoints.USERS, {
      params: {
        search: params?.search,
        rol: params?.rol,
        activo: params?.activo,
        departamento: params?.departamento,
      },
    });
    return response.data;
  }

  // ==========================================
  // OBTENER USUARIO POR ID
  // ==========================================
  async getUserById(id: string): Promise<User> {
    console.log('📤 [UserService] getUserById:', id);
    const response = await this.api.get(
      API_CONFIG.endpoints.USERS_BY_ID(id),
    );
    return response.data;
  }

  // ==========================================
  // ACTUALIZAR USUARIO
  // ==========================================
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    console.log('📤 [UserService] updateUser:', id);
    const response = await this.api.patch(
      API_CONFIG.endpoints.USERS_BY_ID(id),
      data,
    );
    return response.data;
  }

  // ==========================================
  // ACTUALIZAR PERFIL
  // ==========================================
  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    const response = await this.api.patch(
      API_CONFIG.endpoints.USERS_PROFILE(id),
      data,
    );
    return response.data;
  }

  // ==========================================
  // CAMBIAR PASSWORD
  // ==========================================
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const response = await this.api.post(
      API_CONFIG.endpoints.USERS_CHANGE_PASSWORD(id),
      { currentPassword, newPassword },
    );
    return response.data;
  }

  // ==========================================
  // ACTIVAR/DESACTIVAR USUARIO
  // ==========================================
  async toggleUserActive(id: string): Promise<User> {
    console.log('📤 [UserService] toggleUserActive:', id);
    const response = await this.api.patch(
      API_CONFIG.endpoints.USERS_TOGGLE_ACTIVE(id),
    );
    return response.data;
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================
  async deleteUser(id: string): Promise<void> {
    console.log('📤 [UserService] deleteUser:', id);
    await this.api.delete(API_CONFIG.endpoints.USERS_BY_ID(id));
  }

  // ==========================================
  // OBTENER USUARIOS POR ROL
  // ==========================================
  async getUsersByRole(rol: UserRole): Promise<User[]> {
    const response = await this.api.get(
      API_CONFIG.endpoints.USERS_BY_ROLE(rol),
    );
    return response.data;
  }

  // ==========================================
  // CONTAR USUARIOS
  // ==========================================
  async getUsersCount(): Promise<number> {
    const response = await this.api.get(API_CONFIG.endpoints.USERS_STATS_COUNT);
    return response.data;
  }
}

export const userService = new UserService();
