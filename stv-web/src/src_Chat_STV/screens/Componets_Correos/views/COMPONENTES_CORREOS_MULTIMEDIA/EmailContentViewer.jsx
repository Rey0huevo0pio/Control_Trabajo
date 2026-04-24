/**
 * ============================================================================
 * 📧 EMAIL CONTENT VIEWER - Visor profesional de correos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/.../EmailContentViewer.tsx
 *
 * MEJORAS:
 * - Diseño tipo Gmail/Outlook con header limpio
 * - Imágenes inline renderizadas dentro del contenido HTML
 * - Adjuntos con preview visual tipo Outlook (iconos + grid)
 * - HtmlEmailRenderer para contenido HTML estilizado
 * - AttachmentPreview para adjuntos profesionales
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { HtmlEmailRenderer } from './HtmlEmailRenderer';
import { AttachmentPreview } from './AttachmentPreview';
import { ImageAttachmentView } from './ImageAttachmentView';

// ==========================================
// UTILIDADES
// ==========================================
const decodeEmailSubject = (subject) => {
  if (!subject) return 'Sin asunto';
  if (!subject.startsWith('=?')) return subject;
  try {
    return subject.replace(/=\?([^?]+)\?([BQ])\?([^?]*)\?=/gi, (match, charset, encoding, text) => {
      if (encoding.toUpperCase() === 'B') {
        return atob(text.replace(/-/g, '+').replace(/_/g, '/'));
      } else if (encoding.toUpperCase() === 'Q') {
        return text.replace(/_/g, ' ').replace(/=([A-F0-9]{2})/gi, (m, hex) => String.fromCharCode(parseInt(hex, 16)));
      }
      return text;
    });
  } catch {
    return subject;
  }
};

const getInitials = (from) => {
  if (!from) return '?';
  const parts = from.split(' ').filter(p => !p.includes('<'));
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0]?.substring(0, 2).toUpperCase() || '?';
};

const extractEmailAddress = (from) => {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from;
};

const extractName = (from) => {
  const match = from.match(/<([^>]+)>/);
  return match ? from.substring(0, from.indexOf('<')).trim() : from;
};

const formatDate = (date) => {
  if (!date) return '';
  const emailDate = new Date(date);
  const now = new Date();
  const diffMs = now - emailDate.getTime();
  const diffH = diffMs / (1000 * 60 * 60);
  const diffD = diffMs / (1000 * 60 * 60 * 24);

  if (diffH < 1) return 'Hace minutos';
  if (diffH < 24) return `Hace ${Math.floor(diffH)}h`;
  if (diffD < 1) return 'Hoy';
  if (diffD < 7) return `Hace ${Math.floor(diffD)}d`;
  return emailDate.toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: emailDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: '2-digit', minute: '2-digit',
  });
};

const formatFullDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// Colores para avatares
const AVATAR_COLORS = [
  '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE',
  '#FF2D55', '#5856D6', '#00C7BE', '#FFCC00', '#A2845E',
];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export function EmailContentViewer({ email, onBack }) {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedAttachments, setExpandedAttachments] = useState(false);

  if (!email) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
        <p style={{ color: '#8E8E93', fontSize: 15 }}>Cargando correo...</p>
      </div>
    );
  }

  const hasAttachments = email.attachments && email.attachments.length > 0;
  
  // DEBUG: Log del contenido del correo
  console.log('[EmailContentViewer] 📧 Correo recibido:', {
    uid: email.uid,
    subject: email.subject?.substring(0, 50),
    htmlLength: email.html?.length || 0,
    textLength: email.text?.length || 0,
    htmlPreview: email.html?.substring(0, 300) || 'SIN HTML',
  });
  
  const imageAttachments = hasAttachments
    ? email.attachments.filter(att => {
        const mt = (att.contentType || att.mimeType || '').toLowerCase();
        return mt.startsWith('image');
      })
    : [];
  const fileAttachments = hasAttachments
    ? email.attachments.filter(att => {
        const mt = (att.contentType || att.mimeType || '').toLowerCase();
        return !mt.startsWith('image');
      })
    : [];

  const avatarColor = getAvatarColor(email.from);
  const senderName = extractName(email.from);
  const senderEmail = extractEmailAddress(email.from);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ==========================================
          HEADER DEL CORREO (Tipo Gmail)
      ========================================== */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #E5E5EA',
        backgroundColor: '#FAFAFA',
      }}>
        {/* Barra superior con botón volver */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onBack}
              style={{
                width: 36, height: 36, borderRadius: 18, border: '1px solid #D1D1D6',
                backgroundColor: 'white', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F2F2F7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              ←
            </button>
            <h2 style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: '#1A1A1A',
              lineHeight: 1.3,
            }}>
              {decodeEmailSubject(email.subject) || 'Sin asunto'}
            </h2>
          </div>

          {/* Botón info */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #D1D1D6',
              backgroundColor: showDetails ? '#F2F2F7' : 'white',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            ℹ️
          </button>
        </div>

        {/* Info del remitente */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: 24, flexShrink: 0,
            backgroundColor: avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'white',
          }}>
            {getInitials(email.from)}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                color: '#1A1A1A',
              }}>
                {senderName}
              </h3>
              <span style={{
                fontSize: 13,
                color: '#8E8E93',
                flexShrink: 0,
                marginLeft: 12,
              }}>
                {formatDate(email.date)}
              </span>
            </div>
            <p style={{
              margin: '4px 0 0',
              fontSize: 13,
              color: '#8E8E93',
            }}>
              {senderEmail}
            </p>

            {/* Detalles expandidos */}
            {showDetails && (
              <div style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: '#F2F2F7',
                borderRadius: 8,
                fontSize: 12,
                color: '#3C3C43',
              }}>
                <p style={{ margin: '4px 0' }}><strong>De:</strong> {email.from}</p>
                <p style={{ margin: '4px 0' }}><strong>Fecha:</strong> {formatFullDate(email.date)}</p>
                <p style={{ margin: '4px 0' }}><strong>Para:</strong> {email.to || 'No disponible'}</p>
                {email.cc && <p style={{ margin: '4px 0' }}><strong>CC:</strong> {email.cc}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          IMÁGENES INLINE (Tipo Outlook)
          Se muestran ANTES del contenido, como preview
      ========================================== */}
      {imageAttachments.length > 0 && (
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #E5E5EA',
          backgroundColor: '#FAFAFA',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>🖼️</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>
              {imageAttachments.length} imagen{imageAttachments.length > 1 ? 'es' : ''}
            </span>
          </div>

          {/* Grid de imágenes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 10,
          }}>
            {imageAttachments.slice(0, 4).map((att, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: '#F2F2F7',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <ImageAttachmentView
                  attachment={att}
                />
              </div>
            ))}
          </div>

          {imageAttachments.length > 4 && (
            <button
              onClick={() => setExpandedAttachments(!expandedAttachments)}
              style={{
                marginTop: 12,
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #D1D1D6',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: 14,
                color: '#007AFF',
                fontWeight: 600,
              }}
            >
              Ver {imageAttachments.length - 4} imagen{imageAttachments.length - 4 > 1 ? 'es' : ''} más
            </button>
          )}

          {expandedAttachments && imageAttachments.length > 4 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 10,
              marginTop: 10,
            }}>
              {imageAttachments.slice(4).map((att, idx) => (
                <div
                  key={idx + 4}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    backgroundColor: '#F2F2F7',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <ImageAttachmentView attachment={att} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          CONTENIDO DEL CORREO
      ========================================== */}
      <div style={{ padding: '24px', flex: 1, overflow: 'auto' }}>
        <HtmlEmailRenderer
          html={email.html}
          text={email.text}
        />
      </div>

      {/* ==========================================
          ARCHIVOS ADJUNTOS (Tipo Outlook)
      ========================================== */}
      {fileAttachments.length > 0 && (
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #E5E5EA',
          backgroundColor: '#FAFAFA',
        }}>
          <AttachmentPreview attachments={fileAttachments} />
        </div>
      )}

      {/* ==========================================
          FOOTER CON TOTAL ADJUNTOS
      ========================================== */}
      {hasAttachments && (
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #E5E5EA',
          backgroundColor: '#F2F2F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>📎</span>
          <span style={{ fontSize: 13, color: '#8E8E93', fontWeight: 500 }}>
            {email.attachments.length} adjunto{email.attachments.length > 1 ? 's' : ''} en total
          </span>
        </div>
      )}
    </div>
  );
}

export default EmailContentViewer;
