import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EmailConfig,
  EmailStatus,
} from '../../../Models/PG/email-config.entity';
import { SendEmailDto } from '../../../DTOs/email.dto';
import { EmailConnectionService } from './email-connection.service';
import { EmailCryptoService } from './email-crypto.service';

@Injectable()
export class EmailSenderService {
  constructor(
    @InjectRepository(EmailConfig)
    private emailConfigRepo: Repository<EmailConfig>,
    private connectionService: EmailConnectionService,
    private cryptoService: EmailCryptoService,
  ) {}

  // ==========================================
  // ENVIAR CORREO (SMTP)
  // ==========================================
  async sendEmail(usuarioId: string, sendDto: SendEmailDto): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId, status: EmailStatus.ACTIVE },
    });

    if (!config) {
      throw new NotFoundException(
        'No hay configuración de correo activa para este usuario',
      );
    }

    const transporter = this.connectionService.createSmtpTransporter({
      email: config.email,
      password: this.cryptoService.decryptPassword(config.passwordEmail),
      imapHost: config.imapHost,
      imapPort: config.imapPort,
      imapSecure: config.imapSecure,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpSecure: config.smtpSecure,
    });

    const mailOptions: any = {
      from: `${config.displayName} <${config.email}>`,
      to: sendDto.to,
      subject: sendDto.subject,
      html: sendDto.html,
      text: sendDto.text,
      cc: sendDto.cc,
      bcc: sendDto.bcc,
    };

    if (sendDto.attachments && sendDto.attachments.length > 0) {
      mailOptions.attachments = sendDto.attachments.map((url: any) => ({
        filename: url.split('/').pop() || 'archivo',
        path: url,
      }));
    }

    try {
      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Correo enviado correctamente',
        data: {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
        },
      };
    } catch (error: any) {
      throw new BadRequestException(`Error al enviar correo: ${error.message}`);
    }
  }

  async sendEmailWithAttachments(
    usuarioId: string,
    sendDto: SendEmailDto & {
      attachmentsData?: Array<{ filename: string; content: Buffer }>;
    },
  ): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId, status: EmailStatus.ACTIVE },
    });

    if (!config) {
      throw new NotFoundException(
        'No hay configuración de correo activa para este usuario',
      );
    }

    const transporter = this.connectionService.createSmtpTransporter({
      email: config.email,
      password: this.cryptoService.decryptPassword(config.passwordEmail),
      imapHost: config.imapHost,
      imapPort: config.imapPort,
      imapSecure: config.imapSecure,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpSecure: config.smtpSecure,
    });

    const mailOptions: any = {
      from: `${config.displayName} <${config.email}>`,
      to: sendDto.to,
      subject: sendDto.subject,
      html: sendDto.html,
      text: sendDto.text,
      cc: sendDto.cc,
      bcc: sendDto.bcc,
    };

    if (sendDto.attachmentsData && sendDto.attachmentsData.length > 0) {
      mailOptions.attachments = sendDto.attachmentsData.map((att: any) => ({
        filename: att.filename,
        content: att.content,
      }));
    }

    try {
      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Correo enviado correctamente con adjuntos',
        data: {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
        },
      };
    } catch (error: any) {
      throw new BadRequestException(`Error al enviar correo: ${error.message}`);
    }
  }

  async forwardEmail(
    usuarioId: string,
    originalEmail: any,
    forwardTo: string,
    comment?: string,
  ): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId, status: EmailStatus.ACTIVE },
    });

    if (!config) {
      throw new NotFoundException(
        'No hay configuración de correo activa para este usuario',
      );
    }

    const transporter = this.connectionService.createSmtpTransporter({
      email: config.email,
      password: this.cryptoService.decryptPassword(config.passwordEmail),
      imapHost: config.imapHost,
      imapPort: config.imapPort,
      imapSecure: config.imapSecure,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpSecure: config.smtpSecure,
    });

    let htmlContent = '';

    if (comment) {
      htmlContent += `<p>${comment}</p><hr>`;
    }

    htmlContent += `
      <div style="border-left: 3px solid #ccc; padding-left: 10px; margin-top: 10px;">
        <p><strong>De:</strong> ${originalEmail.from}</p>
        <p><strong>Fecha:</strong> ${new Date(originalEmail.date).toLocaleString()}</p>
        <p><strong>Asunto:</strong> ${originalEmail.subject}</p>
        <hr>
        ${originalEmail.html || originalEmail.text}
      </div>
    `;

    const mailOptions = {
      from: `${config.displayName} <${config.email}>`,
      to: forwardTo,
      subject: `Fwd: ${originalEmail.subject}`,
      html: htmlContent,
    };

    try {
      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Correo reenviado correctamente',
        data: {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
        },
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Error al reenviar correo: ${error.message}`,
      );
    }
  }

  async replyToEmail(
    usuarioId: string,
    originalEmail: any,
    replyMessage: string,
    isHtml: boolean = true,
  ): Promise<any> {
    const config = await this.emailConfigRepo.findOne({
      where: { usuario_id: usuarioId, status: EmailStatus.ACTIVE },
    });

    if (!config) {
      throw new NotFoundException(
        'No hay configuración de correo activa para este usuario',
      );
    }

    const transporter = this.connectionService.createSmtpTransporter({
      email: config.email,
      password: this.cryptoService.decryptPassword(config.passwordEmail),
      imapHost: config.imapHost,
      imapPort: config.imapPort,
      imapSecure: config.imapSecure,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpSecure: config.smtpSecure,
    });

    let htmlContent = '';

    if (isHtml) {
      htmlContent = `
        <div>${replyMessage}</div>
        <hr style="margin-top: 20px; border: none; border-top: 1px solid #ccc;">
        <div style="color: #666;">
          <p><strong>El ${new Date(originalEmail.date).toLocaleString()}, ${originalEmail.from} escribió:</strong></p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; margin-left: 0;">
            ${originalEmail.html || originalEmail.text}
          </blockquote>
        </div>
      `;
    } else {
      htmlContent = `
        <p>${replyMessage}</p>
        <hr>
        <p><strong>El ${new Date(originalEmail.date).toLocaleString()}, ${originalEmail.from} escribió:</strong></p>
        <blockquote style="border-left: 3px solid #ccc; padding-left: 10px;">
          ${originalEmail.text}
        </blockquote>
      `;
    }

    const mailOptions = {
      from: `${config.displayName} <${config.email}>`,
      to: originalEmail.from,
      subject: `Re: ${originalEmail.subject}`,
      html: htmlContent,
      inReplyTo: originalEmail.messageId,
    };

    try {
      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        message: 'Respuesta enviada correctamente',
        data: {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
        },
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Error al responder correo: ${error.message}`,
      );
    }
  }
}
