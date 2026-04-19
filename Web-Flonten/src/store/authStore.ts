/**
 * ============================================================================
 * 🔐 AUTH STORE - Estado Global de Autenticación (Zustand)
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Maneja el estado global de autenticación
 * - Mismo patrón que el móvil para consistencia
 * - Persiste en localStorage para web
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/store/authStore.ts (mismo patrón)
 * - Services: auth.service.ts (usa login/register)
 * - API: api.ts (configura token)
 * - Components: Todos los componentes que necesitan auth
 * 
 * ESTADO:
 * - user: Datos del usuario actual
 * - token: Token JWT
 * - isAuthenticated: Boolean de estado
 * - isLoading: Estado de carga
 * 
 * FUNCIONES:
 * - login(user, token) → Guarda y persiste
 * - logout() → Limpia todo
 * - hasPermission(permission) → Verifica permisos
 * - hasRole(roles) → Verifica rol
 * 
 * ============================================================================
 */
import { create } from 'zustand';
import { setAuthToken } from '../services/api';
import { ROLE_PERMISSIONS, Permission } from '../constants';

export type Role = 'vigilante' | 'supervisor' | 'rh' | 'it' | 'admin';

export interface User {
  id: string;
  Control_Usuario: string;
  nombre: string;
  apellido: string;
  rol: Role;
  activo: boolean;
  telefono?: string;
  email?: string;
  permisos?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: string | string[]) => boolean;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const loadFromStorage = (): { user: User; token: string; isAuthenticated: boolean } | null => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      return {
        user: JSON.parse(user) as User,
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
  }
  return null;
};

const stored = loadFromStorage();

if (stored?.token) {
  setAuthToken(stored.token);
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: stored?.user || null,
  token: stored?.token || null,
  isAuthenticated: stored?.isAuthenticated || false,
  isLoading: false,

  login: (user: User, token: string) => {
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  getToken: () => get().token,

  hasPermission: (permission: Permission) => {
    const { user } = get();
    if (!user) return false;
    
    if (user.permisos && user.permisos.length > 0) {
      return user.permisos.includes(permission);
    }
    
    const rolePerms = ROLE_PERMISSIONS[user.rol as Role];
    return rolePerms?.includes(permission) || false;
  },

  hasRole: (roles: string | string[]) => {
    const { user } = get();
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.rol);
    }
    return user.rol === roles;
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

export default useAuthStore;