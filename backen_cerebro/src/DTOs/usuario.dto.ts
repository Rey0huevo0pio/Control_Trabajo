import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsDate,
  IsArray,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { RolUsuario } from '../Models/Usuarios/usuario.schema';

// ==========================================
// DTO PARA CREAR USUARIO
// ==========================================
export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[A-Za-z0-9_-]+$/, { message: 'Control_Usuario solo permite letras, números, guiones y guiones bajos' })
  Control_Usuario: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  apellido: string;

  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsDate()
  @IsOptional()
  fechaIngreso?: Date;

  @IsString()
  @IsOptional()
  departamento?: string;

  @IsString()
  @IsOptional()
  puesto?: string;
}

// ==========================================
// DTO PARA ACTUALIZAR USUARIO
// ==========================================
export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  Control_Usuario?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(50)
  password?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
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

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsDate()
  @IsOptional()
  fechaIngreso?: Date;

  @IsBoolean()
  @IsOptional()
  primerLogin?: boolean;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  departamento?: string;

  @IsString()
  @IsOptional()
  puesto?: string;

  @IsArray()
  @IsOptional()
  permisos?: string[];
}

// ==========================================
// DTO PARA LOGIN
// ==========================================
export class LoginDto {
  @IsString()
  Control_Usuario: string;

  @IsString()
  password: string;
}

// ==========================================
// DTO PARA CAMBIAR PASSWORD
// ==========================================
export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  newPassword: string;
}

// ==========================================
// DTO PARA ACTUALIZAR PERFIL
// ==========================================
export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  apellido?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  departamento?: string;

  @IsString()
  @IsOptional()
  puesto?: string;
}

// ==========================================
// DTO PARA BÚSQUEDA DE USUARIOS
// ==========================================
export class SearchUsuariosDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsString()
  @IsOptional()
  departamento?: string;
}
