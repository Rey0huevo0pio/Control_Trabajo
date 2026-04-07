/**
 * ============================================================================
 * 🔐 AUTH STORE - Estado Global de Autenticación (Zustand)
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Maneja el estado global de autenticación
 * - Almacena usuario y token JWT
 * - Provee funciones de login/logout
 * - Verifica roles y permisos del usuario
 * - Configura automáticamente el token en Axios interceptor
 * 
 * CONEXIONES:
 * - Types: User, Role (../types)
 * - Constants: ROLE_PERMISSIONS, CRUDPermissions (../constants)
 * - Services: setAuthToken (../services/api.ts) - Configura token en Axios
 * - Backend: Recibe datos de auth.service.ts (login, register)
 * - Frontend: Usado por todas las pantallas para verificar auth
 * 
 * ESTADO:
 * - user: Datos del usuario actual (sin password)
 * - token: Token JWT para requests autenticados
 * - isAuthenticated: Boolean de estado de sesión
 * - isLoading: Estado de carga para operaciones async
 * 
 * FUNCIONES PRINCIPALES:
 * - login(user, token) → Guarda usuario y token, configura Axios
 * - logout() → Limpia todo y elimina token de Axios
 * - hasPermission(permission) → Verifica si usuario tiene permiso
 * - hasRole(roles) → Verifica si usuario tiene uno de los roles
 * 
 * USO TÍPICO:
 * ```typescript
 * const { user, login, logout, hasPermission } = useAuthStore();
 * 
 * // Login
 * const response = await authApi.login(credentials);
 * login(response.data.user, response.data.token);
 * 
 * // Verificar permiso
 * if (hasPermission('tickets_crear')) { ... }
 * ```
 * 
 * PARA MODIFICAR:
 * - Agregar campo al estado: agregar en interface AuthState
 * - Agregar acción: agregar función en el objeto de actions
 * - Persistir estado: agregar zustand/middleware persist
 * 
 * ============================================================================
 */
import { create } from 'zustand'
import { User, Role } from '../types'
import { ROLE_PERMISSIONS, CRUDPermissions } from '../constants'
import { setAuthToken } from '../services/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  getToken: () => string | null
  hasPermission: (permission: string) => boolean
  hasRole: (roles: Role | Role[]) => boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user, token) => {
    // Guardar token en el interceptor de axios
    setAuthToken(token)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    // Eliminar token del interceptor
    setAuthToken(null)
    set({ user: null, token: null, isAuthenticated: false })
  },

  getToken: () => get().token,

  hasPermission: (permission: string): boolean => {
    const { user } = get()
    if (!user) return false
    return user.permisos.includes(permission)
  },

  hasRole: (roles: Role | Role[]): boolean => {
    const { user } = get()
    if (!user) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.rol)
    }
    return user.rol === roles
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },
}))
