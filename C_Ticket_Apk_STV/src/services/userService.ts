import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './api';
import { User, UserRole } from '../types';

// ==========================================
// INTERFACES
// ==========================================
interface CreateUserDto {
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

interface UpdateUserDto {
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

interface SearchParams {
  search?: string;
  rol?: UserRole;
  activo?: boolean;
  departamento?: string;
}

// ==========================================
// SERVICIO DE USUARIOS
// ==========================================
class UserService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token
    this.api.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private getToken(): string | null {
    try {
      // Aquí deberías obtener el token de tu store de auth
      return null; // Reemplazar con lógica real
    } catch {
      return null;
    }
  }

  // ==========================================
  // CREAR USUARIO
  // ==========================================
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await this.api.post(API_CONFIG.endpoints.USERS, data);
    return response.data;
  }

  // ==========================================
  // OBTENER TODOS LOS USUARIOS
  // ==========================================
  async getUsers(params?: SearchParams): Promise<User[]> {
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
    const response = await this.api.get(
      API_CONFIG.endpoints.USERS_BY_ID(id),
    );
    return response.data;
  }

  // ==========================================
  // ACTUALIZAR USUARIO
  // ==========================================
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
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
    const response = await this.api.patch(
      API_CONFIG.endpoints.USERS_TOGGLE_ACTIVE(id),
    );
    return response.data;
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================
  async deleteUser(id: string): Promise<void> {
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
export type { CreateUserDto, UpdateUserDto, SearchParams };
