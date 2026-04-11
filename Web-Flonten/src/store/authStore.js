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
 * - Services: auth.service.js (usa login/register)
 * - API: api.js (configura token)
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
import { ROLE_PERMISSIONS } from '../constants';

// ============================================================================
// CARGAR ESTADO DESDE LOCALSTORAGE (Web-only)
// ============================================================================
const loadFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      return {
        user: JSON.parse(user),
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

// ============================================================================
// STORE
// ============================================================================
export const useAuthStore = create((set, get) => ({
  // Estado inicial
  user: stored?.user || null,
  token: stored?.token || null,
  isAuthenticated: stored?.isAuthenticated || false,
  isLoading: false,

  // Actions
  /**
   * Iniciar sesión
   * @param {Object} user - Datos del usuario
   * @param {string} token - Token JWT
   */
  login: (user, token) => {
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  /**
   * Obtener token actual
   */
  getToken: () => get().token,

  /**
   * Verificar si tiene permiso
   * @param {string} permission - Permiso a verificar
   * @returns {boolean}
   */
  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    
    // Si el usuario tiene permisos directos
    if (user.permisos && user.permisos.length > 0) {
      return user.permisos.includes(permission);
    }
    
    // Si no, verificar por rol
    const rolePerms = ROLE_PERMISSIONS[user.rol];
    return rolePerms?.includes(permission) || false;
  },

  /**
   * Verificar si tiene rol
   * @param {string|string[]} roles - Rol o roles permitidos
   * @returns {boolean}
   */
  hasRole: (roles) => {
    const { user } = get();
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.rol);
    }
    return user.rol === roles;
  },

  /**
   * Setear estado de carga
   * @param {boolean} loading 
   */
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
