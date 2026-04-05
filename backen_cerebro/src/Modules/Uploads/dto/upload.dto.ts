import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum TipoArchivo {
  // Instalaciones
  INSTALACION = 'instalaciones',
  AREA = 'areas',
  
  // Chat
  CHAT_GRUPO = 'chat_grupos',
  CHAT_PRIVADO = 'chat_privados',
  CHAT_ARCHIVO = 'chat_archivos',
  
  // Perfil
  PERFIL = 'perfil',
  
  // Tickets
  TICKET_EVIDENCIA = 'ticket_evidencia',
  TICKET_PROBLEMA = 'ticket_problema',
  TICKET_ADJUNTO = 'ticket_adjunto',
  
  // Archivero/Documentos
  ARCHIVERO_DOCUMENTO = 'archivero_documento',
  ARCHIVERO_IMAGEN = 'archivero_imagen',
  ARCHIVERO_VIDEO = 'archivero_video',
  ARCHIVERO_ARCHIVO = 'archivero_archivo',
  
  // Noticias
  NOTICIA_IMAGEN = 'noticia_imagen',
  NOTICIA_ADJUNTO = 'noticia_adjunto',
}

export class UploadFileDto {
  @IsString()
  numero_control: string;

  @IsEnum(TipoArchivo)
  tipo: TipoArchivo;

  @IsOptional()
  @IsString()
  subcategoria?: string; // nombre del grupo, usuario, archivero, etc.
}
