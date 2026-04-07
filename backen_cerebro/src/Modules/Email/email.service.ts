import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import {
  EmailConfig,
  EmailConfigDocument,
  EmailStatus,
} from '../../Models/Usuarios/email-config.schema';
import {
  CreateEmailConfigDto,
  UpdateEmailConfigDto,
  TestEmailConnectionDto,
  SendEmailDto,
  GetEmailsDto,
} from '../../DTOs/email.dto';
import {
  EmailConfigService,
  EmailFetcherService,
  EmailSenderService,
  EmailCacheService,
} from './Components_Service';

export interface EmailMessage {
  id: string;
  uid: number;
  from: string;
  to: string;
  subject: string;
  date: Date;
  text: string;
  html: string;
  attachments: any[];
  seen: boolean;
  flagged: boolean;
  folder?: string;
}

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailConfig.name)
    private emailConfigModel: Model<EmailConfigDocument>,
    private configService: EmailConfigService,
    private fetcherService: EmailFetcherService,
    private senderService: EmailSenderService,
    private cacheService: EmailCacheService,
  ) {}

  // ==========================================
  // CONFIGURACIÓN DE CORREO (Delegar a EmailConfigService)
  // ==========================================
  async createConfig(
    usuarioId: string,
    createDto: CreateEmailConfigDto,
  ): Promise<any> {
    return this.configService.createConfig(usuarioId, createDto);
  }

  async getAllConfigs(): Promise<any[]> {
    return this.configService.getAllConfigs();
  }

  async getConfigByUsuario(usuarioId: string): Promise<any> {
    return this.configService.getConfigByUsuario(usuarioId);
  }

  async updateConfig(
    usuarioId: string,
    updateDto: UpdateEmailConfigDto,
  ): Promise<any> {
    return this.configService.updateConfig(usuarioId, updateDto);
  }

  async testConnection(
    usuarioId: string,
    testDto: TestEmailConnectionDto,
  ): Promise<any> {
    return this.configService.testConnection(usuarioId, testDto);
  }

  async activateConfigForce(usuarioId: string): Promise<any> {
    return this.configService.activateConfigForce(usuarioId);
  }

  async activateConfig(usuarioId: string): Promise<any> {
    return this.configService.activateConfig(usuarioId);
  }

  async toggleEmailStatus(usuarioId: string): Promise<any> {
    return this.configService.toggleEmailStatus(usuarioId);
  }

  async deleteConfig(usuarioId: string): Promise<void> {
    return this.configService.deleteConfig(usuarioId);
  }

  // ==========================================
  // OBTENER CORREOS (IMAP) - DELEGAR A EMAIL FETCHER SERVICE
  // ==========================================
  async getEmails(usuarioId: string, getEmailsDto: GetEmailsDto): Promise<any> {
    console.log('\n📧 [EmailService] getEmails - userId:', usuarioId);
    console.log('📧 [EmailService] getEmails - params:', getEmailsDto);

    const config = await this.emailConfigModel
      .findOne({
        usuario: new Types.ObjectId(usuarioId),
      })
      .exec();

    console.log(
      '📩 [EmailService] Config encontrada:',
      config ? '✅ SÍ' : '❌ NO',
    );
    if (config) {
      console.log('📧 [EmailService] Email:', config.email);
      console.log('📧 [EmailService] Status:', config.status);
      console.log('📧 [EmailService] IMAP Host:', config.imapHost);
    }

    if (!config) {
      console.log(
        '❌ [EmailService] No hay configuración de correo para este usuario',
      );
      return {
        success: false,
        message: 'No hay configuración de correo para este usuario',
        data: { emails: [], total: 0 },
      };
    }

    if (config.status !== EmailStatus.ACTIVE) {
      console.log(
        '⚠️ [EmailService] La configuración no está activa. Status:',
        config.status,
      );
      return {
        success: false,
        message: `La configuración de correo no está activa. Status: ${config.status}. Actívala primero.`,
        data: { emails: [], total: 0 },
      };
    }

    try {
      // Usar el fetcher service con caché integrada
      const result = await this.fetcherService.getEmailsLegacy(
        {
          email: config.email,
          password: this.decryptPassword(config.passwordEmail),
          imapHost: config.imapHost,
          imapPort: config.imapPort,
          imapSecure: config.imapSecure,
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          smtpSecure: config.smtpSecure,
        },
        getEmailsDto.folder || 'INBOX',
        usuarioId,
        {
          unreadOnly: getEmailsDto.unreadOnly,
          page: getEmailsDto.page,
          limit: getEmailsDto.limit,
        },
      );

      // Actualizar última sincronización
      void this.emailConfigModel
        .findOneAndUpdate(
          { usuario: new Types.ObjectId(usuarioId) },
          { lastSync: new Date() },
        )
        .exec();

      return {
        success: true,
        data: {
          emails: result.emails,
          total: result.total,
          page: getEmailsDto.page || 1,
          limit: getEmailsDto.limit || 50,
        },
      };
    } catch (error: any) {
      console.log('❌ [EmailService] Error getting emails:', error.message);
      return {
        success: true,
        message: `Error obteniendo correos: ${error.message}`,
        data: { emails: [], total: 0 },
      };
    }
  }

  // ==========================================
  // OBTENER SOLO UIDs DE UNA CARPETA (CON CACHÉ)
  // ==========================================
  async getMessageUIDs(usuarioId: string, folder: string): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    if (!config || config.status !== EmailStatus.ACTIVE) {
      return { success: true, data: { uids: [], total: 0 } };
    }

    try {
      const uids = await this.fetcherService.getMessageUIDs(
        {
          email: config.email,
          password: this.decryptPassword(config.passwordEmail),
          imapHost: config.imapHost,
          imapPort: config.imapPort,
          imapSecure: config.imapSecure,
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          smtpSecure: config.smtpSecure,
        },
        folder,
        usuarioId,
      );

      return {
        success: true,
        data: { uids, total: uids.length },
      };
    } catch (error: any) {
      console.log('❌ [EmailService] Error getting UIDs:', error.message);
      return { success: true, data: { uids: [], total: 0 } };
    }
  }

  // ==========================================
  // OBTENER CORREOS POR UIDs ESPECÍFICOS (CON CACHÉ Y MULTIMEDIA)
  // ==========================================
  async getMessagesByUIDs(
    usuarioId: string,
    folder: string,
    uids: number[],
  ): Promise<any> {
    if (uids.length === 0) {
      return { success: true, data: { emails: [], total: 0 } };
    }

    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    if (!config || config.status !== EmailStatus.ACTIVE) {
      return { success: true, data: { emails: [], total: 0 } };
    }

    try {
      const emails = await this.fetcherService.getMessagesByUIDs(
        {
          email: config.email,
          password: this.decryptPassword(config.passwordEmail),
          imapHost: config.imapHost,
          imapPort: config.imapPort,
          imapSecure: config.imapSecure,
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          smtpSecure: config.smtpSecure,
        },
        folder,
        uids,
        usuarioId,
      );

      return {
        success: true,
        data: { emails, total: emails.length },
      };
    } catch (error: any) {
      console.log(
        '❌ [EmailService] Error getting messages by UIDs:',
        error.message,
      );
      return { success: true, data: { emails: [], total: 0 } };
    }
  }

  // ==========================================
  // ENVIAR CORREO (SMTP) - DELEGAR A EMAIL SENDER SERVICE
  // ==========================================
  async sendEmail(usuarioId: string, sendDto: SendEmailDto): Promise<any> {
    return this.senderService.sendEmail(usuarioId, sendDto);
  }

  // ==========================================
  // OBTENER ESTADÍSTICAS DE CACHÉ
  // ==========================================
  getCacheStats(): any {
    return this.cacheService.getCacheStats();
  }

  // ==========================================
  // LIMPIAR CACHÉ
  // ==========================================
  clearCache(): void {
    this.cacheService.clearCache();
  }

  // ==========================================
  // MÉTODOS PRIVADOS DE COMPATIBILIDAD
  // ==========================================
  private decryptPassword(encrypted: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(
      process.env.EMAIL_ENCRYPTION_KEY || 'default_encryption_key_32',
      'salt',
      32,
    );
    const [ivHex, encryptedHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
