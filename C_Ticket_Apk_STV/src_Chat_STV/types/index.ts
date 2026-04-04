// Tipos para el módulo de Chat y Mensajería

export type ChatType = 'private' | 'group'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'
export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'video' | 'system'
export type UserStatus = 'online' | 'offline' | 'away' | 'busy'

export interface ChatUser {
  _id: string
  Control_Usuario: string
  nombre: string
  apellido: string
  avatar?: string
  rol: string
  status: UserStatus
  ultimoAcceso?: string
  telefono?: string
  email?: string
}

export interface ChatGroup {
  _id: string
  nombre: string
  descripcion?: string
  avatar?: string
  creador: string | ChatUser
  miembros: (string | ChatUser)[]
  admins: (string | ChatUser)[]
  fecha_creacion: string
  ultimoMensaje?: Message
  mensajesNoLeidos: number
}

export interface Message {
  _id: string
  chatId: string
  emisor: string | ChatUser
  receptor?: string | ChatUser
  tipo: MessageType
  contenido: string
  archivos?: ArchivoAdjunto[]
  estado: MessageStatus
  fecha_envio: string
  fecha_lectura?: string
  editado?: boolean
  respondidoA?: string | Message
  reacciones?: Reaccion[]
  eliminado?: boolean
}

export interface ArchivoAdjunto {
  _id: string
  url: string
  nombre: string
  tipo: string
  tamaño: number
  thumbnail?: string
}

export interface Reaccion {
  usuario: string | ChatUser
  emoji: string
  fecha: string
}

export interface ChatConversation {
  _id: string
  tipo: ChatType
  participantes: (string | ChatUser)[]
  ultimoMensaje?: Message
  mensajesNoLeidos: number
  silenciado: boolean
  fijado: boolean
  fecha_ultimo_mensaje: string
  // Para grupos
  grupo?: ChatGroup
}

export interface Noticia {
  _id: string
  titulo: string
  contenido: string
  imagen?: string
  autor: string | ChatUser
  categoria: string
  fecha_publicacion: string
  fecha_actualizacion?: string
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'
  activa: boolean
  vistas: number
}

export interface ChatFilter {
  tipo?: ChatType
  search?: string
  noLeidos?: boolean
  fijados?: boolean
}

export interface SendMessageDto {
  chatId: string
  contenido: string
  tipo?: MessageType
  archivos?: ArchivoAdjunto[]
  respondidoA?: string
}

export interface CreateGroupDto {
  nombre: string
  descripcion?: string
  miembros: string[]
  avatar?: string
}

export type ChatStackParamList = {
  ChatHome: undefined
  ChatTabs: undefined
  PrivateChats: undefined
  GroupChats: undefined
  ChatConversation: { chatId: string; tipo: ChatType; nombre?: string; avatar?: string }
  ChatSearch: undefined
  EmployeeDirectory: undefined
  NewsBoard: undefined
  NewsDetail: { noticiaId: string }
  CreateGroup: undefined
  GroupInfo: { groupId: string }
  UserProfile: { userId: string }
  MediaViewer: { mediaUrl: string; tipo: string }
}
