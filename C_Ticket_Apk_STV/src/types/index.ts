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

// Tipos para navegación - Chat
export type ChatStackParamList = {
  ChatHome: undefined
  ChatTabs: undefined
  PrivateChats: undefined
  GroupChats: undefined
  ChatConversation: { chatId: string; tipo: 'private' | 'group'; nombre?: string; avatar?: string }
  ChatSearch: undefined
  EmployeeDirectory: undefined
  NewsBoard: undefined
  NewsDetail: { noticiaId: string }
  CreateGroup: undefined
  GroupInfo: { groupId: string }
  UserProfile: { userId: string }
  MediaViewer: { mediaUrl: string; tipo: string }
}

// Tipos para navegación - Archivero
export type ArchiveroStackParamList = {
  ArchiveroHome: undefined
  CrearArchivero: undefined
  ArchiveroDetalle: { archiveroId: string }
  CrearCarpeta: { archiveroId: string; carpetaPadreId?: string }
  CarpetaDetalle: { carpetaId: string; archiveroId: string }
  GestionarMiembros: { archiveroId: string }
  SubirArchivo: { archiveroId: string; carpetaId?: string }
  EscanearDocumento: { archiveroId: string; carpetaId?: string }
  ArchivoDetalle: { archivoId: string }
  ArchivoPreview: { archivoUrl: string; tipo: string }
  ConfiguracionArchivero: { archiveroId: string }
  ConfiguracionCarpeta: { carpetaId: string }
}

// Tipos para navegación principal
export type RootStackParamList = {
  Login: undefined
  Home: undefined
  Principal: undefined
} & InstalacionStackParamList & TicketStackParamList & ChatStackParamList & ArchiveroStackParamList

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
