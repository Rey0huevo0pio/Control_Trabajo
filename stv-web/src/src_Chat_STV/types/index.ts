/**
 * Tipos para el módulo de Chat y Mensajería (Web)
 * Adaptado de: C_Ticket_Apk_STV/src_Chat_STV/types/index.ts
 */

export const ChatType = {
  PRIVATE: 'private',
  GROUP: 'group',
} as const;

export type ChatTypeValue = typeof ChatType[keyof typeof ChatType];

export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const;

export type MessageStatusValue = typeof MessageStatus[keyof typeof MessageStatus];

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  AUDIO: 'audio',
  VIDEO: 'video',
  SYSTEM: 'system',
} as const;

export type MessageTypeValue = typeof MessageType[keyof typeof MessageType];

export const UserStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy',
} as const;

export type UserStatusValue = typeof UserStatus[keyof typeof UserStatus];

export const ChatRoutes = {
  ChatHome: '/chat',
  PrivateChats: '/chat/private',
  GroupChats: '/chat/grupos',
  EmailMain: '/chat/email',
  ChatConversation: (chatId: string, tipo: string) => `/chat/conversacion/${chatId}?tipo=${tipo}`,
  ChatSearch: '/chat/buscar',
  EmployeeDirectory: '/chat/directorio',
  NewsBoard: '/chat/noticias',
  NewsDetail: (noticiaId: string) => `/chat/noticias/${noticiaId}`,
  CreateGroup: '/chat/grupos/nuevo',
  GroupInfo: (groupId: string) => `/chat/grupos/${groupId}/info`,
  UserProfile: (userId: string) => `/chat/usuario/${userId}`,
};

export type ChatRouteKey = keyof typeof ChatRoutes;