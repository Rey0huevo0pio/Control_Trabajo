// Roles disponibles en el sistema (RBAC)
export const ROLES = {
  VIGILANTE: 'vigilante',
  SUPERVISOR: 'supervisor',
  RH: 'rh',
  IT: 'it',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// Permisos por rol según el backend
export const ROLE_PERMISSIONS: Record<Role, CRUDPermissions> = {
  vigilante: { create: false, read: true, update: false, delete: false },
  supervisor: { create: false, read: true, update: false, delete: false },
  rh: { create: true, read: true, update: true, delete: false },
  it: { create: true, read: true, update: true, delete: true },
}

export interface CRUDPermissions {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

// URLs del backend
// Para Android Emulator: usa 10.0.2.2 para localhost
// Para dispositivo físico: usa la IP de tu máquina (192.168.190.120)
export const API_URL = 'http://192.168.190.120:3000/api'
export const API_TIMEOUT = 30000 // Aumentado a 30 segundos

// Colores de la marca
export const COLORS = {
  primary: '#2196F3',
  secondary: '#9C27B0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
}
