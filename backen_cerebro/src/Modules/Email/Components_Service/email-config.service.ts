import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  EmailConfig,
  EmailConfigDocument,
  EmailStatus,
} from '../../../Models/Usuarios/email-config.schema';
import {
  CreateEmailConfigDto,
  UpdateEmailConfigDto,
  TestEmailConnectionDto,
} from '../../../DTOs/email.dto';
import { EmailCryptoService } from './email-crypto.service';
import { EmailConnectionService } from './email-connection.service';

@Injectable()
export class EmailConfigService {
  constructor(
    @InjectModel(EmailConfig.name)
    private emailConfigModel: Model<EmailConfigDocument>,
    private cryptoService: EmailCryptoService,
    private connectionService: EmailConnectionService,
  ) {}

  // ==========================================
  // CREAR CONFIGURACIÓN DE CORREO
  // ==========================================
  async createConfig(
    usuarioId: string,
    createDto: CreateEmailConfigDto,
  ): Promise<any> {
    // Verificar si ya existe configuración para este usuario
    const existingConfig = await this.emailConfigModel.findOne({
      usuario: new Types.ObjectId(usuarioId),
    });

    if (existingConfig) {
      throw new ConflictException(
        'El usuario ya tiene una configuración de correo',
      );
    }

    // Verificar si el email ya está registrado
    const existingEmail = await this.emailConfigModel.findOne({
      email: createDto.email.toLowerCase(),
    });

    if (existingEmail) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Crear configuración - SIN spread para evitar valores vacíos
    const config = new this.emailConfigModel({
      usuario: new Types.ObjectId(usuarioId),
      email: createDto.email.toLowerCase(),
      displayName:
        createDto.displayName || createDto.email.split('@')[0] || 'Usuario',
      passwordEmail: this.cryptoService.encryptPassword(
        createDto.passwordEmail,
      ),
      status: EmailStatus.INACTIVE,
      // Usar valores por defecto si vienen vacíos
      imapHost:
        createDto.imapHost && createDto.imapHost.trim()
          ? createDto.imapHost
          : 'bh8966.banahosting.com',
      imapPort: createDto.imapPort || 993,
      imapSecure:
        createDto.imapSecure !== undefined ? createDto.imapSecure : true,
      smtpHost:
        createDto.smtpHost && createDto.smtpHost.trim()
          ? createDto.smtpHost
          : 'bh8966.banahosting.com',
      smtpPort: createDto.smtpPort || 465,
      smtpSecure:
        createDto.smtpSecure !== undefined ? createDto.smtpSecure : true,
    });

    await config.save();

    return {
      success: true,
      message: 'Configuración de correo creada correctamente',
      data: this.sanitizeConfig(config),
    };
  }

  // ==========================================
  // OBTENER TODAS LAS CONFIGURACIONES (Debug)
  // ==========================================
  async getAllConfigs(): Promise<any[]> {
    console.log('\n📧 [EmailConfigService] getAllConfigs');
    const configs = await this.emailConfigModel
      .find()
      .populate('usuario', 'Control_Usuario nombre apellido')
      .exec();

    console.log(
      `📩 [EmailConfigService] Encontradas ${configs.length} configuraciones`,
    );
    configs.forEach((c: any) => {
      const usuario = c.usuario;
      console.log(
        `  - Usuario: ${usuario?.Control_Usuario || 'N/A'} | Email: ${c.email} | Status: ${c.status}`,
      );
    });

    return configs.map((c) => this.sanitizeConfig(c));
  }

  // ==========================================
  // OBTENER CONFIGURACIÓN POR USUARIO
  // ==========================================
  async getConfigByUsuario(usuarioId: string): Promise<any> {
    console.log('\n📧 [EmailConfigService] getConfigByUsuario, ID:', usuarioId);

    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    console.log(
      '📩 [EmailConfigService] Config encontrada:',
      config ? '✅ SÍ' : '❌ NO',
    );
    if (config) {
      console.log('📧 [EmailConfigService] Email:', config.email);
      console.log('📧 [EmailConfigService] Status:', config.status);
    }

    if (!config) {
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    }

    return this.sanitizeConfig(config);
  }

  // ==========================================
  // ACTUALIZAR CONFIGURACIÓN
  // ==========================================
  async updateConfig(
    usuarioId: string,
    updateDto: UpdateEmailConfigDto,
  ): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    if (!config) {
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    }

    // Si se actualiza la contraseña, encriptarla
    if (updateDto.passwordEmail) {
      updateDto.passwordEmail = this.cryptoService.encryptPassword(
        updateDto.passwordEmail,
      );
    }

    // Si se actualiza el email, convertir a minúsculas
    if (updateDto.email) {
      updateDto.email = updateDto.email.toLowerCase();
    }

    const updatedConfig = await this.emailConfigModel
      .findByIdAndUpdate(config._id, updateDto, { new: true })
      .exec();

