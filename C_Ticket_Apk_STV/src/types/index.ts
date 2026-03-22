// Tipos para autenticación y usuarios
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export type UserRole = 'admin' | 'agente' | 'supervisor' | 'cliente'
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
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
