/**
 * Tipos para el módulo de Tickets (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_P_Ticket_IT/types/index.ts
 */

export const TicketStatus = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado',
  CERRADO: 'cerrado',
  CANCELADO: 'cancelado',
};

export const TicketPrioridad = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  URGENTE: 'urgente',
};

/**
 * TicketRoutes - Rutas del módulo Tickets
 */
export const TicketRoutes = {
  TicketHome: '/tickets',
  CrearTicket: '/tickets/crear',
  MisTickets: '/tickets/mis-tickets',
  TodosTickets: '/tickets/todos',
  ReportesTickets: '/tickets/reportes',
  DetalleTicket: (ticketId) => `/tickets/${ticketId}`,
  EditarTicket: (ticketId) => `/tickets/${ticketId}/editar`,
};

/**
 * Helpers para colores de estado y prioridad
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'pendiente': return '#FF9500';
    case 'en_progreso': return '#5856D6';
    case 'completado': return '#34C759';
    case 'cerrado': return '#8E8E93';
    case 'cancelado': return '#FF3B30';
    default: return '#8E8E93';
  }
};

export const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case 'baja': return '#34C759';
    case 'media': return '#007AFF';
    case 'alta': return '#FF9500';
    case 'urgente': return '#FF3B30';
    default: return '#8E8E93';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'en_progreso': return 'En Progreso';
    case 'completado': return 'Completado';
    case 'cerrado': return 'Cerrado';
    case 'cancelado': return 'Cancelado';
    default: return status;
  }
};

export const getPrioridadLabel = (prioridad) => {
  switch (prioridad) {
    case 'baja': return 'Baja';
    case 'media': return 'Media';
    case 'alta': return 'Alta';
    case 'urgente': return 'Urgente';
    default: return prioridad;
  }
};
