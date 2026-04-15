/**
 * ============================================================================
 * 📄 PDF ATTACHMENT VIEW - Visor de PDFs adjuntos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/.../PdfAttachmentView.tsx
 *
 * QUÉ HACE:
 * - Muestra información de archivos PDF adjuntos
 * - Preview si hay contenido de texto
 * - Icono y formato profesional
 *
 * ============================================================================
 */
import React from 'react';

export function PdfAttachmentView({ attachment, fileName, size, content }) {
  // Extraer datos del attachment o props directas
  const attName = fileName || attachment?.fileName || 'Documento PDF';
  const attSize = size || attachment?.size || 0;
  const attContent = content || attachment?.content || '';

  const sizeKB = (attSize / 1024).toFixed(1);
  const sizeMB = (attSize / 1024 / 1024).toFixed(2);
  const displaySize = attSize > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <div style={{
      border: '1px solid #E5E5EA',
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#F2F2F7',
    }}>
      {/* Header del PDF */}
      <div style={{
        backgroundColor: '#FF3B30',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 40 }}>📄</span>
        <p style={{
          margin: '8px 0 0',
          fontSize: 14,
          fontWeight: 600,
          color: 'white',
          textAlign: 'center',
        }}>
          {attName}
        </p>
        <p style={{
          margin: '4px 0 0',
          fontSize: 12,
          color: 'rgba(255,255,255,0.8)',
        }}>
          PDF • {displaySize}
        </p>
      </div>

      {/* Preview si hay contenido */}
      {attContent ? (
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
            📋 Contenido del PDF:
          </p>
          <p style={{
            margin: 0,
            fontSize: 13,
            color: '#1A1A1A',
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
          }}>
            {attContent.length > 500
              ? attContent.substring(0, 500) + '...'
              : attContent}
          </p>
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
            📎 Descarga para ver el contenido completo
          </p>
        </div>
      )}
    </div>
  );
}

export default PdfAttachmentView;
