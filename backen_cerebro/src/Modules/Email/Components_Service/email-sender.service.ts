import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  EmailConfig,
  EmailConfigDocument,
  EmailStatus,
} from '../../../Models/Usuarios/email-config.schema';
import { SendEmailDto } from '../../../DTOs/email.dto';
import { EmailConnectionService } from './email-connection.service';
import { EmailCryptoService } from './email-crypto.service';

@Injectable()
export class EmailSenderService {
  constructor(
    @InjectModel(EmailConfig.name)
    private emailConfigModel: Model<EmailConfigDocument>,
    private connectionService: EmailConnectionService,
    private cryptoService: EmailCryptoService,
  ) {}

  // ==========================================
  // ENVIAR CORREO (SMTP)
  // ==========================================
  async sendEmail(usuarioId: string, sendDto: SendEmailDto): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({
        usuario: new Types.ObjectId(usuarioId),
        status: EmailStatus.ACTIVE,
      })
      .exec();

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

    // Construir opciones de correo
    const mailOptions: any = {
      from: `${config.displayName} <${config.email}>`,
      to: sendDto.to,
      subject: sendDto.subject,
      html: sendDto.html,
      text: sendDto.text,
      cc: sendDto.cc,
      bcc: sendDto.bcc,
    };

    // Agregar adjuntos si existen
    if (sendDto.attachments && sendDto.attachments.length > 0) {
      mailOptions.attachments = sendDto.attachments.map((url) => ({
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

  // ==========================================
  // ENVIAR CORREO CON ADJUNTOS LOCALES
  // ==========================================
  async sendEmailWithAttachments(
    usuarioId: string,
    sendDto: SendEmailDto & {
      attachmentsData?: Array<{ filename: string; content: Buffer }>;
    },
  ): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({
        usuario: new Types.ObjectId(usuarioId),
        status: EmailStatus.ACTIVE,
      })
      .exec();

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

    // Agregar adjuntos desde datos locales
    if (sendDto.attachmentsData && sendDto.attachmentsData.length > 0) {
      mailOptions.attachments = sendDto.attachmentsData.map((att) => ({
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

  // ==========================================
  // REENVIAR CORREO
  // ==========================================
  async forwardEmail(
    usuarioId: string,
    originalEmail: any,
    forwardTo: string,
    comment?: string,
  ): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({
        usuario: new Types.ObjectId(usuarioId),
        status: EmailStatus.ACTIVE,
      })
      .exec();

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

    // Construir mensaje de reenvío
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

  // ==========================================
  // RESPONDER CORREO
  // ==========================================
  async replyToEmail(
    usuarioId: string,
    originalEmail: any,
    replyMessage: string,
    isHtml: boolean = true,
  ): Promise<any> {
    const config = await this.emailConfigModel
      .findOne({
        usuario: new Types.ObjectId(usuarioId),
        status: EmailStatus.ACTIVE,
      })
      .exec();

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

    // Construir mensaje de respuesta
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
