// Roles disponibles en el sistema (RBAC)
export const ROLES = {
  ADMIN: 'admin',
  AGENTE: 'agente',
  SUPERVISOR: 'supervisor',
  CLIENTE: 'cliente',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Permisos CRUD por rol
export const ROLE_PERMISSIONS: Record<Role, CRUDPermissions> = {
  admin: { create: true, read: true, update: true, delete: true },
  agente: { create: true, read: true, update: true, delete: false },
  supervisor: { create: true, read: true, update: true, delete: true },
  cliente: { create: true, read: true, update: false, delete: false },
}

export interface CRUDPermissions {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

// URLs del backend
export const API_URL = 'http://192.168.1.100:3000' // Cambiar según tu backend
export const API_TIMEOUT = 10000

// Colores de la marca
export const COLORS = {
  primary: '#2196F3',
  secondary: '#9C27B0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
}
