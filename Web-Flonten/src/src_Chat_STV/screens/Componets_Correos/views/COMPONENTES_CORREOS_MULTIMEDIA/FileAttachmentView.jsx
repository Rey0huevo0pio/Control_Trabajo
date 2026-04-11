/**
 * ============================================================================
 * 📎 FILE ATTACHMENT VIEW - Visor de archivos genéricos (Web)
 * ============================================================================
 */
import React from 'react';

const fileIcons = {
  word: { emoji: '📝', color: '#007AFF' },
  excel: { emoji: '📊', color: '#34C759' },
  powerpoint: { emoji: '📽️', color: '#FF9500' },
  zip: { emoji: '📦', color: '#FFCC00' },
  audio: { emoji: '🎵', color: '#FF9500' },
  video: { emoji: '🎥', color: '#AF52DE' },
  text: { emoji: '📃', color: '#8E8E93' },
  file: { emoji: '📎', color: '#8E8E93' },
};

function getFileType(mimeType) {
  const ct = (mimeType || '').toLowerCase();
  if (ct.includes('word') || ct.includes('document')) return 'word';
  if (ct.includes('excel') || ct.includes('spreadsheet')) return 'excel';
  if (ct.includes('powerpoint') || ct.includes('presentation')) return 'powerpoint';
  if (ct.includes('zip') || ct.includes('rar') || ct.includes('compress')) return 'zip';
  if (ct.startsWith('audio')) return 'audio';
  if (ct.startsWith('video')) return 'video';
  if (ct.startsWith('text')) return 'text';
  return 'file';
}

export function FileAttachmentView({ attachment, small = false }) {
  const mimeType = attachment.contentType || attachment.mimeType || '';
  const fileName = attachment.fileName || attachment.filename || 'archivo';
  const size = attachment.size || 0;
  const fileType = getFileType(mimeType);
  const icon = fileIcons[fileType] || fileIcons.file;

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
        width: 48, height: 48, borderRadius: 8,
        backgroundColor: `${icon.color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>{icon.emoji}</div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 12, padding: 16,
      border: '1px solid #E5E5EA',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 12,
        backgroundColor: `${icon.color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
      }}>{icon.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#3C3C43' }}>{fileName}</div>
        <div style={{ fontSize: 13, color: '#8E8E93' }}>{formatFileSize(size)} · {mimeType || 'archivo'}</div>
      </div>
      <button style={{
        backgroundColor: icon.color, border: 'none', borderRadius: 8,
        padding: '8px 14px', cursor: 'pointer', color: 'white',
        fontSize: 13, fontWeight: 600,
      }}>⬇️ Descargar</button>
    </div>
  );
}
