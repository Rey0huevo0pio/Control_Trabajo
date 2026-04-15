/**
 * ============================================================================
 * 🖼️ IMAGE ATTACHMENT VIEW - Visor de imágenes adjuntas (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/.../ImageAttachmentView.tsx
 *
 * QUÉ HACE:
 * - Muestra imágenes adjuntas con carga progresiva
 * - Soporta base64 y URLs
 * - Muestra placeholder mientras carga
 *
 * ============================================================================
 */
import React, { useState } from 'react';

export function ImageAttachmentView({ attachment, fileName, size, content, mimeType }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Extraer datos del attachment o props directas
  const attName = fileName || attachment?.fileName || 'Imagen';
  const attSize = size || attachment?.size || 0;
  const attContent = content || attachment?.content || attachment?.thumbnail;
  const attMimeType = mimeType || attachment?.contentType || attachment?.mimeType || '';

  const sizeKB = (attSize / 1024).toFixed(1);
  const sizeMB = (attSize / 1024 / 1024).toFixed(2);
  const displaySize = attSize > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  // Construir URI de imagen desde base64 o URL
  const imageUri = attContent
    ? (attContent.startsWith('data:') || attContent.startsWith('http'))
      ? attContent
      : `data:${attMimeType};base64,${attContent}`
    : null;

  // Validar que el URI no esté truncado o corrupto
  const isValidImage = imageUri && (
    imageUri.startsWith('http') ||
    (imageUri.startsWith('data:') && imageUri.length > 100)
  );

  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#F2F2F7',
    }}>
      {isValidImage ? (
        <div style={{ position: 'relative' }}>
          <img
            src={imageUri}
            alt={attName}
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              display: 'block',
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
              <div style={{
                width: 32,
                height: 32,
                border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid #007AFF',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
          {error && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
              <span style={{ fontSize: 40 }}>⚠️</span>
              <p style={{ margin: '8px 0 0', fontSize: 12, color: 'white' }}>
                Error al cargar imagen
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Placeholder si no hay contenido */
        <div style={{
          minHeight: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
          <span style={{ fontSize: 40 }}>🖼️</span>
          <p style={{
            margin: '8px 0 0',
            fontSize: 14,
            color: '#8E8E93',
            textAlign: 'center',
          }}>
            {attName}
          </p>
          <p style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: '#C7C7CC',
          }}>
            {displaySize} • {attMimeType}
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageAttachmentView;
