/**
 * ============================================================================
 * 📎 ATTACHMENT PREVIEW - Visor de adjuntos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/.../AttachmentPreview.tsx
 *
 * QUÉ HACE:
 * - Muestra lista/grid de archivos adjuntos
 * - Toggle entre vista de cuadrícula y lista
 * - Iconos y colores según tipo de archivo
 *
 * ============================================================================
 */
import React, { useState } from 'react';

const getFileIcon = (mimeType) => {
  if (!mimeType) return '📎';
  const mt = mimeType.toLowerCase();
  if (mt.startsWith('image')) return '🖼️';
  if (mt.includes('pdf')) return '📄';
  if (mt.includes('word')) return '📝';
  if (mt.includes('excel') || mt.includes('spreadsheet')) return '📊';
  if (mt.includes('powerpoint') || mt.includes('presentation')) return '📑';
  if (mt.startsWith('video')) return '🎬';
  if (mt.startsWith('audio')) return '🎵';
  if (mt.includes('zip') || mt.includes('rar')) return '📦';
  return '📎';
};

// eslint-disable-next-line no-unused-vars
const getFileIconColor = (mimeType) => {
  if (!mimeType) return '#8E8E93';
  const mt = mimeType.toLowerCase();
  if (mt.startsWith('image')) return '#007AFF';
  if (mt.includes('pdf')) return '#FF3B30';
  if (mt.includes('word')) return '#2B579A';
  if (mt.includes('excel') || mt.includes('spreadsheet')) return '#217346';
  if (mt.includes('powerpoint') || mt.includes('presentation')) return '#D24726';
  if (mt.startsWith('video')) return '#AF52DE';
  if (mt.startsWith('audio')) return '#FF9500';
  if (mt.includes('zip') || mt.includes('rar')) return '#FFD60A';
  return '#8E8E93';
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export function AttachmentPreview({ attachments }) {
  const [viewMode, setViewMode] = useState('grid');

  if (!attachments || attachments.length === 0) return null;

  return (
    <div style={{
      borderTop: '1px solid #E5E5EA',
      paddingTop: 16,
      marginTop: 8,
    }}>
      {/* Header con contador y toggle de vista */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>📎</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>
            {attachments.length} adjunto{attachments.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Toggle de vista (solo si hay más de 2 adjuntos) */}
        {attachments.length > 2 && (
          <div style={{
            display: 'flex',
            gap: 4,
            backgroundColor: '#F2F2F7',
            borderRadius: 8,
            padding: 4,
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              ☰
            </button>
          </div>
        )}
      </div>

      {/* Vista en cuadrícula */}
      {viewMode === 'grid' && attachments.length > 1 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
          padding: '8px 0',
        }}>
          {attachments.map((att, idx) => {
            const fileName = att.fileName || att.filename || 'Archivo adjunto';
            const mimeType = (att.contentType || att.mimeType || '').toLowerCase();
            const size = att.size || 0;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F2F2F7',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {/* Thumbnail o Icono */}
                <div style={{
                  height: 100,
                  backgroundColor: '#E5E5EA',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 40,
                }}>
                  {getFileIcon(mimeType)}
                </div>

                {/* Información del archivo */}
                <div style={{ padding: 8 }}>
                  <p style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#1A1A1A',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {fileName}
                  </p>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: 10,
                    color: '#8E8E93',
                  }}>
                    {formatFileSize(size)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vista en lista */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {attachments.map((att, idx) => {
            const fileName = att.fileName || att.filename || 'Archivo adjunto';
            const mimeType = (att.contentType || att.mimeType || '').toLowerCase();
            const size = att.size || 0;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F2F2F7',
                  borderRadius: 12,
                  padding: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                {/* Icono */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: '#E5E5EA',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 28,
                }}>
                  {getFileIcon(mimeType)}
                </div>

                {/* Información */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1A1A1A',
                  }}>
                    {fileName}
                  </p>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: 12,
                    color: '#8E8E93',
                  }}>
                    {formatFileSize(size)} • {mimeType || 'archivo'}
                  </p>
                </div>

                {/* Botón de descarga */}
                <span style={{ fontSize: 20, color: '#8E8E93' }}>⬇️</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AttachmentPreview;
