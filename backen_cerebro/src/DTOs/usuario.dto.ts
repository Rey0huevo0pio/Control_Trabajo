import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { RolUsuario } from '../Models/Usuarios/usuario.schema';

export class CreateUsuarioDto {
  @IsString()
  Control_Usuario: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsOptional()
  fechaIngreso?: Date;
}

export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  Control_Usuario?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsOptional()
  fechaIngreso?: Date;
}

export class LoginDto {
  @IsString()
  Control_Usuario: string;

  @IsString()
  password: string;
}
