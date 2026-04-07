import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Imap = require('imap').default || require('imap');
import * as nodemailer from 'nodemailer';

export interface EmailConnectionConfig {
  email: string;
  password: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
}

@Injectable()
export class EmailConnectionService {
  // ==========================================
  // PROBAR CONEXIÓN IMAP
  // ==========================================
  testImapConnection(config: EmailConnectionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const imapConnection = new Imap({
        user: config.email,
        password: config.password,
        host: config.imapHost,
        port: config.imapPort,
        tls: config.imapSecure,
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
  // PROBAR CONEXIÓN SMTP
  // ==========================================
  async testSmtpConnection(config: EmailConnectionConfig): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.email,
        pass: config.password,
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
  // CREAR CONEXIÓN IMAP
  // ==========================================
  createImapConnection(config: EmailConnectionConfig): any {
    return new Imap({
      user: config.email,
      password: config.password,
      host: config.imapHost,
      port: config.imapPort,
      tls: config.imapSecure,
      connTimeout: config.imapSecure ? 30000 : 5000,
    });
  }

  // ==========================================
  // CREAR TRANSPORTER SMTP
  // ==========================================
  createSmtpTransporter(config: EmailConnectionConfig): any {
    return nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
  }
}
