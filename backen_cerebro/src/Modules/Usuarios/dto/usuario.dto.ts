import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum RolUsuario {
  ADMIN = 'admin',
  USUARIO = 'usuario',
  SOPORTE_IT = 'soporte_it',
}

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numero_control: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;

  @IsOptional()
  @IsString()
  id_instalacion?: string;

  @IsOptional()
  @IsString()
  id_area?: string;

  @IsOptional()
  @IsString()
  foto_perfil?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;

  @IsOptional()
  @IsString()
  id_instalacion?: string;

  @IsOptional()
  @IsString()
  id_area?: string;

  @IsOptional()
  @IsString()
  foto_perfil?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class LoginUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
