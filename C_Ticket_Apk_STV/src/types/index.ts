// Tipos para autenticación y usuarios
export interface User {
  id: string
  Control_Usuario: string
  nombre: string
  apellido: string
  rol: UserRole
  activo: boolean
  telefono?: string
  fechaIngreso?: string
  permisos: string[]
}

export type UserRole = 'vigilante' | 'supervisor' | 'rh' | 'it'
export type Role = UserRole

// Tipos para navegación
export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Principal: undefined
}

// Tipos para API
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface LoginRequest {
  Control_Usuario: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
