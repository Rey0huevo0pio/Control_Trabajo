import { create } from 'zustand'
import { User, Role } from '../types'
import { ROLE_PERMISSIONS, CRUDPermissions } from '../constants'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  getToken: () => string | null
  hasPermission: (action: keyof CRUDPermissions) => boolean
  hasRole: (roles: Role | Role[]) => boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user, token) => {
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
  },

  getToken: () => get().token,

  hasPermission: (action: keyof CRUDPermissions): boolean => {
    const { user } = get()
    if (!user) return false
    const permissions = ROLE_PERMISSIONS[user.role]
    return permissions[action]
  },

  hasRole: (roles: Role | Role[]): boolean => {
    const { user } = get()
    if (!user) return false
    if (Array.isArray(roles)) {
      return roles.includes(user.role)
    }
    return user.role === roles
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },
}))
