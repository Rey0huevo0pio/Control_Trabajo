/**
 * ============================================================================
 * 📄 PDF ATTACHMENT VIEW - Visor de PDFs (Web)
 * ============================================================================
 */
import React from 'react';

export function PdfAttachmentView({ attachment, small = false }) {
  const fileName = attachment.fileName || attachment.filename || 'documento.pdf';
  const size = attachment.size || 0;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (small) {
    return (
      <div style={{
        width: 48, height: 48, borderRadius: 8, backgroundColor: '#FF3B30',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>📄</div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 12, overflow: 'hidden',
      border: '1px solid #E5E5EA',
    }}>
      <div style={{
        backgroundColor: '#FF3B30', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 20 }}>📄</span>
        <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{fileName}</span>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 'auto' }}>{formatFileSize(size)}</span>
      </div>
      <div style={{ padding: 16, textAlign: 'center' }}>
        <button style={{
          backgroundColor: '#FF3B30', border: 'none', borderRadius: 10,
          padding: '10px 20px', cursor: 'pointer', color: 'white',
          fontSize: 14, fontWeight: 600,
        }}>📄 Abrir PDF</button>
      </div>
    </div>
  );
}
