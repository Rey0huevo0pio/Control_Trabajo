/**
 * ============================================================================
 * 🖼️ IMAGE ATTACHMENT VIEW - Visor de imágenes (Web)
 * ============================================================================
 */
import React, { useState } from 'react';

export function ImageAttachmentView({ content, fileName, small = false }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const size = small ? { width: 48, height: 48 } : { width: '100%', maxWidth: 400 };

  if (error || !content) {
    return (
      <div style={{
        ...size, backgroundColor: '#F2F2F7', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: small ? 20 : 32,
      }}>🖼️</div>
    );
  }

  const dataUri = content.startsWith('data:') ? content : `data:image/jpeg;base64,${content}`;

  return (
    <div style={{ position: 'relative', ...size }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, backgroundColor: '#F2F2F7',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>⏳</div>
      )}
      <img
        src={dataUri}
        alt={fileName || 'Imagen adjunta'}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        style={{
          ...size, borderRadius: 8, objectFit: 'cover',
        }}
      />
    </div>
  );
}
