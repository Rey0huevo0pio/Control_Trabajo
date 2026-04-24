/**
 * ============================================================================
 * 📎 FILE ATTACHMENT VIEW - Visor de archivos adjuntos genéricos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/.../FileAttachmentView.tsx
 *
 * QUÉ HACE:
 * - Muestra archivos adjuntos genéricos (Word, Excel, ZIP, etc.)
 * - Iconos según tipo de archivo
 * - Preview si es archivo de texto
 *
 * ============================================================================
 */
import React from 'react';

export function FileAttachmentView({ attachment, fileName, size, mimeType, content }) {
  // Extraer datos del attachment o props directas
  const attName = fileName || attachment?.fileName || attachment?.filename || 'Archivo';
  const attSize = size || attachment?.size || 0;
  const attMimeType = mimeType || attachment?.contentType || attachment?.mimeType || '';
  const attContent = content || attachment?.content || '';

  const sizeKB = (attSize / 1024).toFixed(1);
  const sizeMB = (attSize / 1024 / 1024).toFixed(2);
  const displaySize = attSize > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  const getExtension = () => {
    const parts = attName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  };

  const getIcon = () => {
    const mt = attMimeType.toLowerCase();
    if (mt.includes('word') || mt.includes('document')) return '📝';
    if (mt.includes('excel') || mt.includes('sheet') || mt.includes('csv')) return '📊';
    if (mt.includes('powerpoint') || mt.includes('presentation')) return '📑';
    if (mt.includes('zip') || mt.includes('rar') || mt.includes('compressed')) return '📦';
    if (mt.includes('audio')) return '🎵';
    if (mt.includes('video')) return '🎬';
    if (mt.includes('text')) return '📃';
    return '📎';
  };

  return (
    <div style={{
      border: '1px solid #E5E5EA',
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#F2F2F7',
    }}>
      {/* Header del archivo */}
      <div style={{
        backgroundColor: '#E5E5EA',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 40 }}>{getIcon()}</span>
        <p style={{
          margin: '8px 0 0',
          fontSize: 14,
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}>
          {attName}
        </p>
        <p style={{
          margin: '4px 0 0',
          fontSize: 12,
          color: '#8E8E93',
        }}>
          {getExtension()} • {displaySize}
        </p>
      </div>

      {/* Preview si hay contenido (archivos de texto) */}
      {attContent && attMimeType.includes('text') ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: 8,
          margin: 8,
          padding: 12,
        }}>
          <p style={{
            margin: '0 0 8px',
            fontSize: 11,
            color: '#8E8E93',
          }}>
            📋 Vista previa:
          </p>
          <pre style={{
            margin: 0,
            fontSize: 12,
            color: '#1A1A1A',
            lineHeight: 1.5,
            fontFamily: 'monospace',
            overflow: 'hidden',
            maxHeight: 150,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}>
            {attContent.length > 400
              ? attContent.substring(0, 400) + '...'
              : attContent}
          </pre>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: 8,
          margin: 8,
          padding: 12,
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: 12,
            color: '#8E8E93',
          }}>
            📎 {attMimeType.includes('zip') || attMimeType.includes('rar')
              ? 'Archivo comprimido - descarga para extraer'
              : 'Descarga para ver el contenido'}
          </p>
        </div>
      )}
    </div>
  );
}

export default FileAttachmentView;
