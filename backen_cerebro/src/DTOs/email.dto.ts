import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsEmail,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  EmailStatus,
  SecurityType,
} from '../Models/Usuarios/email-config.schema';

// ==========================================
// DTO PARA CREAR CONFIGURACIÓN DE CORREO
// ==========================================
export class CreateEmailConfigDto {
  @IsEmail()
  email: string;

  @IsString()
  displayName: string;

  @IsString()
  passwordEmail: string;

  // IMAP
  @IsString()
  imapHost: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  imapPort: number;

  @IsBoolean()
  imapSecure: boolean;

  @IsEnum(SecurityType)
  @IsOptional()
  imapSecurity?: SecurityType;

  // SMTP
  @IsString()
  smtpHost: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  smtpPort: number;

  @IsBoolean()
  smtpSecure: boolean;

  @IsEnum(SecurityType)
  @IsOptional()
  smtpSecurity?: SecurityType;

  // Opcional
  @IsBoolean()
  @IsOptional()
  autoSync?: boolean;

  @IsNumber()
  @Min(60)
  @Max(3600)
  @IsOptional()
  syncInterval?: number;

  @IsString()
  @IsOptional()
  defaultFolder?: string;

  @IsNumber()
  @Min(1)
  @Max(500)
  @IsOptional()
  messagesPerSync?: number;
}

// ==========================================
// DTO PARA ACTUALIZAR CONFIGURACIÓN
// ==========================================
export class UpdateEmailConfigDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  passwordEmail?: string;

  @IsString()
  @IsOptional()
  imapHost?: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  imapPort?: number;

  @IsBoolean()
  @IsOptional()
  imapSecure?: boolean;

  @IsEnum(SecurityType)
  @IsOptional()
  imapSecurity?: SecurityType;

  @IsString()
  @IsOptional()
  smtpHost?: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  smtpPort?: number;

  @IsBoolean()
  @IsOptional()
  smtpSecure?: boolean;

  @IsEnum(SecurityType)
  @IsOptional()
  smtpSecurity?: SecurityType;

  @IsEnum(EmailStatus)
  @IsOptional()
  status?: EmailStatus;

  @IsBoolean()
  @IsOptional()
  autoSync?: boolean;

  @IsNumber()
  @Min(60)
  @Max(3600)
  @IsOptional()
  syncInterval?: number;
}

// ==========================================
// DTO PARA VERIFICAR CONEXIÓN
// ==========================================
export class TestEmailConnectionDto {
  @IsEmail()
  email: string;

  @IsString()
  passwordEmail: string;

  @IsString()
  imapHost: string;

  @IsNumber()
  imapPort: number;

  @IsBoolean()
  imapSecure: boolean;

  @IsString()
  smtpHost: string;

  @IsNumber()
  smtpPort: number;

  @IsBoolean()
  smtpSecure: boolean;
}

// ==========================================
// DTO PARA ENVIAR CORREO
// ==========================================
export class SendEmailDto {
  @IsString()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString({ each: true })
  @IsOptional()
  attachments?: string[]; // URLs de archivos adjuntos

  @IsString()
  @IsOptional()
  cc?: string;

  @IsString()
  @IsOptional()
  bcc?: string;
}

// ==========================================
// DTO PARA OBTENER CORREOS
// ==========================================
export class GetEmailsDto {
  @IsString()
  @IsOptional()
  folder?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  page?: number;

  @IsNumber()
  @Min(1)
  @Max(500)
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 50))
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  unreadOnly?: boolean;
}