    return {
      success: true,
      message: 'Configuración actualizada correctamente',
      data: this.sanitizeConfig(updatedConfig),
    };
  }

  // ==========================================
  // PROBAR CONEXIÓN (IMAP y SMTP)
  // ==========================================
  async testConnection(
    usuarioId: string,
    testDto: TestEmailConnectionDto,
  ): Promise<any> {
    const results = {
      imap: { success: false, error: null as string | null },
      smtp: { success: false, error: null as string | null },
    };

    // Probar IMAP
    try {
      await this.connectionService.testImapConnection({
        email: testDto.email,
        password: testDto.passwordEmail,
        imapHost: testDto.imapHost,
        imapPort: testDto.imapPort,
        imapSecure: testDto.imapSecure,
        smtpHost: testDto.smtpHost,
        smtpPort: testDto.smtpPort,
        smtpSecure: testDto.smtpSecure,
      });
      results.imap.success = true;
    } catch (error: any) {
      results.imap.error = error.message;
    }

    // Probar SMTP
    try {
      await this.connectionService.testSmtpConnection({
        email: testDto.email,
        password: testDto.passwordEmail,
        imapHost: testDto.imapHost,
        imapPort: testDto.imapPort,
        imapSecure: testDto.imapSecure,
        smtpHost: testDto.smtpHost,
        smtpPort: testDto.smtpPort,
        smtpSecure: testDto.smtpSecure,
      });
      results.smtp.success = true;
    } catch (error: any) {
      results.smtp.error = error.message;
    }

    return {
      success: results.imap.success && results.smtp.success,
      message:
        results.imap.success && results.smtp.success
          ? 'Conexión exitosa a IMAP y SMTP'
          : 'Error en la conexión',
      data: results,
    };
  }

  // ==========================================
  // ACTIVAR CONFIGURACIÓN SIN PROBAR (Manual)
  // ==========================================
  async activateConfigForce(usuarioId: string): Promise<any> {
    console.log(
      '\n📧 [EmailConfigService] activateConfigForce, ID:',
      usuarioId,
    );

    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    if (!config) {
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    }

    // Activar sin probar conexión
    config.status = EmailStatus.ACTIVE;
    config.verified = true;
    config.verifiedAt = new Date();
    await config.save();

    console.log('✅ [EmailConfigService] Configuración activada manualmente');

    return {
      success: true,
      message: 'Configuración activada manualmente',
      data: this.sanitizeConfig(config),
    };
  }

  // ==========================================
  // ACTIVAR CONFIGURACIÓN
  // ==========================================
  async activateConfig(usuarioId: string): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    if (!config) {
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    }

    // Probar conexión antes de activar
    try {
      await this.connectionService.testImapConnection({
        email: config.email,
        password: this.cryptoService.decryptPassword(config.passwordEmail),
        imapHost: config.imapHost,
        imapPort: config.imapPort,
        imapSecure: config.imapSecure,
        smtpHost: config.smtpHost,
        smtpPort: config.smtpPort,
        smtpSecure: config.smtpSecure,
      });

      config.status = EmailStatus.ACTIVE;
      config.verified = true;
      config.verifiedAt = new Date();
      await config.save();

      return {
        success: true,
        message: 'Configuración activada correctamente',
        data: this.sanitizeConfig(config),
      };
    } catch (error: any) {
      config.status = EmailStatus.ERROR;
      config.lastError = error.message;
      await config.save();

      throw new BadRequestException(
        `No se pudo activar la configuración: ${error.message}`,
      );
    }
  }

  // ==========================================
  // TOGGLE EMAIL STATUS (Active ↔ Inactive only)
  // ==========================================
  async toggleEmailStatus(usuarioId: string): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    if (!config) {
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    }

    // Solo permite toggle entre active e inactive
    const newStatus =
      config.status === EmailStatus.ACTIVE
        ? EmailStatus.INACTIVE
        : EmailStatus.ACTIVE;

    config.status = newStatus;
    await config.save();

    console.log(
      `📧 [EmailConfigService] Toggle status: ${config.email} → ${newStatus}`,
    );

    return {
      success: true,
      message: `Correo ${newStatus === EmailStatus.ACTIVE ? 'activado' : 'desactivado'} correctamente`,
      data: this.sanitizeConfig(config),
    };
  }

  // ==========================================
  // ELIMINAR CONFIGURACIÓN
  // ==========================================
  async deleteConfig(usuarioId: string): Promise<void> {
    const result = await this.emailConfigModel
      .findOneAndDelete({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    if (!result) {
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    }
  }

  // ==========================================
  // SANITIZAR CONFIGURACIÓN (quitar datos sensibles)
  // ==========================================
  private sanitizeConfig(config: any): object {
    return {
      id: config._id,
      email: config.email,
      displayName: config.displayName,
      imapHost: config.imapHost,
      imapPort: config.imapPort,
      imapSecure: config.imapSecure,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpSecure: config.smtpSecure,
      status: config.status,
      lastSync: config.lastSync,
      lastError: config.lastError,
      verified: config.verified,
      verifiedAt: config.verifiedAt,
      autoSync: config.autoSync,
      syncInterval: config.syncInterval,
      defaultFolder: config.defaultFolder,
      messagesPerSync: config.messagesPerSync,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}
