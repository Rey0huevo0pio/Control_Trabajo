import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
const Imap = require('imap');
import * as nodemailer from 'nodemailer';
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
}

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EmailConfig.name)
    private emailConfigModel: Model<EmailConfigDocument>,
  ) {}

  // ==========================================
  // ENCRIPTAR CONTRASEÑA
  // ==========================================
  private encryptPassword(password: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(
      process.env.EMAIL_ENCRYPTION_KEY || 'default_encryption_key_32',
      'salt',
      32,
    );
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  // ==========================================
  // DESENCRIPTAR CONTRASEÑA
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
      displayName: createDto.displayName || createDto.email.split('@')[0] || 'Usuario',
      passwordEmail: this.encryptPassword(createDto.passwordEmail),
      status: EmailStatus.INACTIVE,
      // Usar valores por defecto si vienen vacíos
      imapHost: createDto.imapHost && createDto.imapHost.trim() ? createDto.imapHost : 'mail.tudominio.com',
      imapPort: createDto.imapPort || 993,
      imapSecure: createDto.imapSecure !== undefined ? createDto.imapSecure : true,
      smtpHost: createDto.smtpHost && createDto.smtpHost.trim() ? createDto.smtpHost : 'mail.tudominio.com',
      smtpPort: createDto.smtpPort || 465,
      smtpSecure: createDto.smtpSecure !== undefined ? createDto.smtpSecure : true,
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
    console.log('\n📧 [EmailService] getAllConfigs');
    const configs = await this.emailConfigModel.find().populate('usuario', 'Control_Usuario nombre apellido').exec();
    
    console.log(`📩 [EmailService] Encontradas ${configs.length} configuraciones`);
    configs.forEach((c: any) => {
      const usuario = c.usuario as any;
      console.log(`  - Usuario: ${usuario?.Control_Usuario || 'N/A'} | Email: ${c.email} | Status: ${c.status}`);
    });
    
    return configs.map(c => this.sanitizeConfig(c));
  }

  // ==========================================
  // OBTENER CONFIGURACIÓN POR USUARIO
  // ==========================================
  async getConfigByUsuario(usuarioId: string): Promise<any> {
    console.log('\n📧 [EmailService] getConfigByUsuario, ID:', usuarioId);
    
    const config = await this.emailConfigModel
      .findOne({ usuario: new Types.ObjectId(usuarioId) })
      .exec();

    console.log('📩 [EmailService] Config encontrada:', config ? '✅ SÍ' : '❌ NO');
    if (config) {
      console.log('📧 [EmailService] Email:', config.email);
      console.log('📧 [EmailService] Status:', config.status);
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
      updateDto.passwordEmail = this.encryptPassword(updateDto.passwordEmail);
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
      await this.testImapConnection(testDto);
      results.imap.success = true;
    } catch (error: any) {
      results.imap.error = error.message;
    }

    // Probar SMTP
    try {
      await this.testSmtpConnection(testDto);
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
  // PROBAR IMAP
  // ==========================================
  private testImapConnection(testDto: TestEmailConnectionDto): Promise<void> {
    return new Promise((resolve, reject) => {
      const imapConnection = new Imap({
        user: testDto.email,
        password: testDto.passwordEmail,
        host: testDto.imapHost,
        port: testDto.imapPort,
        tls: testDto.imapSecure,
        connTimeout: 10000,
      });

      imapConnection.once('error', (err: any) => {
        reject(new Error(`IMAP Error: ${err.message}`));
      });

      imapConnection.once('ready', () => {
        imapConnection.end();
        resolve();
      });

      imapConnection.connect();
    });
  }

  // ==========================================
  // PROBAR SMTP
  // ==========================================
  private async testSmtpConnection(testDto: TestEmailConnectionDto): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: testDto.smtpHost,
      port: testDto.smtpPort,
      secure: testDto.smtpSecure,
      auth: {
        user: testDto.email,
        pass: testDto.passwordEmail,
      },
      connectionTimeout: 10000,
    });

    try {
      await transporter.verify();
    } catch (error: any) {
      throw new Error(`SMTP Error: ${error.message}`);
    }
  }

  // ==========================================
  // ACTIVAR CONFIGURACIÓN SIN PROBAR (Manual)
  // ==========================================
  async activateConfigForce(usuarioId: string): Promise<any> {
    console.log('\n📧 [EmailService] activateConfigForce, ID:', usuarioId);
    
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

    console.log('✅ [EmailService] Configuración activada manualmente');

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
      await this.testImapConnection({
        email: config.email,
        passwordEmail: this.decryptPassword(config.passwordEmail),
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
  // OBTENER CORREOS (IMAP)
  // ==========================================
  async getEmails(
    usuarioId: string,
    getEmailsDto: GetEmailsDto,
  ): Promise<any> {
    console.log('\n📧 [EmailService] getEmails - userId:', usuarioId);
    console.log('📧 [EmailService] getEmails - params:', getEmailsDto);
    
    const config = await this.emailConfigModel
      .findOne({
        usuario: new Types.ObjectId(usuarioId),
      })
      .exec();

    console.log('📩 [EmailService] Config encontrada:', config ? '✅ SÍ' : '❌ NO');
    if (config) {
      console.log('📧 [EmailService] Email:', config.email);
      console.log('📧 [EmailService] Status:', config.status);
      console.log('📧 [EmailService] IMAP Host:', config.imapHost);
    }

    if (!config) {
      console.log('❌ [EmailService] No hay configuración de correo para este usuario');
      return {
        success: false,
        message: 'No hay configuración de correo para este usuario',
        data: { emails: [], total: 0 },
      };
    }

    if (config.status !== EmailStatus.ACTIVE) {
      console.log('⚠️ [EmailService] La configuración no está activa. Status:', config.status);
      return {
        success: false,
        message: `La configuración de correo no está activa. Status: ${config.status}. Actívala primero.`,
        data: { emails: [], total: 0 },
      };
    }

    return new Promise((resolve) => {
      console.log('📧 [EmailService] Intentando conectar a IMAP:', config.imapHost, ':', config.imapPort);
      
      const imapConnection = new Imap({
        user: config.email,
        password: this.decryptPassword(config.passwordEmail),
        host: config.imapHost,
        port: config.imapPort,
        tls: config.imapSecure,
        connTimeout: 5000, // 5 segundos de timeout
      });

      const emails: EmailMessage[] = [];

      // Si hay timeout o error de conexión, devolver respuesta graceful
      imapConnection.once('error', (err: any) => {
        console.log('⚠️ [EmailService] IMAP error:', err.message || err);
        
        // Siempre devolver respuesta graceful en lugar de error
        resolve({
          success: true,
          message: `No se pudo conectar al servidor IMAP (${config.imapHost}:${config.imapPort}). ${err.message || 'Error de conexión'}`,
          data: { 
            emails: [], 
            total: 0,
            configStatus: config.status,
            imapHost: config.imapHost,
            imapPort: config.imapPort,
            imapError: err.message || 'Unknown error',
          },
        });
      });

      imapConnection.once('ready', () => {
        console.log('✅ [EmailService] Conectado a IMAP exitosamente');
        
        imapConnection.openBox(getEmailsDto.folder || 'INBOX', true, (err: any, box: any) => {
          if (err) {
            console.log('❌ [EmailService] Error abriendo carpeta:', err.message);
            resolve({
              success: true,
              message: `Error abriendo carpeta: ${err.message}`,
              data: { emails: [], total: 0 },
            });
            return;
          }

          console.log('📬 [EmailService] Carpeta abierta. Mensajes totales:', box.messages.total);

          const searchCriteria = getEmailsDto.unreadOnly ? ['UNSEEN'] : ['ALL'];

          imapConnection.search(searchCriteria, (err: any, results: number[]) => {
            if (err) {
              console.log('❌ [EmailService] Error en búsqueda:', err.message);
              imapConnection.end();
              resolve({
                success: true,
                message: `Error en búsqueda: ${err.message}`,
                data: { emails: [], total: 0 },
              });
              return;
            }

            console.log('📩 [EmailService] Mensajes encontrados:', results.length);

            if (results.length === 0) {
              imapConnection.end();
              resolve({
                success: true,
                message: 'No hay correos en esta carpeta',
                data: { emails: [], total: 0 },
              });
              return;
            }

            const fetch = imapConnection.fetch(results, {
              bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
              struct: true,
            });

            fetch.on('message', (msg: any) => {
              console.log('\n📨 [EmailService] === PROCESANDO MENSAJE ===');
              const headers: any = {};
              let textBuffer = '';

              msg.on('body', (stream: any, info: any) => {
                console.log('📨 [EmailService] Body part info.which:', info.which);
                let buffer = '';
                stream.on('data', (chunk: Buffer) => {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  console.log('📨 [EmailService] Buffer size:', buffer.length);
                  console.log('📨 [EmailService] Buffer RAW (primeros 500 chars):');
                  console.log('=== INICIO BUFFER ===');
                  console.log(buffer.substring(0, 500));
                  console.log('=== FIN BUFFER ===');
                  
                  // IMAP devuelve headers en formato:
                  // From: Nombre <correo@dominio.com>
                  // Subject: Asunto del correo
                  // Date: Mon, 5 Apr 2026 10:00:00 -0600
                  
                  const lines = buffer.split(/\r?\n/);
                  console.log('📨 [EmailService] Líneas encontradas:', lines.length);
                  
                  lines.forEach((line: string, idx: number) => {
                    const trimmed = line.trim();
                    // Ignorar metadata IMAP
                    if (trimmed.startsWith('*') || trimmed.startsWith(')') || /^\d+$/.test(trimmed) || trimmed.includes('FETCH')) {
                      return;
                    }
                    
                    console.log(`📨 [EmailService] Línea ${idx}: "${trimmed.substring(0, 120)}"`);
                    
                    // Buscar cada header individualmente
                    const fromMatch = trimmed.match(/^From:\s*(.+)$/i);
                    const toMatch = trimmed.match(/^To:\s*(.+)$/i);
                    const subjectMatch = trimmed.match(/^Subject:\s*(.+)$/i);
                    const dateMatch = trimmed.match(/^Date:\s*(.+)$/i);
                    
                    if (fromMatch) {
                      headers.from = fromMatch[1].trim();
                      console.log(`✅ FROM ENCONTRADO: "${headers.from}"`);
                    }
                    if (toMatch) {
                      headers.to = toMatch[1].trim();
                      console.log(`✅ TO ENCONTRADO: "${headers.to}"`);
                    }
                    if (subjectMatch) {
                      headers.subject = subjectMatch[1].trim();
                      console.log(`✅ SUBJECT ENCONTRADO: "${headers.subject}"`);
                    }
                    if (dateMatch) {
                      headers.date = dateMatch[1].trim();
                      console.log(`✅ DATE ENCONTRADO: "${headers.date}"`);
                    }
                  });
                  
                  // Si no encontramos headers, es texto
                  if (Object.keys(headers).length === 0 && buffer.length > 10) {
                    console.log('📨 [EmailService] Esto es TEXTO, no headers');
                    textBuffer = buffer;
                  }
                });
              });

              msg.once('end', () => {
                console.log('\n📨 [EmailService] === FIN MENSAJE ===');
                console.log('📨 [EmailService] Headers finales:', JSON.stringify(headers, null, 2));
                console.log('📨 [EmailService] from:', headers.from);
                console.log('📨 [EmailService] subject:', headers.subject);
                
                emails.push({
                  id: `email_${Date.now()}_${emails.length}`,
                  uid: 0,
                  from: headers.from || 'Desconocido',
                  to: headers.to || '',
                  subject: headers.subject || 'Sin asunto',
                  date: headers.date ? new Date(headers.date) : new Date(),
                  text: textBuffer || '',
                  html: '',
                  attachments: [],
                  seen: true,
                  flagged: false,
                });
                console.log('📨 [EmailService] Email agregado:', emails[emails.length-1].from, '/', emails[emails.length-1].subject);
              });
            });

            fetch.once('error', (err: any) => {
              console.log('❌ [EmailService] Fetch error:', err.message);
              imapConnection.end();
              resolve({
                success: true,
                message: `Error obteniendo mensajes: ${err.message}`,
                data: { emails: [], total: 0 },
              });
            });

            fetch.once('end', () => {
              imapConnection.end();

              const page = getEmailsDto.page || 1;
              const limit = getEmailsDto.limit || 50;
              const start = (page - 1) * limit;
              const end = start + limit;

              resolve({
                success: true,
                data: {
                  emails: emails.slice(start, end),
                  total: emails.length,
                  page,
                  limit,
                },
              });
            });
          });
        });
      });

      imapConnection.connect();

      // Actualizar última sincronización
      this.emailConfigModel
        .findOneAndUpdate(
          { usuario: new Types.ObjectId(usuarioId) },
          { lastSync: new Date() },
        )
        .exec();
    });
  }

  // ==========================================
  // ENVIAR CORREO (SMTP)
  // ==========================================
  async sendEmail(
    usuarioId: string,
    sendDto: SendEmailDto,
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

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.email,
        pass: this.decryptPassword(config.passwordEmail),
      },
    });

    const mailOptions = {
      from: `${config.displayName} <${config.email}>`,
      to: sendDto.to,
      subject: sendDto.subject,
      html: sendDto.html,
      text: sendDto.text,
      cc: sendDto.cc,
      bcc: sendDto.bcc,
      attachments: sendDto.attachments?.map((url) => ({
        filename: url.split('/').pop() || 'archivo',
        path: url,
      })),
    };

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
