import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

export class ArchivosDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documentos?: string[];
}

export class CreateChatSTVDto {
  @IsString()
  id_usuario: string;

  @IsString()
  numero_control: string;

  @IsString()
  mensaje: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  archivos?: ArchivosDto;

  @IsOptional()
  @IsString()
  id_grupo?: string;

  @IsOptional()
  @IsBoolean()
  es_privado?: boolean;
}

export class UpdateChatSTVDto {
  @IsOptional()
  @IsString()
  mensaje?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  archivos?: ArchivosDto;

  @IsOptional()
  @IsBoolean()
  editado?: boolean;

  @IsOptional()
  @IsBoolean()
  eliminado?: boolean;
}

export class CreateChatGrupoDto {
  @IsString()
  nombre_grupo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  creador: string;

  @IsArray()
  @IsString({ each: true })
  miembros: string[];

  @IsOptional()
  @IsString()
  foto_grupo?: string;
}

export class UpdateChatGrupoDto {
  @IsOptional()
  @IsString()
  nombre_grupo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  miembros?: string[];

  @IsOptional()
  @IsString()
  foto_grupo?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class MensajeGrupoDto {
  @IsString()
  id_usuario: string;

  @IsOptional()
  @IsString()
  numero_control?: string;

  @IsString()
  mensaje: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  archivos?: ArchivosDto;
}

export class CreateChatPrivadoDto {
  @IsString()
  usuario_a: string;

  @IsString()
  usuario_b: string;
}

export class MensajePrivadoDto {
  @IsString()
  id_emisor: string;

  @IsString()
  id_receptor: string;

  @IsString()
  mensaje: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  archivos?: ArchivosDto;

  @IsOptional()
  @IsBoolean()
  leido?: boolean;
}

export class UpdateChatPrivadoDto {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  mensajes?: MensajePrivadoDto[];
}
