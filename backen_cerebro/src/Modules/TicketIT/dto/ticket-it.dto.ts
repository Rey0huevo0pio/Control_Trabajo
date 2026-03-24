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
import {
  TipoTicket,
  CategoriaTicket,
  PrioridadTicket,
  EstadoTicketTipoEnum,
} from '../../../Models/T_ticket_IT_STV/index';

export class ContactoUsuarioDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}

export class CreateTicketITDto {
  @IsString()
  numero_ticket: string;

  @IsString()
  usuario_solicitante: string;

  @IsString()
  id_instalacion: string;

  @IsString()
  id_area: string;

  @IsObject()
  @ValidateNested()
  contacto_usuario: ContactoUsuarioDto;

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
  @IsEnum(EstadoTicketTipoEnum)
  estado?: EstadoTicketTipoEnum;

  @IsOptional()
  @IsString()
  asignado_a?: string;

  @IsString()
  creado_por: string;
}

export class UpdateTicketITDto {
  @IsOptional()
  @IsEnum(EstadoTicketTipoEnum)
  estado?: EstadoTicketTipoEnum;

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
