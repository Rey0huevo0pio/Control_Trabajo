/**
 * ============================================================================
 * 🖼️ IMAGE ATTACHMENT VIEW - Visor de imágenes adjuntas (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/.../ImageAttachmentView.tsx
 *
 * QUÉ HACE:
 * - Muestra imágenes adjuntas con carga progresiva
 * - Soporta base64 completo y URLs
 * - Detecta thumbnails truncados del backend y muestra placeholder
 *
 * NOTA: El backend trunca thumbnails a 200 chars en la lista de emails.
 * Solo se muestran imágenes cuando el contenido base64 tiene >500 chars
 * o cuando viene como URL completa.
 *
 * ============================================================================
 */
import React, { useState } from 'react';

export function ImageAttachmentView({ attachment, fileName, size, content, mimeType }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Extraer datos del attachment o props directas
  const attName = fileName || attachment?.fileName || attachment?.filename || 'Imagen';
  const attSize = size || attachment?.size || 0;
  // El contenido puede venir de diferentes campos según el backend
  const attContent = content
    || attachment?.content
    || attachment?.thumbnail
    || attachment?.base64
    || attachment?.data
    || attachment?.url
    || attachment?.downloadUrl
    || '';
  const attMimeType = mimeType || attachment?.contentType || attachment?.mimeType || attachment?.type || '';

  const sizeKB = (attSize / 1024).toFixed(1);
  const sizeMB = (attSize / 1024 / 1024).toFixed(2);
  const displaySize = attSize > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  // Validar que el URI no esté truncado o corrupto
  // Un JPEG mínimo válido tiene al menos ~500 chars en base64
  const MIN_BASE64_LENGTH = 500;

  let imageUri = null;
  let isValidImage = false;
  const isTruncated = attContent.length > 0 && attContent.length < MIN_BASE64_LENGTH;

  if (attContent) {
    // Si es URL completa
    if (attContent.startsWith('http')) {
      imageUri = attContent;
      isValidImage = true;
    }
    // Si es data URI
    else if (attContent.startsWith('data:')) {
      imageUri = attContent;
      isValidImage = attContent.length > MIN_BASE64_LENGTH;
    }
    // Si es base64 puro (sin prefix)
    else if (attContent.length > MIN_BASE64_LENGTH) {
      imageUri = `data:${attMimeType};base64,${attContent}`;
      isValidImage = true;
    }
  }

  // Extension de la imagen para el icono
  const getExtension = () => {
    const parts = attName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'IMG';
  };

  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#F2F2F7',
    }}>
      {isValidImage ? (
        /* ✅ Imagen válida - mostrar */
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
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}>
              <div style={{
                width: 32, height: 32,
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
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
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
        /* 📋 Placeholder - Imagen truncada o no disponible */
        <div style={{
          minHeight: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 16px',
          background: 'linear-gradient(135deg, #E5E5EA 0%, #F2F2F7 100%)',
        }}>
          {/* Icono de imagen grande */}
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            backgroundColor: 'rgba(0,122,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 32 }}>🖼️</span>
          </div>

          {/* Nombre del archivo */}
          <p style={{
            margin: '0 0 4px',
            fontSize: 14,
            fontWeight: 600,
            color: '#1A1A1A',
            textAlign: 'center',
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {attName}
          </p>

          {/* Extensión y tamaño */}
          <p style={{
            margin: '0 0 8px',
            fontSize: 12,
            color: '#8E8E93',
          }}>
            {getExtension()} • {displaySize}
          </p>

          {/* Indicador de truncado */}
          {isTruncated && (
            <div style={{
              marginTop: 8,
              padding: '6px 12px',
              backgroundColor: 'rgba(255,149,0,0.1)',
              borderRadius: 6,
              fontSize: 11,
              color: '#FF9500',
              fontWeight: 500,
            }}>
              ⚠️ Vista previa no disponible
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageAttachmentView;
