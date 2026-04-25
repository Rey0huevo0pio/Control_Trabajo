import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsDate,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { RolUsuario } from '../Models/PG/usuario.entity';

// ==========================================
// DTO PARA LOGIN
// ==========================================
export class LoginDto {
  @IsString()
  @MinLength(3)
  Control_Usuario: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// ==========================================
// DTO PARA CREAR USUARIO
// ==========================================
export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message:
      'Control_Usuario solo permite letras, números, guiones y guiones bajos',
  })
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
}

// ==========================================
// DTO PARA ACTUALIZAR USUARIO
// ==========================================
export class UpdateUsuarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  nombre?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  apellido?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  Control_Usuario?: string;

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

  @IsString()
  @IsOptional()
  departamento?: string;

  @IsString()
  @IsOptional()
  puesto?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}

// ==========================================
// DTO PARA BUSCAR USUARIOS
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
}

// ==========================================
// DTO PARA CAMBIAR CONTRASEÑA
// ==========================================
export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

// ==========================================
// DTO PARA ACTUALIZAR PERFIL
// ==========================================
export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  nombre?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  apellido?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  departamento?: string;

  @IsString()
  @IsOptional()
  puesto?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
