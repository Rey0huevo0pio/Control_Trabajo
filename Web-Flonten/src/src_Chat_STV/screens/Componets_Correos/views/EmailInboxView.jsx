/**
 * ============================================================================
 * 📬 EMAIL INBOX VIEW - Bandeja de entrada (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/views/EmailInboxView.tsx
 *
 * QUÉ HACE:
 * - Lista de correos con vista de detalle
 * - Estado loading, error, empty
 * - Click para ver contenido completo
 *
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import { EmailContentViewer } from './COMPONENTES_CORREOS_MULTIMEDIA/EmailContentViewer';
import { emailMessagesService } from '../../../../services/emailMessages.service';

export function EmailInboxView() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await emailMessagesService.getMessages('INBOX', 1, 50);
      setEmails(result.emails || []);
    } catch (err) {
      console.error('[EmailInbox] Error cargando correos:', err);
      setError('Error al cargar correos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadEmails();
  };

  const openEmail = (email) => {
    setSelectedEmail(email);
  };

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  const formatDate = (dateStr) => {
    const emailDate = new Date(dateStr);
    const diffMs = Date.now() - emailDate.getTime();
    const diffH = diffMs / (1000 * 60 * 60);
    const diffD = diffMs / (1000 * 60 * 60 * 24);
    if (diffH < 1) return 'Hace min';
    if (diffH < 24) return `${Math.floor(diffH)}h`;
    if (diffD < 7) return `${Math.floor(diffD)}d`;
    return emailDate.toLocaleDateString();
  };

  const getInitials = (from) => {
    if (!from) return '?';
    const parts = from.split(' ').filter(p => !p.includes('<'));
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.substring(0, 2).toUpperCase() || '?';
  };

  const getTextPreview = (email) => {
    if (email.text && email.text.length > 0 && email.text !== 'Sin contenido') {
      return email.text.substring(0, 120);
    }
    if (email.html) {
      const textFromHtml = email.html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      return textFromHtml.substring(0, 120);
    }
    return '';
  };

  const getAttachmentIcon = (contentType) => {
    const ct = contentType.toLowerCase();
    if (ct.startsWith('image')) return '🖼️';
    if (ct.includes('pdf')) return '📄';
    if (ct.includes('excel') || ct.includes('spreadsheet')) return '📊';
    if (ct.includes('word')) return '📝';
    if (ct.startsWith('video')) return '🎥';
    return '📎';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📧</div>
          <p style={{ color: '#3C3C43', fontSize: 15 }}>Cargando correos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <p style={{ color: '#FF3B30', fontSize: 15 }}>{error}</p>
        <button onClick={handleRefresh} style={{
          marginTop: 12, backgroundColor: '#007AFF', border: 'none',
          borderRadius: 10, padding: '10px 20px', cursor: 'pointer', color: 'white',
        }}>Reintentar</button>
      </div>
    );
  }

  if (selectedEmail) {
    return (
      <EmailContentViewer
        email={{
          from: selectedEmail.from,
          subject: selectedEmail.subject,
          date: selectedEmail.date,
          text: selectedEmail.text,
          html: selectedEmail.html,
          attachments: selectedEmail.attachments,
        }}
        onBack={closeEmail}
      />
    );
  }

  return (
    <div>
      {/* Header de bandeja */}
      <div style={{
        backgroundColor: '#007AFF', padding: '16px 20px',
        borderRadius: '14px 14px 0 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>📬 Bandeja de Entrada</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginLeft: 12 }}>
            {emails.length} correos
          </span>
        </div>
        <button onClick={handleRefresh} style={{
          border: 'none', backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 18, width: 36, height: 36, cursor: 'pointer',
          fontSize: 16, color: 'white',
        }}>🔄</button>
      </div>

      {/* Lista de correos */}
      {emails.length === 0 ? (
        <div style={{
          backgroundColor: 'white', padding: 60, textAlign: 'center',
          borderRadius: '0 0 14px 14px',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#3C3C43' }}>No hay correos</p>
          <p style={{ fontSize: 14, color: '#8E8E93' }}>Tu bandeja está vacía</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white', borderRadius: '0 0 14px 14px',
          border: '1px solid #D1D1D6', borderTop: 'none',
        }}>
          {emails.map((email, index) => (
            <div
              key={email.id}
              onClick={() => openEmail(email)}
              style={{
                padding: 16, cursor: 'pointer',
                backgroundColor: email.seen ? 'white' : '#E5F1FF',
                borderBottom: index < emails.length - 1 ? '1px solid #F2F2F7' : 'none',
                display: 'flex', gap: 14,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = email.seen ? 'white' : '#E5F1FF'}
            >
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: 24, flexShrink: 0,
                backgroundColor: email.seen ? '#F2F2F7' : '#007AFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: email.seen ? '#3C3C43' : 'white',
              }}>
                {getInitials(email.from)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: email.seen ? 500 : 700, color: '#3C3C43', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 250 }}>
                    {email.from.split('<')[0].trim()}
                  </span>
                  <span style={{ fontSize: 12, color: '#8E8E93', flexShrink: 0 }}>{formatDate(email.date)}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: email.seen ? 400 : 600, color: '#000', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email.subject || 'Sin asunto'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {email.attachments && email.attachments.length > 0 && (
                    <span style={{ fontSize: 14 }}>{email.attachments.map(a => getAttachmentIcon(a.contentType)).join(' ')}</span>
                  )}
                  <span style={{ fontSize: 13, color: '#8E8E93', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {getTextPreview(email)}
                  </span>
                </div>
              </div>

              {!email.seen && (
                <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#007AFF', flexShrink: 0, alignSelf: 'center' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
