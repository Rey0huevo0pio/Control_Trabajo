/**
 * ============================================================================
 * 📧 COMPONENTES CORREOS MULTIMEDIA (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/views/COMPONENTES_CORREOS_MULTIMEDIA/
 * 
 * ============================================================================
 */
import React from 'react';
export { EmailContentViewer } from './EmailContentViewer';

export const HtmlEmailRenderer = ({ html, text }) => {
  if (html) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <p style={{ whiteSpace: 'pre-wrap' }}>{text || ''}</p>;
};

export const AttachmentPreview = ({ attachment, onPress }) => {
  const fileName = attachment.fileName || attachment.filename || 'Archivo';
  const mimeType = (attachment.contentType || attachment.mimeType || '').toLowerCase();
  
  return (
    <div onClick={onPress} style={{ cursor: 'pointer', padding: 12, backgroundColor: '#F2F2F7', borderRadius: 8 }}>
      <span style={{ fontSize: 24 }}>
        {mimeType.startsWith('image') ? '🖼️' : mimeType.includes('pdf') ? '📄' : '📎'}
      </span>
      <p style={{ margin: '8px 0 0', fontSize: 14 }}>{fileName}</p>
    </div>
  );
};

export const ImageAttachmentView = ({ attachment }) => {
  if (attachment.thumbnail) {
    return <img src={attachment.thumbnail} alt={attachment.fileName} style={{ maxWidth: '100%', borderRadius: 8 }} />;
  }
  return <img src={attachment.content} alt={attachment.fileName} style={{ maxWidth: '100%', borderRadius: 8 }} />;
};

export const PdfAttachmentView = ({ attachment }) => {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <span style={{ fontSize: 48 }}>📄</span>
      <p style={{ margin: '12px 0', fontWeight: 600 }}>{attachment.fileName}</p>
      <p style={{ color: '#8E8E93', fontSize: 12 }}>Vista previa no disponible</p>
    </div>
  );
};

export const FileAttachmentView = ({ attachment, onPress }) => {
  const fileName = attachment.fileName || attachment.filename || 'Archivo';
  const mimeType = (attachment.contentType || attachment.mimeType || '').toLowerCase();
  
  return (
    <div onClick={onPress} style={{ 
      display: 'flex', alignItems: 'center', gap: 12, padding: 12, 
      backgroundColor: '#F2F2F7', borderRadius: 8, cursor: 'pointer' 
    }}>
      <span style={{ fontSize: 24 }}>
        {mimeType.startsWith('image') ? '🖼️' : 
         mimeType.includes('pdf') ? '📄' : 
         mimeType.includes('word') ? '📝' : 
         mimeType.includes('excel') ? '📊' : '📎'}
      </span>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{fileName}</p>
        <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>{mimeType}</p>
      </div>
    </div>
  );
};