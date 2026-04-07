import { Injectable } from '@nestjs/common';
import {
  EmailConnectionService,
  EmailConnectionConfig,
} from './email-connection.service';
import { EmailParserService, ParsedEmail } from './email-parser.service';
import { EmailCacheService } from './email-cache.service';
import { EmailAttachmentService } from './email-attachment.service';

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
export class EmailFetcherService {
  constructor(
    private connectionService: EmailConnectionService,
    private parserService: EmailParserService,
    private cacheService: EmailCacheService,
    private attachmentService: EmailAttachmentService,
  ) {}

  // ==========================================
  // OBTENER UIDs DE UNA CARPETA
  // ==========================================
  async getMessageUIDs(
    config: EmailConnectionConfig,
    folder: string,
    usuarioId: string,
  ): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const imapConnection =
        this.connectionService.createImapConnection(config);

      imapConnection.once('error', (err: any) => {
        console.log('❌ [EmailFetcher] IMAP error:', err.message);
        resolve([]);
      });

      imapConnection.once('ready', () => {
        imapConnection.openBox(folder, true, (err: any) => {
          if (err) {
            console.log('❌ [EmailFetcher] Error opening box:', err.message);
            imapConnection.end();
            resolve([]);
            return;
          }

          imapConnection.search(['ALL'], (err: any, results: number[]) => {
            imapConnection.end();

            if (err) {
              console.log('❌ [EmailFetcher] Error searching:', err.message);
              resolve([]);
              return;
            }

            // Guardar en caché
            this.cacheService.cacheUIDs(usuarioId, folder, results);

            console.log(
              `📧 [EmailFetcher] getMessageUIDs: ${results.length} UIDs en ${folder}`,
            );
            resolve(results);
          });
        });
      });

