// T_Instalaciones
export {
  Instalacion,
  InstalacionSchema,
  type InstalacionDocument,
  AreaInstalacion,
  AreaInstalacionSchema,
  type AreaInstalacionDocument,
} from './T_Instalaciones';

// Usuarios
export {
  Usuario,
  UsuarioSchema,
  type UsuarioDocument,
  RolUsuario,
} from './Usuarios';

// T_ticket_IT_STV
export {
  TicketIT,
  TicketITSchema,
  type TicketITDocument,
  TipoTicket,
  CategoriaTicket,
  EstadoTicketTipoEnum,
  PrioridadTicket,
  EstadoTicketHistorial,
  EstadoTicketHistorialSchema,
  type EstadoTicketHistorialDocument,
  EstadoTicketTipo,
} from './T_ticket_IT_STV';

// T_Chat_STV
export {
  ChatSTV,
  ChatSTVSchema,
  type ChatSTVDocument,
  ChatGrupo,
  ChatGrupoSchema,
  type ChatGrupoDocument,
  ChatPrivado,
  ChatPrivadoSchema,
  type ChatPrivadoDocument,
} from './T_Chat_STV';
