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
  // Thread/Conversation fields
  threadId?: string;
  inReplyTo?: string;
  references?: string;
  isReply?: boolean;
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
    truncateAttachments = true, // NUEVO: false para vista completa de email
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

          // Procesar cada mensaje con async/await
          const messagePromises: Promise<EmailMessage | null>[] = [];

          fetch.on('message', (msg: any) => {
            messagePromises.push(
              new Promise((resolveMsg) => {
                let uid = 0;
                let attrs: any = null;
                const chunks: Buffer[] = [];
                let attrsReceived = false;
                let bodyReceived = false;

                // Obtener atributos
                msg.once('attributes', (msgAttrs: any) => {
                  uid = msgAttrs.uid;
                  attrs = msgAttrs;
                  attrsReceived = true;
                  
                  // Si ya tenemos body, procesar
                  if (bodyReceived && chunks.length > 0) {
                    processEmail();
                  }
                });

                // Recolectar body
                msg.on('body', (stream: any) => {
                  stream.on('data', (chunk: Buffer) => {
                    chunks.push(chunk);
                  });
                  
                  stream.once('end', () => {
                    bodyReceived = true;
                    
                    // Si ya tenemos attributes, procesar
                    if (attrsReceived && chunks.length > 0) {
                      processEmail();
                    }
                  });
                });

                // Función para procesar el email
                const processEmail = async () => {
                  try {
                    const fullBuffer = Buffer.concat(chunks);
                    const parsedEmail = await this.parserService.parseEmailFromBuffer(
                      fullBuffer,
                      uid,
                      folder,
                      attrs,
                    );
                    resolveMsg(parsedEmail);
                  } catch (err) {
                    console.log('❌ [EmailFetcher] Process error:', err);
                    resolveMsg(null);
                  }
                };

                // Timeout de seguridad (5 segundos)
                setTimeout(() => {
                  if (chunks.length > 0 && !attrsReceived) {
                    // Si tenemos chunks pero no attributes, intentar parsear sin UID
                    console.log(`⚠️ [EmailFetcher] Timeout for message, parsing without UID`);
                    bodyReceived = true;
                    if (chunks.length > 0) {
                      processEmail();
                    } else {
                      resolveMsg(null);
                    }
                  } else if (!bodyReceived && !attrsReceived) {
                    resolveMsg(null);
                  }
                }, 5000);
              })
            );
          });

          fetch.once('error', (err: any) => {
            console.log('❌ [EmailFetcher] Fetch error:', err.message);
            imapConnection.end();
            resolve([]);
          });

          fetch.once('end', async () => {
            console.log(
              `📧 [EmailFetcher] Waiting for ${messagePromises.length} messages to be processed...`,
            );
            
            // Esperar a que todos los mensajes se procesen
            const results = await Promise.all(messagePromises);
            
            // Filtrar resultados válidos y LIMITAR tamaño de HTML
            const validEmails = results
              .filter((email): email is EmailMessage => email !== null)
              .map((email) => {
            // DEBUG: Log detallado del contenido
            console.log(`📧 [EmailFetcher] 🔍 UID:${email.uid} - html: ${email.html?.length || 0} chars, text: ${email.text?.length || 0} chars`);
            console.log(`   📧 HTML preview: ${email.html?.substring(0, 200) || 'VACÍO'}`);
            
            // Enviar HTML completo (hasta 2MB) - el frontend decide qué mostrar
            const MAX_HTML_LENGTH = 2000000; // 2MB - permitir correos muy largos
            if (email.html && email.html.length > MAX_HTML_LENGTH) {
              console.log(
                `⚠️ [EmailFetcher] HTML muy grande para UID:${email.uid} (${email.html.length} chars), truncando a ${MAX_HTML_LENGTH}`,
              );
              email.html = email.html.substring(0, MAX_HTML_LENGTH);
            }
            
            // Limitar text a 50000 caracteres para previews
            const MAX_TEXT_LENGTH = 50000;
            if (email.text && email.text.length > MAX_TEXT_LENGTH) {
              email.text = email.text.substring(0, MAX_TEXT_LENGTH) + '...';
            }
            
            // Agregar información de threading (para conversaciones)
            // Usar el Message-ID como thread ID base
            const threadInfo = this.extractThreadInfo(email);
            email.threadId = threadInfo.threadId;
            email.inReplyTo = threadInfo.inReplyTo;
            email.references = threadInfo.references;
            email.isReply = !!threadInfo.inReplyTo;
                
                // NO enviar contenido de adjuntos en la lista (solo metadata)
                // Pero SÍ enviar thumbnails completos para vista individual (truncateAttachments=false)
                if (email.attachments && email.attachments.length > 0) {
                  email.attachments = email.attachments.map((att: any) => ({
                    fileName: att.fileName || att.filename || 'archivo',
                    contentType: att.contentType || 'application/octet-stream',
                    size: att.size || 0,
                    isImage: att.isImage || false,
                    isPDF: att.isPDF || false,
                    thumbnail: truncateAttachments
                      ? (att.thumbnail ? att.thumbnail.substring(0, 200) : undefined)  // Truncar para lista
                      : (att.thumbnail || undefined),  // Completo para vista individual
                    content: truncateAttachments ? undefined : (att.content || undefined),  // Solo en vista individual
                  }));
                }
                
                return email;
              });
            
            // ✅ ORDENAR POR FECHA DESCENDENTE (más reciente primero)
            validEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            console.log(
              `📧 [EmailFetcher] Completed. ${validEmails.length} emails parsed out of ${messagePromises.length}`,
            );
            imapConnection.end();

            // Guardar en caché
            this.cacheService.cacheMessages(usuarioId, folder, validEmails);

            resolve(validEmails);
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
                bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],  // Incluir TEXT para preview
                struct: false,
                envelope: true,
              });

              fetch.on('message', (msg: any) => {
                const headers: any = {};
                let textBuffer = '';
                let uid = 0;
                let bodyReceived = false;

                // Obtener UID y otros atributos del mensaje
                msg.on('attributes', (attrs: any) => {
                  uid = attrs.uid || 0;
                });

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
                    } else if (which === 'TEXT' && !bodyReceived) {
                      bodyReceived = true;
                      // Extraer solo preview de texto (primeros 200 chars)
                      const textEnd = buffer.indexOf('Content-Type: text/html');
                      const cutPoint = textEnd > 0 ? textEnd : buffer.length;
                      const previewLength = Math.min(cutPoint, 300);  // Limitar a 300 chars
                      textBuffer = buffer.substring(0, previewLength).trim();
                      // Eliminar caracteres de control
                      textBuffer = textBuffer.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
                    }
                  });
                });

                msg.once('end', () => {
                  emails.push({
                    id: `email_${uid}_${Date.now()}`,
                    uid: uid,  // ✅ UID CORRECTO del servidor IMAP
                    from: headers.from || 'Desconocido',
                    to: headers.to || '',
                    subject: headers.subject || 'Sin asunto',
                    date: headers.date ? new Date(headers.date) : new Date(),
                    text: textBuffer || '',  // Preview del texto (vacío si no hay)
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

                // ✅ ORDENAR POR FECHA DESCENDENTE (más reciente primero)
                emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                console.log(
                  `📧 [EmailFetcher] Legacy completed. ${emails.length} emails parsed, sorted by date (newest first)`,
                );

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

  // ==========================================
  // EXTRAER INFO DE THREADING (Conversaciones)
  // ==========================================
  private extractThreadInfo(parsedEmail: any): { threadId: string; inReplyTo: string; references: string } {
    const messageId = parsedEmail.messageId || '';
    const inReplyTo = parsedEmail.inReplyTo || '';
    const references = parsedEmail.references || '';
    
    // El threadId se forma del Message-ID original o del In-Reply-To
    let threadId = messageId;
    if (inReplyTo) {
      // Si es una respuesta, usar el ID del correo al que responde
      threadId = inReplyTo;
    } else if (references) {
      // Usar el primer reference como thread ID
      const refList = references.match(/<[^>]+>/g);
      if (refList && refList.length > 0) {
        threadId = refList[0].replace(/<|>/g, '');
      }
    }
    
    // Limpiar el threadId
    threadId = threadId.replace(/<|>/g, '');
    
    return {
      threadId,
      inReplyTo: inReplyTo.replace(/<|>/g, ''),
      references: references.replace(/<|>/g, ','),
    };
  }
}
