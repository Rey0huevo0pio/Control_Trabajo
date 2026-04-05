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
