/**
 * ============================================================================
 * 📎 ATTACHMENT PREVIEW - Vista previa de adjuntos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/views/COMPONENTES_CORREOS_MULTIMEDIA/AttachmentPreview.tsx
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { ImageAttachmentView } from './ImageAttachmentView';
import { PdfAttachmentView } from './PdfAttachmentView';
import { FileAttachmentView } from './FileAttachmentView';

export function AttachmentPreview({ attachments }) {
  const [viewMode, setViewMode] = useState('list'); // 'grid' | 'list'

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (mimeType) => {
    const ct = (mimeType || '').toLowerCase();
    if (ct.startsWith('image')) return 'image';
    if (ct.includes('pdf')) return 'pdf';
    if (ct.includes('word')) return 'word';
    if (ct.includes('excel') || ct.includes('spreadsheet')) return 'excel';
    if (ct.includes('powerpoint')) return 'powerpoint';
    if (ct.startsWith('video')) return 'video';
    if (ct.startsWith('audio')) return 'audio';
    if (ct.includes('zip') || ct.includes('rar')) return 'zip';
    return 'file';
  };

  return (
    <div>
      {/* Toggle de vista */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setViewMode('list')}
          style={{
            padding: '4px 12px', borderRadius: 8, border: 'none',
            backgroundColor: viewMode === 'list' ? '#007AFF' : '#F2F2F7',
            color: viewMode === 'list' ? 'white' : '#3C3C43',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >Lista</button>
        <button
          onClick={() => setViewMode('grid')}
          style={{
            padding: '4px 12px', borderRadius: 8, border: 'none',
            backgroundColor: viewMode === 'grid' ? '#007AFF' : '#F2F2F7',
            color: viewMode === 'grid' ? 'white' : '#3C3C43',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >Cuadrícula</button>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {attachments.map((att, idx) => {
            const fileName = att.fileName || att.filename || 'archivo';
            const mimeType = att.contentType || att.mimeType || '';
            const fileType = getFileType(mimeType);

            return (
              <div key={idx} style={{ minWidth: 140, textAlign: 'center' }}>
                {fileType === 'image' && <ImageAttachmentView content={att.content} fileName={fileName} />}
                {fileType === 'pdf' && <PdfAttachmentView attachment={att} />}
                {fileType !== 'image' && fileType !== 'pdf' && <FileAttachmentView attachment={att} />}
                <div style={{ fontSize: 12, color: '#3C3C43', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {fileName}
                </div>
                <div style={{ fontSize: 11, color: '#8E8E93' }}>
                  {formatFileSize(att.size || 0)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {attachments.map((att, idx) => {
            const fileName = att.fileName || att.filename || 'archivo';
            const mimeType = att.contentType || att.mimeType || '';
            const fileType = getFileType(mimeType);

            return (
              <div key={idx} style={{
                backgroundColor: '#F9F9F9', borderRadius: 12, padding: 12,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                {fileType === 'image' && <ImageAttachmentView content={att.content} fileName={fileName} small />}
                {fileType === 'pdf' && <PdfAttachmentView attachment={att} small />}
                {fileType !== 'image' && fileType !== 'pdf' && <FileAttachmentView attachment={att} small />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#3C3C43' }}>{fileName}</div>
                  <div style={{ fontSize: 12, color: '#8E8E93' }}>{formatFileSize(att.size || 0)} · {mimeType || 'archivo'}</div>
                </div>
                <button style={{
                  border: 'none', backgroundColor: '#007AFF', borderRadius: 8,
                  padding: '6px 12px', cursor: 'pointer', color: 'white', fontSize: 13, fontWeight: 600,
                }}>⬇️ Descargar</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
