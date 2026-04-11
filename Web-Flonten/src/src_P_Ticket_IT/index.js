/**
 * ============================================================================
 * 🎫 MÓDULO TICKETS IT - Sistema de Tickets (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/src_P_Ticket_IT/
 * 
 * ESTRUCTURA:
 * - screens/ → 6 pantallas (1 implementada + 5 por crear)
 * - navigation/ → Navegación del módulo
 * - types/ → Tipos TypeScript
 * - lib/ → Configuración
 * 
 * PANTALLAS:
 * - TicketHomeScreen → Dashboard (✅ implementado)
 * - CrearTicketScreen → Form crear ticket (⏳ por crear)
 * - MisTicketsScreen → Tickets asignados (⏳ por crear)
 * - TodosTicketsScreen → Todos los tickets (⏳ por crear)
 * - ReportesTicketsScreen → Reportes y métricas (⏳ por crear)
 * - DetalleTicketScreen → Detalle de ticket (⏳ por crear)
 * 
 * SUBMÓDULOS (en móvil):
 * - P_Chat_IT-Usuarios → Chat IT-Usuarios
 * - P_Registro_Solicitudo → Registro solicitudes
 * - P_Registro_Usuario → Registro usuarios
 * - P_Solicitudes_R_S → Solicitudes R/S
 * 
 * ============================================================================
 */

export { TicketHomeScreen } from './screens/TicketHomeScreen';
export { CrearTicketScreen } from './screens/CrearTicketScreen';
export { MisTicketsScreen } from './screens/MisTicketsScreen';
export { TodosTicketsScreen } from './screens/TodosTicketsScreen';
export { DetalleTicketScreen } from './screens/DetalleTicketScreen';
export { ReportesTicketsScreen } from './screens/ReportesTicketsScreen';

// Re-exportar tipos
export { TicketStatus, TicketPrioridad, TicketRoutes, getStatusColor, getPrioridadColor, getStatusLabel, getPrioridadLabel } from './types';

export default {
  name: 'Tickets IT',
  route: '/tickets',
  icon: '🎫',
  color: '#FF9500',
  status: 'Completo',
};