      imapConnection.connect();
    });
  }

  // ==========================================
  // OBTENER SOLO UIDs NUEVOS (USANDO CACHÉ)
  // ==========================================
  async getNewMessageUIDs(
    config: EmailConnectionConfig,
    folder: string,
    usuarioId: string,
  ): Promise<number[]> {
    // Obtener todos los UIDs del servidor
    const allUIDs = await this.getMessageUIDs(config, folder, usuarioId);

    // Filtrar solo los nuevos (no en caché)
    const newUIDs = this.cacheService.getNewUIDs(usuarioId, folder, allUIDs);

    return newUIDs;
  }

  // ==========================================
  // OBTENER MENSAJES POR UIDs (CON CACHÉ)
  // ==========================================
  async getMessagesByUIDs(
    config: EmailConnectionConfig,
    folder: string,
    uids: number[],
    usuarioId: string,
  ): Promise<EmailMessage[]> {
    if (uids.length === 0) {
      return [];
    }

    return new Promise((resolve) => {
      const imapConnection =
        this.connectionService.createImapConnection(config);
      const emails: EmailMessage[] = [];
      let processedCount = 0;

      imapConnection.once('error', (err: any) => {
        console.log('❌ [EmailFetcher] IMAP error:', err.message);
        resolve([]);
      });

      imapConnection.once('ready', () => {
        imapConnection.openBox(folder, true, async (err: any) => {
          if (err) {
            console.log('❌ [EmailFetcher] Error opening box:', err.message);
            imapConnection.end();
            resolve([]);
            return;
          }

          console.log(
            `📧 [EmailFetcher] Fetching ${uids.length} messages with mailparser...`,
          );

          const fetch = imapConnection.fetch(uids, {
            bodies: '',
            struct: true,
            envelope: true,
          });

          fetch.on('message', async (msg: any) => {
            let parsedEmail: ParsedEmail | null = null;

            msg.on('body', async (stream: any) => {
              try {
                // Parsear email con mailparser
                parsedEmail = await this.parserService.parseEmailFromStream(
                  stream,
                  0, // UID se obtiene de attributes
                  folder,
                );
              } catch (parseErr) {
                console.log('❌ [EmailFetcher] Parse error:', parseErr);
              }
            });

            msg.on('attributes', (attrs: any) => {
              if (parsedEmail) {
                // Actualizar UID correcto
                parsedEmail.uid = attrs.uid;
                parsedEmail.id = `msg_${attrs.uid}`;
                parsedEmail.seen = attrs.flags.includes('\\Seen');
                parsedEmail.flagged = attrs.flags.includes('\\Flagged');
                parsedEmail.folder = folder;

                emails.push(parsedEmail as EmailMessage);
              }

              processedCount++;
            });
          });

          fetch.once('error', (err: any) => {
            console.log('❌ [EmailFetcher] Fetch error:', err.message);
            imapConnection.end();
            resolve([]);
          });

          fetch.once('end', () => {
            console.log(
              `📧 [EmailFetcher] Completed. ${emails.length} emails parsed`,
            );
            imapConnection.end();

            // Guardar en caché
            this.cacheService.cacheMessages(usuarioId, folder, emails);

            resolve(emails);
          });
        });
      });

      imapConnection.connect();
    });
  }

  // ==========================================
  // OBTENER EMAILS CON PAGINACIÓN (MÉTODO ANTIGUO COMPATIBLE)
  // ==========================================
  async getEmailsLegacy(
    config: EmailConnectionConfig,
    folder: string,
    usuarioId: string,
    options: {
      unreadOnly?: boolean;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{ emails: EmailMessage[]; total: number }> {
    const { unreadOnly = false, page = 1, limit = 50 } = options;

    return new Promise((resolve) => {
      const imapConnection =
        this.connectionService.createImapConnection(config);
      const emails: EmailMessage[] = [];

      imapConnection.once('error', (err: any) => {
        console.log('⚠️ [EmailFetcher] IMAP error:', err.message || err);
        resolve({ emails: [], total: 0 });
      });

      imapConnection.once('ready', () => {
        imapConnection.openBox(folder, true, (err: any, box: any) => {
          if (err) {
            console.log('❌ [EmailFetcher] Error opening box:', err.message);
            resolve({ emails: [], total: 0 });
            return;
          }

          console.log(
            '📬 [EmailFetcher] Carpeta abierta. Mensajes totales:',
            box.messages.total,
          );

          const searchCriteria = unreadOnly ? ['UNSEEN'] : ['ALL'];

          imapConnection.search(
            searchCriteria,
            (err: any, results: number[]) => {
              if (err) {
                console.log(
                  '❌ [EmailFetcher] Error en búsqueda:',
                  err.message,
                );
                imapConnection.end();
                resolve({ emails: [], total: 0 });
                return;
              }

              console.log(
                '📩 [EmailFetcher] Mensajes encontrados:',
                results.length,
              );

              if (results.length === 0) {
                imapConnection.end();
                resolve({ emails: [], total: 0 });
                return;
              }

              const fetch = imapConnection.fetch(results, {
                bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT', '1'],
                struct: true,
                envelope: true,
              });

              fetch.on('message', (msg: any) => {
                const headers: any = {};
                let textBuffer = '';

                msg.on('body', (stream: any, info: any) => {
                  let buffer = '';
                  stream.on('data', (chunk: Buffer) => {
                    buffer += chunk.toString('utf8');
                  });
                  stream.once('end', () => {
                    const which = (info.which || '').toUpperCase();

                    if (which.includes('HEADER')) {
                      const lines = buffer.split(/\r?\n/);
                      for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed.length === 0) continue;
                        if (
                          trimmed.startsWith('*') ||
                          trimmed.startsWith(')') ||
                          /^\d+$/.test(trimmed)
                        ) {
                          continue;
                        }

                        const fromMatch = trimmed.match(/^From:\s*(.+)$/i);
                        const toMatch = trimmed.match(/^To:\s*(.+)$/i);
                        const subjectMatch =
                          trimmed.match(/^Subject:\s*(.+)$/i);
                        const dateMatch = trimmed.match(/^Date:\s*(.+)$/i);

                        if (fromMatch) headers.from = fromMatch[1].trim();
                        if (toMatch) headers.to = toMatch[1].trim();
                        if (subjectMatch)
                          headers.subject = subjectMatch[1].trim();
                        if (dateMatch) headers.date = dateMatch[1].trim();
                      }
                    } else if (which === 'TEXT' && buffer.length < 50000) {
                      textBuffer = this.parserService.extractTextFromBuffer(
                        Buffer.from(buffer),
                      );
                    }
                  });
                });

                msg.once('end', () => {
                  emails.push({
                    id: `email_${Date.now()}_${emails.length}`,
                    uid: 0,
                    from: headers.from || 'Desconocido',
                    to: headers.to || '',
                    subject: headers.subject || 'Sin asunto',
                    date: headers.date ? new Date(headers.date) : new Date(),
                    text: textBuffer || 'Sin contenido',
                    html: '',
                    attachments: [],
                    seen: true,
                    flagged: false,
                  });
                });
              });

              fetch.once('error', (err: any) => {
                console.log('❌ [EmailFetcher] Fetch error:', err.message);
                imapConnection.end();
                resolve({ emails: [], total: 0 });
              });

              fetch.once('end', () => {
                imapConnection.end();

                const start = (page - 1) * limit;
                const end = start + limit;

                resolve({
                  emails: emails.slice(start, end),
                  total: emails.length,
                });
              });
            },
          );
        });
      });

      imapConnection.connect();
    });
  }

  // ==========================================
  // OBTENER MENSAJES COMPLETOS (CACHÉ + NUEVOS)
  // ==========================================
  async getCompleteMessages(
    config: EmailConnectionConfig,
    folder: string,
    usuarioId: string,
  ): Promise<EmailMessage[]> {
    // Obtener UIDs nuevos
    const newUIDs = await this.getNewMessageUIDs(config, folder, usuarioId);

    // Obtener mensajes nuevos
    const newMessages = await this.getMessagesByUIDs(
      config,
      folder,
      newUIDs,
      usuarioId,
    );

    // Combinar con caché
    const allMessages = this.cacheService.getCompleteMessages(
      usuarioId,
      folder,
      newMessages,
    );

    return allMessages as EmailMessage[];
  }
}
