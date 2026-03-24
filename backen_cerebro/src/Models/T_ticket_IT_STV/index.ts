export {
  TicketIT,
  TicketITSchema,
  type TicketITDocument,
  TipoTicket,
  CategoriaTicket,
  EstadoTicket as EstadoTicketTipoEnum,
  PrioridadTicket,
  ContactoUsuario,
  ContactoUsuarioSchema,
} from './T_ticket_IT_STV.schema';

export {
  EstadoTicket as EstadoTicketHistorial,
  EstadoTicketSchema as EstadoTicketHistorialSchema,
  type EstadoTicketDocument as EstadoTicketHistorialDocument,
  EstadoTicketTipo,
} from './T_Estado_Ticket.schema';
