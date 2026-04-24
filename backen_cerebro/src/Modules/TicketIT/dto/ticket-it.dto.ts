import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsObject,
  ValidateNested,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TipoTicket,
  CategoriaTicket,
  PrioridadTicket,
  EstadoTicketEnum,
} from '../../../Models/PG/ticket-it.entity';

export class ContactoUsuarioDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}

export class CreateTicketITDto {
  @IsOptional()
  @IsString()
  numero_ticket?: string;

  @IsString()
  usuario_solicitante: string;

  @IsString()
  id_instalacion: string;

  @IsString()
  id_area: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactoUsuarioDto)
  contacto_usuario?: ContactoUsuarioDto;

  @IsEnum(TipoTicket)
  tipo: TipoTicket;

  @IsEnum(CategoriaTicket)
  categoria: CategoriaTicket;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  nivel_afectacion: number;

  @IsOptional()
  @IsEnum(PrioridadTicket)
  prioridad?: PrioridadTicket;

  @IsOptional()
  @IsEnum(EstadoTicketEnum)
  estado?: EstadoTicketEnum;

  @IsOptional()
  @IsString()
  asignado_a?: string;

  @IsString()
  creado_por: string;
}

export class UpdateTicketITDto {
  @IsOptional()
  @IsEnum(EstadoTicketEnum)
  estado?: EstadoTicketEnum;

  @IsOptional()
  @IsEnum(PrioridadTicket)
  prioridad?: PrioridadTicket;

  @IsOptional()
  @IsString()
  asignado_a?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  nivel_afectacion?: number;
}

export class CreateEstadoTicketDto {
  @IsString()
  id_ticket: string;

  @IsString()
  estado: string;

  @IsString()
  id_usuario: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsArray()
  evidencia?: string[];
}

export class UpdateEstadoTicketDto {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  evidencia?: string[];
}
