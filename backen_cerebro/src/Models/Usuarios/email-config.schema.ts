import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmailConfigDocument = EmailConfig & Document;

// Estado de la configuración
export enum EmailStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  SYNCING = 'syncing',
}

// Protocolos de seguridad
export enum SecurityType {
  SSL_TLS = 'ssl',
  STARTTLS = 'starttls',
  NONE = 'none',
}

@Schema({ timestamps: true })
export class EmailConfig {
  // Relación con usuario
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario: Types.ObjectId;

  // Dirección de correo
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  // Nombre para mostrar - NO required, se genera automáticamente
  @Prop({ type: String })
  displayName: string;

  // Credenciales (deberían estar encriptadas en producción)
  @Prop({ required: true })
  passwordEmail: string; // Encriptar con bcrypt o crypto

  // Configuración IMAP (recepción) - NO required para permitir defaults automáticos
  @Prop({ type: String, default: 'mail.tudominio.com' })
  imapHost: string;

  @Prop({ type: Number, default: 993 })
  imapPort: number;

  @Prop({ type: Boolean, default: true })
  imapSecure: boolean;

  @Prop({ default: SecurityType.SSL_TLS })
  imapSecurity: SecurityType;

  // Configuración SMTP (envío) - NO required para permitir defaults automáticos
  @Prop({ type: String, default: 'mail.tudominio.com' })
  smtpHost: string;

  @Prop({ type: Number, default: 465 })
  smtpPort: number;

  @Prop({ type: Boolean, default: true })
  smtpSecure: boolean;

  @Prop({ default: SecurityType.SSL_TLS })
  smtpSecurity: SecurityType;

  // Estado
  @Prop({ type: String, enum: EmailStatus, default: EmailStatus.INACTIVE })
  status: EmailStatus;

  // Última sincronización
  @Prop({ type: Date, default: null })
  lastSync: Date;

  // Último error
  @Prop({ type: String, default: null })
  lastError: string;

  // Verificado
  @Prop({ default: false })
  verified: boolean;

  // Fecha de verificación
  @Prop({ type: Date, default: null })
  verifiedAt: Date;

  // Configuración de sincronización
  @Prop({ default: true })
  autoSync: boolean;

  @Prop({ default: 300 })
  syncInterval: number; // segundos

  // Carpeta por defecto
  @Prop({ default: 'INBOX' })
  defaultFolder: string;

  // Límite de mensajes por sincronización
  @Prop({ default: 50 })
  messagesPerSync: number;
}

export const EmailConfigSchema = SchemaFactory.createForClass(EmailConfig);

// Índices - solo el de usuario, email ya tiene unique: true
EmailConfigSchema.index({ usuario: 1 }, { unique: false });
EmailConfigSchema.index({ status: 1 });
