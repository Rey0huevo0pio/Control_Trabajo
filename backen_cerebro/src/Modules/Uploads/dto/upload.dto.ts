import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum TipoArchivo {
  INSTALACION = 'instalaciones',
  AREA = 'areas',
  CHAT_GRUPO = 'chat_grupos',
  CHAT_PRIVADO = 'chat_privados',
  PERFIL = 'perfil',
  TICKET_EVIDENCIA = 'ticket_evidencia',
  TICKET_PROBLEMA = 'ticket_problema',
}

export class UploadFileDto {
  @IsString()
  numero_control: string;

  @IsEnum(TipoArchivo)
  tipo: TipoArchivo;

  @IsOptional()
  @IsString()
  subcategoria?: string; // nombre del grupo, usuario, etc.
}
