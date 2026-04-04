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

// Tipos para navegación - Instalaciones
export type InstalacionStackParamList = {
  InstalacionesHome: undefined
  RegistroInstalacion: undefined
  DetalleInstalacion: { instalacionId: string }
  RegistroArea: { instalacionId: string; instalacionNombre: string }
}

// Tipos para navegación - Tickets
export type TicketStackParamList = {
  TicketsHome: undefined
  CrearTicket: undefined
  MisTickets: undefined
  TodosTickets: undefined
  ReportesTickets: undefined
  DetalleTicket: { ticketId: string }
  EditarTicket: { ticketId: string }
}

// Tipos para navegación principal
export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Principal: undefined
} & InstalacionStackParamList & TicketStackParamList

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

// Tipos para Instalaciones y Áreas
export interface Instalacion {
  _id: string
  nombre_instalacion: string
  nombre_registrador: string
  ubicacion: Ubicacion
  descripcion?: string
  foto?: string
  responsable: string
  personal_asignado?: string[]
  activa: boolean
  creado_por: string
  fecha_creacion?: string
  fecha_actualizacion?: string
}

export interface Ubicacion {
  direccion: string
  coordenadas?: {
    lat: number
    lng: number
  }
}

export interface AreaInstalacion {
  _id: string
  nombre_area: string
  descripcion?: string
  id_instalacion: string | Instalacion
  creado_por: string
  fecha_creacion?: string
}

// DTOs para creación
export interface CreateInstalacionDto {
  nombre_instalacion: string
  nombre_registrador: string
  ubicacion: {
    direccion: string
    coordenadas?: {
      lat: number
      lng: number
    }
  }
  descripcion?: string
  foto?: string
  responsable: string
  personal_asignado?: string[]
  activa?: boolean
  creado_por: string
}

export interface CreateAreaInstalacionDto {
  nombre_area: string
  descripcion?: string
  id_instalacion: string
  creado_por: string
}
