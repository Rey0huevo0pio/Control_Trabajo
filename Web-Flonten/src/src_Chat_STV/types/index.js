/**
 * Tipos para el módulo de Chat y Mensajería (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Chat_STV/types/index.ts
 */

export const ChatType = {
  PRIVATE: 'private',
  GROUP: 'group',
};

export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
};

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  AUDIO: 'audio',
  VIDEO: 'video',
  SYSTEM: 'system',
};

export const UserStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy',
};

/**
 * ChatRoutes - Rutas del módulo Chat
 */
export const ChatRoutes = {
  ChatHome: '/chat',
  PrivateChats: '/chat/private',
  GroupChats: '/chat/grupos',
  EmailMain: '/chat/email',
  ChatConversation: (chatId, tipo) => `/chat/conversacion/${chatId}?tipo=${tipo}`,
  ChatSearch: '/chat/buscar',
  EmployeeDirectory: '/chat/directorio',
  NewsBoard: '/chat/noticias',
  NewsDetail: (noticiaId) => `/chat/noticias/${noticiaId}`,
  CreateGroup: '/chat/grupos/nuevo',
  GroupInfo: (groupId) => `/chat/grupos/${groupId}/info`,
  UserProfile: (userId) => `/chat/usuario/${userId}`,
};
