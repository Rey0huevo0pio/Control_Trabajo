import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EmailConfig,
  EmailStatus,
} from '../../../Models/PG/email-config.entity';
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
    @InjectRepository(EmailConfig)
    private emailConfigRepo: Repository<EmailConfig>,
    private cryptoService: EmailCryptoService,
    private connectionService: EmailConnectionService,
  ) {}

  async createConfig(
    usuarioId: string,
    dto: CreateEmailConfigDto,
  ): Promise<any> {
    const existsByUser = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId },
    });
    if (existsByUser)
      throw new ConflictException(
        'El usuario ya tiene una configuración de correo',
      );

    const existsByEmail = await this.emailConfigRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existsByEmail)
      throw new ConflictException('El correo electrónico ya está registrado');

    const config = this.emailConfigRepo.create({
      usuario_id: usuarioId,
      email: dto.email.toLowerCase(),
      displayName: dto.displayName || dto.email.split('@')[0],
      passwordEmail: this.cryptoService.encryptPassword(dto.passwordEmail),
      imapHost: dto.imapHost?.trim() || 'bh8966.banahosting.com',
      imapPort: dto.imapPort || 993,
      imapSecure: dto.imapSecure ?? true,
      smtpHost: dto.smtpHost?.trim() || 'bh8966.banahosting.com',
      smtpPort: dto.smtpPort || 465,
      smtpSecure: dto.smtpSecure ?? true,
      status: EmailStatus.INACTIVE,
    });

    await this.emailConfigRepo.save(config);
    return {
      success: true,
      message: 'Configuración creada correctamente',
      data: this.sanitize(config),
    };
  }

  async getAllConfigs(): Promise<any[]> {
    const configs = await this.emailConfigRepo.find();
    return configs.map((c) => this.sanitize(c));
  }

  async getConfigByUsuario(usuarioId: string): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId },
    });
    if (!config)
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    return this.sanitize(config);
  }

  async updateConfig(
    usuarioId: string,
    dto: UpdateEmailConfigDto,
  ): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId },
    });
    if (!config)
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );

    if (dto.passwordEmail)
      dto.passwordEmail = this.cryptoService.encryptPassword(dto.passwordEmail);
    if (dto.email) dto.email = dto.email.toLowerCase();

    await this.emailConfigRepo.update(config.id, dto);
    const updated = await this.emailConfigRepo.findOne({
      where: { id: config.id },
    });
    return {
      success: true,
      message: 'Configuración actualizada correctamente',
      data: this.sanitize(updated),
    };
  }

  async testConnection(
    usuarioId: string,
    dto: TestEmailConnectionDto,
  ): Promise<any> {
    const results = {
      imap: { success: false, error: null as string | null },
      smtp: { success: false, error: null as string | null },
    };

    try {
      await this.connectionService.testImapConnection({
        email: dto.email,
        password: dto.passwordEmail,
        imapHost: dto.imapHost,
        imapPort: dto.imapPort,
        imapSecure: dto.imapSecure,
        smtpHost: dto.smtpHost,
        smtpPort: dto.smtpPort,
        smtpSecure: dto.smtpSecure,
      });
      results.imap.success = true;
    } catch (e: any) {
      results.imap.error = e.message;
    }

    try {
      await this.connectionService.testSmtpConnection({
        email: dto.email,
        password: dto.passwordEmail,
        imapHost: dto.imapHost,
        imapPort: dto.imapPort,
        imapSecure: dto.imapSecure,
        smtpHost: dto.smtpHost,
        smtpPort: dto.smtpPort,
        smtpSecure: dto.smtpSecure,
      });
      results.smtp.success = true;
    } catch (e: any) {
      results.smtp.error = e.message;
    }

    return {
      success: results.imap.success && results.smtp.success,
      message:
        results.imap.success && results.smtp.success
          ? 'Conexión exitosa'
          : 'Error en la conexión',
      data: results,
    };
  }

  async activateConfigForce(usuarioId: string): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId },
    });
    if (!config)
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );

    await this.emailConfigRepo.update(config.id, {
      status: EmailStatus.ACTIVE,
      verified: true,
      verifiedAt: new Date(),
    });
    const updated = await this.emailConfigRepo.findOne({
      where: { id: config.id },
    });
    return {
      success: true,
      message: 'Configuración activada manualmente',
      data: this.sanitize(updated),
    };
  }

  async activateConfig(usuarioId: string): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId },
    });
    if (!config)
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );

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
      } as any);

      await this.emailConfigRepo.update(config.id, {
        status: EmailStatus.ACTIVE,
        verified: true,
        verifiedAt: new Date(),
      });
      const updated = await this.emailConfigRepo.findOne({
        where: { id: config.id },
      });
      return {
        success: true,
        message: 'Configuración activada correctamente',
        data: this.sanitize(updated),
      };
    } catch (e: any) {
      await this.emailConfigRepo.update(config.id, {
        status: EmailStatus.ERROR,
        lastError: e.message,
      });
      throw new BadRequestException(`No se pudo activar: ${e.message}`);
    }
  }

  async toggleEmailStatus(usuarioId: string): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId },
    });
    if (!config)
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );

    const newStatus =
      config.status === EmailStatus.ACTIVE
        ? EmailStatus.INACTIVE
        : EmailStatus.ACTIVE;
    await this.emailConfigRepo.update(config.id, { status: newStatus });
    const updated = await this.emailConfigRepo.findOne({
      where: { id: config.id },
    });
    return {
      success: true,
      message: `Correo ${newStatus === EmailStatus.ACTIVE ? 'activado' : 'desactivado'}`,
      data: this.sanitize(updated),
    };
  }

  async deleteConfig(usuarioId: string): Promise<void> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId },
    });
    if (!config)
      throw new NotFoundException(
        'No se encontró configuración de correo para este usuario',
      );
    await this.emailConfigRepo.delete(config.id);
  }

  private sanitize(
    config: EmailConfig,
  ): Omit<EmailConfig, 'passwordEmail'> | null {
    if (!config) return null;
    const rest = { ...config } as Record<string, unknown>;
    delete rest.passwordEmail;
    return rest as Omit<EmailConfig, 'passwordEmail'>;
  }
}
