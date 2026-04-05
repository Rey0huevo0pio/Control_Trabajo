// Tipos para la gestión de usuarios (alineados con el backend)

export type UserRole = 'vigilante' | 'supervisor' | 'rh' | 'it' | 'admin'

export interface UserPermission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
  export: boolean
  approve: boolean
}

export interface RoleDefinition {
  id: UserRole
  name: string
  description: string
  permissions: UserPermission
  color: string
  icon: string
}

export interface Employee {
  id: string
  Control_Usuario: string
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  departamento?: string
  puesto?: string
  rol: UserRole
  activo: boolean
  fechaIngreso?: string
  ultimoAcceso?: string
  primerLogin?: boolean
  avatar?: string
  permisos?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserDto {
  Control_Usuario: string
  password: string
  nombre: string
  apellido: string
  rol?: UserRole
  telefono?: string
  email?: string
  fechaIngreso?: string
  departamento?: string
  puesto?: string
}

export interface UpdateUserDto {
  Control_Usuario?: string
  password?: string
  nombre?: string
  apellido?: string
  rol?: UserRole
  activo?: boolean
  telefono?: string
  email?: string
  fechaIngreso?: string
  avatar?: string
  departamento?: string
  puesto?: string
  permisos?: string[]
}

export type UserFilter = {
  search?: string
  rol?: UserRole
  activo?: boolean
  departamento?: string
}
