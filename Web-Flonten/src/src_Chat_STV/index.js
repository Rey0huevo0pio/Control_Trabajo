/**
 * ============================================================================
 * 💬 MÓDULO CHAT - Mensajería y Email (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/
 * 
 * ESTRUCTURA:
 * - screens/ → 7 pantallas + email components
 * - navigation/ → Navegación del módulo
 * - types/ → Tipos TypeScript
 * - services/ → Servicios de email
 * 
 * PANTALLAS:
 * - ChatHomeScreen → Hub de mensajería
 * - PrivateChatsScreen → Chats privados
 * - GroupChatsScreen → Chats grupales
 * - EmployeeDirectoryScreen → Directorio
 * - NewsBoardScreen → Noticias
 * - ChatSearchScreen → Búsqueda
 * - EmailMainScreen → Email client
 * 
 * ============================================================================
 */

export { ChatHomeScreen } from './screens/ChatHomeScreen';
export { PrivateChatsScreen } from './screens/PrivateChatsScreen';
export { GroupChatsScreen } from './screens/GroupChatsScreen';
export { EmployeeDirectoryScreen } from './screens/EmployeeDirectoryScreen';
export { NewsBoardScreen } from './screens/NewsBoardScreen';
export { ChatSearchScreen } from './screens/ChatSearchScreen';
export { EmailMainScreen } from './screens/EmailMainScreen';

// Re-exportar tipos
export { ChatType, MessageStatus, MessageType, UserStatus, ChatRoutes } from './types';

export default {
  name: 'Chat',
  route: '/chat',
  icon: '💬',
  color: '#5856D6',
};
