// Tipos para el módulo de Tickets

export type TicketStatus = 'pendiente' | 'en_progreso' | 'completado' | 'cerrado' | 'cancelado'
export type TicketPrioridad = 'baja' | 'media' | 'alta' | 'urgente'

export interface Ticket {
  _id: string
  codigo: string
  titulo: string
  descripcion: string
  estado: TicketStatus
  prioridad: TicketPrioridad
  creador: string | Usuario
  asignado_a?: string | Usuario
  instalacion: string | InstalacionBasica
  area?: string | AreaBasica
  categoria?: string
  subcategoria?: string
  imagenes?: string[]
  fecha_creacion: string
  fecha_actualizacion?: string
  fecha_limite?: string
  fecha_cierre?: string
  comentarios?: ComentarioTicket[]
  historial?: HistorialTicket[]
}

export interface Usuario {
  _id: string
  nombre: string
  apellido: string
  Control_Usuario: string
  rol: string
}

export interface InstalacionBasica {
  _id: string
  nombre_instalacion: string
}

export interface AreaBasica {
  _id: string
  nombre_area: string
}

export interface ComentarioTicket {
  _id: string
  usuario: string | Usuario
  comentario: string
  imagen?: string
  fecha_creacion: string
}

export interface HistorialTicket {
  accion: string
  descripcion: string
  usuario: string | Usuario
  fecha: string
}

export interface CreateTicketDto {
  titulo: string
  descripcion: string
  prioridad: TicketPrioridad
  instalacion: string
  area?: string
  categoria?: string
  subcategoria?: string
  imagenes?: string[]
  fecha_limite?: string
}

export interface UpdateTicketDto {
  titulo?: string
  descripcion?: string
  estado?: TicketStatus
  prioridad?: TicketPrioridad
  asignado_a?: string
  categoria?: string
  subcategoria?: string
  fecha_limite?: string
}

export interface TicketFilter {
  estado?: TicketStatus
  prioridad?: TicketPrioridad
  asignado_a?: string
  creador?: string
  instalacion?: string
  fecha_desde?: string
  fecha_hasta?: string
  search?: string
}

export type TicketStackParamList = {
  TicketHome: undefined
  CrearTicket: undefined
  MisTickets: undefined
  TodosTickets: undefined
  ReportesTickets: undefined
  DetalleTicket: { ticketId: string }
  EditarTicket: { ticketId: string }
}
