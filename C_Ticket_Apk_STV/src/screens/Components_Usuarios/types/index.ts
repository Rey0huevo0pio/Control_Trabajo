// Tipos para la gestión de usuarios

export type UserRole = 'admin' | 'it' | 'rh' | 'supervisor' | 'empleado' | 'guest'

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
  _id: string
  Control_Usuario: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  departamento: string
  puesto: string
  rol: UserRole
  estado: 'activo' | 'inactivo' | 'suspendido'
  fecha_ingreso: string
  fecha_creacion: string
  avatar?: string
  ultimoAcceso?: string
  permisos?: Partial<UserPermission>
}

export interface CreateUserDto {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  departamento: string
  puesto: string
  rol: UserRole
  password: string
}

export interface UpdateUserDto {
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  departamento?: string
  puesto?: string
  rol?: UserRole
  estado?: 'activo' | 'inactivo' | 'suspendido'
  permisos?: Partial<UserPermission>
}

export type UserFilter = {
  search?: string
  rol?: UserRole
  departamento?: string
  estado?: 'activo' | 'inactivo' | 'suspendido'
}
