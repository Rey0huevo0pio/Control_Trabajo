/**
 * ============================================================================
 * 📧 EMAIL CONTENT VIEWER - Visor de contenido de correo (Web)
 * ============================================================================
 * 
 * ADAPTADO DE: C_Ticket_Apk_STV/.../EmailContentViewer.tsx
 * 
 * ============================================================================
 */
import React, { useState } from 'react';

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
  return emailDate.toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export function EmailContentViewer({ email, onBack }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!email) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#8E8E93' }}>Cargando correo...</p>
      </div>
    );
  }

  const getTextContent = () => {
    if (email.text && email.text.length > 0) return email.text;
    if (email.html) {
      return email.html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    }
    return '';
  };

  return (
    <div>
      <div style={{
        backgroundColor: '#007AFF', padding: '12px 16px',
        borderRadius: '14px 14px 0 0',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, border: 'none',
          backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
          fontSize: 16, color: 'white',
        }}>←</button>
        <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>Correo</span>
      </div>

      <div style={{
        backgroundColor: 'white', padding: 20,
        borderRadius: '0 0 14px 14px', border: '1px solid #D1D1D6',
        borderTop: 'none',
      }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#000' }}>
            {email.subject || 'Sin asunto'}
          </h3>
        </div>

        <div style={{
          display: 'flex', gap: 14, alignItems: 'flex-start',
          paddingBottom: 16, borderBottom: '1px solid #F2F2F7',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 24,
            backgroundColor: '#007AFF', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white',
          }}>
            {getInitials(email.from)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#000' }}>
                  {extractName(email.from)}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>
                  {extractEmailAddress(email.from)}
                </p>
              </div>
              <span style={{ fontSize: 12, color: '#8E8E93' }}>
                {formatDate(email.date)}
              </span>
            </div>

            {showDetails && (
              <div style={{
                marginTop: 12, padding: 12, backgroundColor: '#F2F2F7',
                borderRadius: 8, fontSize: 12, color: '#8E8E93',
              }}>
                <p><strong>De:</strong> {email.from}</p>
                <p><strong>Fecha:</strong> {new Date(email.date).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ paddingTop: 20 }}>
          {email.html ? (
            <div dangerouslySetInnerHTML={{ __html: email.html }} style={{ fontSize: 14, lineHeight: 1.6 }} />
          ) : (
            <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {getTextContent()}
            </p>
          )}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div style={{
            marginTop: 24, padding: 16, backgroundColor: '#F2F2F7',
            borderRadius: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>📎</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {email.attachments.length} adjunto{email.attachments.length > 1 ? 's' : ''}
              </span>
            </div>

            {email.attachments.map((att, idx) => {
              const fileName = att.fileName || att.filename || 'Archivo';
              const mimeType = (att.contentType || att.mimeType || '').toLowerCase();
              const size = att.size || 0;
              
              const formatSize = (bytes) => {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
              };

              return (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                  backgroundColor: 'white', borderRadius: 8, marginBottom: 8,
                }}>
                  <span style={{ fontSize: 24 }}>
                    {mimeType.startsWith('image') ? '🖼️' : 
                     mimeType.includes('pdf') ? '📄' : '📎'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                      {fileName}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>
                      {formatSize(size)} • {mimeType || 'archivo'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailContentViewer;