import { useAuthStore } from '../store'
import { CRUDPermissions } from '../constants'

/**
 * Hook para verificar permisos RBAC
 */
export function usePermissions() {
  const { hasPermission, hasRole, user } = useAuthStore()

  const can = (action: keyof CRUDPermissions): boolean => {
    return hasPermission(action)
  }

  const is = (role: string | string[]): boolean => {
    return hasRole(role as any)
  }

  return {
    can,
    is,
    user,
    isAuthenticated: !!user,
  }
}
