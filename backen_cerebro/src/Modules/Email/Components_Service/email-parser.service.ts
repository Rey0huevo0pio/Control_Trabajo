import { Injectable } from '@nestjs/common';
import { simpleParser } from 'mailparser';
import {
  EmailAttachment,
  EmailAttachmentService,
} from './email-attachment.service';

export interface ParsedEmail {
  uid: number;
  id: string;
  from: string;
  to: string;
  subject: string;
  date: Date;
  text: string;
  html: string;
  attachments: EmailAttachment[];
  seen: boolean;
  flagged: boolean;
  folder?: string;
}

@Injectable()
export class EmailParserService {
  constructor(private attachmentService: EmailAttachmentService) {}

  // ==========================================
  // PARSEAR EMAIL CON SIMPLEPARSER
  // ==========================================
  async parseEmail(stream: any): Promise<any> {
    try {
      const parsed = await simpleParser(stream);
      return parsed;
    } catch (error) {
      console.error('❌ [EmailParser] Error parsing email:', error);
      throw error;
    }
  }

  // ==========================================
  // EXTRAER HEADERS DE EMAIL
  // ==========================================
  extractHeaders(parsed: any): {
    from: string;
    to: string;
    subject: string;
    date: string;
  } {
    return {
      from: parsed.from?.text || '',
      to: parsed.to?.text || '',
      subject: parsed.subject || '',
      date: parsed.date?.toISOString() || new Date().toISOString(),
    };
  }

  // ==========================================
  // EXTRAER CUERPO DE EMAIL (HTML Y TEXTO)
  // ==========================================
  extractBody(parsed: any): { html: string; text: string } {
    let html = '';
    let text = '';

    if (parsed.html) {
      html =
        typeof parsed.html === 'string' ? parsed.html : parsed.html.toString();
    } else if (parsed.text) {
      text =
        typeof parsed.text === 'string' ? parsed.text : parsed.text.toString();
    }

    return { html, text };
  }

  // ==========================================
  // EXTRAER Y PROCESAR ADJUNTOS
  // ==========================================
  extractAttachments(parsed: any): EmailAttachment[] {
    if (!parsed.attachments || parsed.attachments.length === 0) {
      return [];
    }

    return this.attachmentService.processParsedAttachments(parsed.attachments);
  }

  // ==========================================
  // CONSTRUIR OBJETO DE EMAIL COMPLETO
  // ==========================================
  buildEmailObject(
    parsed: any,
    uid: number,
    folder: string,
    attrs?: any,
  ): ParsedEmail {
    const headers = this.extractHeaders(parsed);
    const body = this.extractBody(parsed);
    const attachments = this.extractAttachments(parsed);

    // Enriquecer adjuntos con información adicional
    const enrichedAttachments = attachments.map((att) =>
      this.attachmentService.enrichAttachment(att, `msg_${uid}`),
    );

    const email: ParsedEmail = {
      uid,
      id: `msg_${uid}`,
      from: headers.from || 'Desconocido',
      to: headers.to || '',
      subject: headers.subject || '',
      date: new Date(headers.date),
      text: body.text,
      html: body.html,
      attachments: enrichedAttachments,
      seen: attrs?.flags?.includes('\\Seen') ?? true,
      flagged: attrs?.flags?.includes('\\Flagged') ?? false,
      folder,
    };

    return email;
  }

  // ==========================================
  // DECODIFICAR QUOTED-PRINTABLE
  // ==========================================
  decodeQuotedPrintable(input: string): string {
    return input
      .replace(/=\r?\n/g, '')
      .replace(/=3D/g, '=')
      .replace(/=0D=0A/g, '\r\n')
      .replace(/=([0-9A-F]{2})/g, (_match: string, hex: string) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
      .replace(/\r?\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // ==========================================
  // PARSEAR EMAIL DESDE STREAM (MÉTODO COMPLETO)
  // ==========================================
  async parseEmailFromStream(
    stream: any,
    uid: number,
    folder: string,
    attrs?: any,
  ): Promise<ParsedEmail> {
    try {
      // Parsear el stream con simpleParser
      const parsed = await this.parseEmail(stream);

      // Construir el objeto de email
      const email = this.buildEmailObject(parsed, uid, folder, attrs);

      console.log(
        `📧 [EmailParser] Email parsed UID:${uid} - html: ${email.html.length > 0}, text: ${email.text.length}, attachments: ${email.attachments.length}`,
      );

      return email;
    } catch (error) {
      console.error('❌ [EmailParser] Error parsing email from stream:', error);

      // Retornar email vacía en caso de error
      return {
        uid,
        id: `msg_${uid}`,
        from: 'Desconocido',
        to: '',
        subject: 'Error al procesar',
        date: new Date(),
        text: 'Error al procesar el correo electrónico',
        html: '',
        attachments: [],
        seen: true,
        flagged: false,
        folder,
      };
    }
  }

  // ==========================================
  // EXTRAER SOLO HEADERS DESDE BUFFER
  // ==========================================
  extractHeadersFromBuffer(buffer: Buffer): {
    from: string;
    to: string;
    subject: string;
    date: string;
  } {
    const headers: any = {};
    const bufferStr = buffer.toString('utf8');

    // Extraer solo las líneas de headers
    const lines = bufferStr.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) continue;

      // Ignorar metadata IMAP
      if (
        trimmed.startsWith('*') ||
        trimmed.startsWith(')') ||
        /^\d+$/.test(trimmed)
      ) {
        continue;
      }

      // Buscar headers específicos
      const fromMatch = trimmed.match(/^From:\s*(.+)$/i);
      const toMatch = trimmed.match(/^To:\s*(.+)$/i);
      const subjectMatch = trimmed.match(/^Subject:\s*(.+)$/i);
      const dateMatch = trimmed.match(/^Date:\s*(.+)$/i);

      if (fromMatch) headers.from = fromMatch[1].trim();
      if (toMatch) headers.to = toMatch[1].trim();
      if (subjectMatch) headers.subject = subjectMatch[1].trim();
      if (dateMatch) headers.date = dateMatch[1].trim();
    }

    return {
      from: headers.from || 'Desconocido',
      to: headers.to || '',
      subject: headers.subject || 'Sin asunto',
      date: headers.date || new Date().toISOString(),
    };
  }

  // ==========================================
  // EXTRAER TEXTO PLANO DESDE BUFFER
  // ==========================================
  extractTextFromBuffer(buffer: Buffer): string {
    if (!buffer || buffer.length === 0) return '';

    const bufferStr = buffer.toString('utf8');

    // Solo procesar si es menor a 50KB
    if (bufferStr.length > 50000) {
      return '';
    }

    // Extraer solo texto plano (antes del primer boundary MIME o HTML)
    const textEnd = bufferStr.indexOf('Content-Type: text/html');
    const mimeBoundary = bufferStr.indexOf('--===============');
    let cutPoint =
      textEnd > 0
        ? textEnd
        : mimeBoundary > 0
          ? mimeBoundary
          : bufferStr.length;

    cutPoint = Math.min(cutPoint, 10000); // Máximo 10KB de texto
    return bufferStr.substring(0, cutPoint).trim();
  }
}
