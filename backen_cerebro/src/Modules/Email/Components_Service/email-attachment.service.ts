import { Injectable } from '@nestjs/common';

export interface EmailAttachment {
  fileName: string;
  contentType: string;
  size: number;
  content?: Buffer;
  encoding?: string;
  partId?: number;
  // Campos adicionales para multimedia
  isImage?: boolean;
  isPDF?: boolean;
  thumbnail?: string;
  url?: string;
}

export interface MultimediaInfo {
  type: 'image' | 'pdf' | 'video' | 'audio' | 'document' | 'other';
  mimeType: string;
  extension: string;
  isSupported: boolean;
}

@Injectable()
export class EmailAttachmentService {
  // Mapeo de tipos MIME a categorías
  private readonly MIME_TYPES: Record<string, MultimediaInfo> = {
    // Imágenes
    'image/png': {
      type: 'image',
      mimeType: 'image/png',
      extension: '.png',
      isSupported: true,
    },
    'image/jpeg': {
      type: 'image',
      mimeType: 'image/jpeg',
      extension: '.jpg',
      isSupported: true,
    },
    'image/jpg': {
      type: 'image',
      mimeType: 'image/jpeg',
      extension: '.jpg',
      isSupported: true,
    },
    'image/gif': {
      type: 'image',
      mimeType: 'image/gif',
      extension: '.gif',
      isSupported: true,
    },
    'image/webp': {
      type: 'image',
      mimeType: 'image/webp',
      extension: '.webp',
      isSupported: true,
    },
    'image/svg+xml': {
      type: 'image',
      mimeType: 'image/svg+xml',
      extension: '.svg',
      isSupported: true,
    },
    'image/bmp': {
      type: 'image',
      mimeType: 'image/bmp',
      extension: '.bmp',
      isSupported: true,
    },
    'image/tiff': {
      type: 'image',
      mimeType: 'image/tiff',
      extension: '.tiff',
      isSupported: true,
    },

    // PDF
    'application/pdf': {
      type: 'pdf',
      mimeType: 'application/pdf',
      extension: '.pdf',
      isSupported: true,
    },

    // Videos
    'video/mp4': {
      type: 'video',
      mimeType: 'video/mp4',
      extension: '.mp4',
      isSupported: true,
    },
    'video/webm': {
      type: 'video',
      mimeType: 'video/webm',
      extension: '.webm',
      isSupported: true,
    },
    'video/quicktime': {
      type: 'video',
      mimeType: 'video/quicktime',
      extension: '.mov',
      isSupported: true,
    },
    'video/x-msvideo': {
      type: 'video',
      mimeType: 'video/x-msvideo',
      extension: '.avi',
      isSupported: true,
    },

    // Audio
    'audio/mpeg': {
      type: 'audio',
      mimeType: 'audio/mpeg',
      extension: '.mp3',
      isSupported: true,
    },
    'audio/wav': {
      type: 'audio',
      mimeType: 'audio/wav',
      extension: '.wav',
      isSupported: true,
    },
    'audio/ogg': {
      type: 'audio',
      mimeType: 'audio/ogg',
      extension: '.ogg',
      isSupported: true,
    },
    'audio/mp4': {
      type: 'audio',
      mimeType: 'audio/mp4',
      extension: '.m4a',
      isSupported: true,
    },

    // Documentos
    'application/msword': {
      type: 'document',
      mimeType: 'application/msword',
      extension: '.doc',
      isSupported: true,
    },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      type: 'document',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      extension: '.docx',
      isSupported: true,
    },
    'application/vnd.ms-excel': {
      type: 'document',
      mimeType: 'application/vnd.ms-excel',
      extension: '.xls',
      isSupported: true,
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      type: 'document',
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: '.xlsx',
      isSupported: true,
    },
    'application/vnd.ms-powerpoint': {
      type: 'document',
      mimeType: 'application/vnd.ms-powerpoint',
      extension: '.ppt',
      isSupported: true,
    },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      {
        type: 'document',
        mimeType:
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        extension: '.pptx',
        isSupported: true,
      },
    'text/plain': {
      type: 'document',
      mimeType: 'text/plain',
      extension: '.txt',
      isSupported: true,
    },
    'text/csv': {
      type: 'document',
      mimeType: 'text/csv',
      extension: '.csv',
      isSupported: true,
    },
    'application/zip': {
      type: 'document',
      mimeType: 'application/zip',
      extension: '.zip',
      isSupported: true,
    },
    'application/x-zip-compressed': {
      type: 'document',
      mimeType: 'application/x-zip-compressed',
      extension: '.zip',
      isSupported: true,
    },
    'application/x-rar-compressed': {
      type: 'document',
      mimeType: 'application/x-rar-compressed',
      extension: '.rar',
      isSupported: true,
    },
  };

  // ==========================================
  // CLASIFICAR ADJUNTO POR TIPO
  // ==========================================
  classifyAttachment(attachment: EmailAttachment): MultimediaInfo {
    const contentType = attachment.contentType?.toLowerCase() || '';

    // Buscar en el mapa de tipos MIME
    const mimeInfo = this.MIME_TYPES[contentType];
    if (mimeInfo) {
      return mimeInfo;
    }

    // Intentar deducir por la extensión del archivo
    const fileName = attachment.fileName?.toLowerCase() || '';
    const extension = fileName.substring(fileName.lastIndexOf('.'));

    // Buscar por extensión
    for (const [mime, info] of Object.entries(this.MIME_TYPES)) {
      if (info.extension === extension) {
        return info;
      }
    }

    // Tipo desconocido
    return {
      type: 'other',
      mimeType: contentType || 'application/octet-stream',
      extension: extension || '',
      isSupported: false,
    };
  }

  // ==========================================
  // VERIFICAR SI ES IMAGEN
  // ==========================================
  isImage(attachment: EmailAttachment): boolean {
    return this.classifyAttachment(attachment).type === 'image';
  }

  // ==========================================
  // VERIFICAR SI ES PDF
  // ==========================================
  isPDF(attachment: EmailAttachment): boolean {
    return this.classifyAttachment(attachment).type === 'pdf';
  }

  // ==========================================
  // VERIFICAR SI ES MULTIMEDIA
  // ==========================================
  isMultimedia(attachment: EmailAttachment): boolean {
    const info = this.classifyAttachment(attachment);
    return ['image', 'video', 'audio'].includes(info.type);
  }

  // ==========================================
  // FORMATEAR TAMAÑO DE ARCHIVO
  // ==========================================
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // ==========================================
  // EXTRAER ADJUNTOS DE LA ESTRUCTURA MIME
  // ==========================================
  extractAttachments(parts: any[], attachments: EmailAttachment[]): void {
    for (const part of parts) {
      if (part.disposition && part.disposition.toLowerCase() === 'attachment') {
        const attachment: EmailAttachment = {
          fileName: part.params?.name || `attachment_${attachments.length}`,
          contentType: part.type || 'application/octet-stream',
          size: part.size || 0,
          encoding: part.encoding || '',
          partId: part.partID || part.partId || attachments.length,
        };

        // Agregar información de tipo multimedia
        const multimediaInfo = this.classifyAttachment(attachment);
        attachment.isImage = multimediaInfo.type === 'image';
        attachment.isPDF = multimediaInfo.type === 'pdf';

        attachments.push(attachment);
      }

      // Procesar partes anidados recursivamente
      if (part.part && Array.isArray(part.part)) {
        this.extractAttachments(part.part, attachments);
      }
    }
  }

  // ==========================================
  // PROCESAR ADJUNTOS DE MAILPARSER
  // ==========================================
  processParsedAttachments(parsedAttachments: any[]): EmailAttachment[] {
    if (!parsedAttachments || parsedAttachments.length === 0) {
      return [];
    }

    return parsedAttachments.map((att) => {
      const attachment: EmailAttachment = {
        fileName: att.filename || att.fileName || 'unknown',
        contentType: att.contentType || 'application/octet-stream',
        size: att.size || 0,
        content: att.content,
      };

      // Agregar información de tipo multimedia
      const multimediaInfo = this.classifyAttachment(attachment);
      attachment.isImage = multimediaInfo.type === 'image';
      attachment.isPDF = multimediaInfo.type === 'pdf';

      return attachment;
    });
  }

  // ==========================================
  // CONVERTIR IMAGEN A BASE64 (para thumbnails)
  // ==========================================
  imageToBase64(attachment: EmailAttachment): string | null {
    if (!this.isImage(attachment) || !attachment.content) {
      return null;
    }

    try {
      const base64 = attachment.content.toString('base64');
      return `data:${attachment.contentType};base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  }

  // ==========================================
  // GENERAR URL DE DESCARGA SIMULADA
  // ==========================================
  generateDownloadUrl(attachment: EmailAttachment, messageId: string): string {
    return `/api/email/attachments/${messageId}/${attachment.partId || 0}`;
  }

  // ==========================================
  // ENRIQUECER ADJUNTO CON INFORMACIÓN ADICIONAL
  // ==========================================
  enrichAttachment(
    attachment: EmailAttachment,
    messageId?: string,
  ): EmailAttachment {
    const enriched = { ...attachment };
    const multimediaInfo = this.classifyAttachment(attachment);

    // Agregar metadatos
    enriched.isImage = multimediaInfo.type === 'image';
    enriched.isPDF = multimediaInfo.type === 'pdf';

    // Generar URL de descarga si se proporciona messageId
    if (messageId) {
      enriched.url = this.generateDownloadUrl(attachment, messageId);
    }

    // Convertir imágenes a base64 si están disponibles
    if (enriched.isImage && enriched.content) {
      enriched.thumbnail = this.imageToBase64(enriched) || undefined;
    }

    return enriched;
  }
}
