/**
 * ============================================================================
 * 📧 EMAIL CONTENT VIEWER - Visor de contenido de correo (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/views/COMPONENTES_CORREOS_MULTIMEDIA/EmailContentViewer.tsx
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { HtmlEmailRenderer } from './HtmlEmailRenderer';
import { AttachmentPreview } from './AttachmentPreview';

export function EmailContentViewer({ email, onBack, loading = false }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const getInitials = (from) => {
    if (!from) return '?';
    const parts = from.split(' ').filter(p => !p.includes('<'));
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.substring(0, 2).toUpperCase() || '?';
  };

  const extractName = (from) => {
    const match = from.match(/<([^>]+)>/);
    return match ? from.substring(0, from.indexOf('<')).trim() : from;
  };

  const extractEmail = (from) => {
    const match = from.match(/<([^>]+)>/);
    return match ? match[1] : from;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const emailDate = new Date(dateStr);
    const diffMs = Date.now() - emailDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${Math.floor(diffHours)} hora(s)`;
    if (diffDays < 7) return `Hace ${Math.floor(diffDays)} día(s)`;
    return emailDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📧</div>
          <p style={{ color: '#3C3C43' }}>Cargando correo...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #D1D1D6', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid #F2F2F7',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={onBack} style={{
          border: 'none', backgroundColor: '#F2F2F7', borderRadius: 18,
          width: 36, height: 36, cursor: 'pointer', fontSize: 16,
        }}>←</button>
        <span style={{ fontSize: 14, fontWeight: 700 }}>Correo</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowDetails(!showDetails)} style={{
            border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 16,
          }}>⋮</button>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: 24 }}>
        {/* Asunto */}
        <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700, color: '#000' }}>
          {email.subject || 'Sin asunto'}
        </h2>
        <hr style={{ border: 'none', borderTop: '1px solid #E5E5EA', margin: '0 0 20px' }} />

        {/* Remitente */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, backgroundColor: '#007AFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {getInitials(email.from)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>{extractName(email.from)}</div>
                <div style={{ fontSize: 13, color: '#8E8E93' }}>{extractEmail(email.from)}</div>
              </div>
              <span style={{ fontSize: 12, color: '#8E8E93' }}>{formatDate(email.date)}</span>
            </div>

            {showDetails && (
              <div style={{
                marginTop: 12, padding: 12, backgroundColor: '#F2F2F7',
                borderRadius: 8, fontSize: 13, color: '#3C3C43',
              }}>
                <div><strong>De:</strong> {email.from}</div>
                <div><strong>Fecha:</strong> {new Date(email.date).toLocaleString('es-MX')}</div>
              </div>
            )}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E5E5EA', margin: '0 0 20px' }} />

        {/* Cuerpo del correo */}
        <HtmlEmailRenderer html={email.html} text={email.text} />

        {/* Adjuntos */}
        {email.attachments && email.attachments.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div
              onClick={() => setShowAttachments(!showAttachments)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: '#3C3C43' }}>
                📎 {email.attachments.length} adjunto{email.attachments.length > 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: 18 }}>{showAttachments ? '▼' : '▶'}</span>
            </div>

            {showAttachments && (
              <AttachmentPreview attachments={email.attachments} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
