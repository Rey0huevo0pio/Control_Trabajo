/**
 * ============================================================================
 * 📬 EMAIL INBOX VIEW - Bandeja de entrada profesional (Web)
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import { EmailContentViewer } from './COMPONENTES_CORREOS_MULTIMEDIA/EmailContentViewer';
import { emailMessagesService } from '../../../../services/emailMessages.service';

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

export function EmailInboxView() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await emailMessagesService.syncAndGetAll('INBOX');
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

  const openEmail = async (email) => {
    try {
      const fullEmail = await emailMessagesService.getFullMessage(email.uid || email.id, 'INBOX');
      setSelectedEmail(fullEmail && (fullEmail.html?.length > 100 || fullEmail.text?.length > 50) ? fullEmail : email);
    } catch {
      setSelectedEmail(email);
    }
  };

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  const formatDate = (dateStr) => {
    const emailDate = new Date(dateStr);
    const now = new Date();
    const diffMs = now - emailDate.getTime();
    const diffH = diffMs / (1000 * 60 * 60);
    const diffD = diffMs / (1000 * 60 * 60 * 24);

    if (diffH < 1) {
      const diffM = Math.floor(diffMs / (1000 * 60));
      return diffM < 1 ? 'Ahora' : 'Hace ' + diffM + 'm';
    }
    if (diffH < 24) return Math.floor(diffH) + 'h';
    if (diffD < 7) return Math.floor(diffD) + 'd';

    return emailDate.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: emailDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getInitials = (from) => {
    if (!from) return '?';
    const parts = from.split(' ').filter(p => !p.includes('<'));
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.substring(0, 2).toUpperCase() || '?';
  };

  const extractName = (from) => {
    const match = from?.match(/<([^>]+)>/);
    return match ? from.substring(0, from.indexOf('<')).trim() : from || '';
  };

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

  const cleanEmailText = (text) => {
    if (!text) return '';
    let cleaned = text
      .replace(/--_.*$/gm, '')
      .replace(/Content-.*$/gm, '')
      .replace(/^\s*$/gm, '')
      .trim();
    if (cleaned.length > 120) {
      cleaned = cleaned.substring(0, 120) + '...';
    }
    return cleaned;
  };

  const getTextPreview = (email) => {
    if (email.text && email.text.length > 0 && email.text !== 'Sin contenido') {
      return cleanEmailText(email.text);
    }
    if (email.html) {
      const textFromHtml = email.html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return textFromHtml.substring(0, 120);
    }
    return '';
  };

  const getAttachmentIndicators = (email) => {
    if (!email.attachments || email.attachments.length === 0) return [];
    const indicators = [];
    const hasImages = email.attachments.some(a =>
      (a.contentType || a.mimeType || '').toLowerCase().startsWith('image')
    );
    const hasPdf = email.attachments.some(a =>
      (a.contentType || a.mimeType || '').toLowerCase().includes('pdf')
    );
    const hasOther = email.attachments.some(a => {
      const mt = (a.contentType || a.mimeType || '').toLowerCase();
      return !mt.startsWith('image') && !mt.includes('pdf');
    });

    if (hasImages) indicators.push('🖼️');
    if (hasPdf) indicators.push('📄');
    if (hasOther) indicators.push('📎');

    return indicators;
  };

  const filteredEmails = searchQuery
    ? emails.filter(email => {
        const query = searchQuery.toLowerCase();
        return (
          (email.from || '').toLowerCase().includes(query) ||
          (email.subject || '').toLowerCase().includes(query) ||
          getTextPreview(email).toLowerCase().includes(query)
        );
      })
    : emails;

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
          to: selectedEmail.to,
          cc: selectedEmail.cc,
        }}
        onBack={closeEmail}
      />
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, margin: '0 auto 16px',
            border: '4px solid #F2F2F7', borderTop: '4px solid #007AFF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: '#8E8E93', fontSize: 15, margin: 0 }}>Cargando correos...</p>
          <style>{'@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }'}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <p style={{ color: '#FF3B30', fontSize: 15, fontWeight: 600 }}>{error}</p>
        <button
          onClick={handleRefresh}
          style={{
            marginTop: 16,
            backgroundColor: '#007AFF',
            border: 'none',
            borderRadius: 10,
            padding: '12px 24px',
            cursor: 'pointer',
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E5E5EA',
        backgroundColor: '#FAFAFA',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>
              📬 Bandeja de Entrada
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8E8E93' }}>
              {filteredEmails.length} correo{filteredEmails.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            style={{
              border: '1px solid #D1D1D6',
              backgroundColor: 'white',
              borderRadius: 10,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: '#007AFF',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            🔄 Actualizar
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          backgroundColor: '#F2F2F7',
          borderRadius: 10,
        }}>
          <span style={{ fontSize: 16, color: '#8E8E93' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar correos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: 14,
              outline: 'none',
              color: '#1A1A1A',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                color: '#8E8E93',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredEmails.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px' }}>
            {searchQuery ? 'No se encontraron resultados' : 'No hay correos'}
          </p>
          <p style={{ fontSize: 14, color: '#8E8E93', margin: 0 }}>
            {searchQuery ? 'Intenta con otra búsqueda' : 'Tu bandeja está vacía'}
          </p>
        </div>
      ) : (
        <div style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {filteredEmails.map((email, index) => {
            const isUnread = !email.seen;
            const senderName = extractName(email.from);
            const avatarColor = getAvatarColor(email.from);
            const attachmentIndicators = getAttachmentIndicators(email);

            return (
              <div
                key={email.id || index}
                onClick={() => openEmail(email)}
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  backgroundColor: isUnread ? '#E5F1FF' : 'white',
                  borderBottom: index < filteredEmails.length - 1 ? '1px solid #F2F2F7' : 'none',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  transition: 'background-color 0.15s',
                  borderLeft: isUnread ? '3px solid #007AFF' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F2F2F7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isUnread ? '#E5F1FF' : 'white';
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 22, flexShrink: 0,
                  backgroundColor: avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: 'white',
                }}>
                  {getInitials(email.from)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{
                      fontSize: 14,
                      fontWeight: isUnread ? 700 : 500,
                      color: '#1A1A1A',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '70%',
                    }}>
                      {senderName}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: isUnread ? '#007AFF' : '#8E8E93',
                      fontWeight: isUnread ? 600 : 400,
                      flexShrink: 0,
                      marginLeft: 8,
                    }}>
                      {formatDate(email.date)}
                    </span>
                  </div>

                  <div style={{
                    fontSize: 14,
                    fontWeight: isUnread ? 600 : 400,
                    color: isUnread ? '#000' : '#3C3C43',
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {decodeEmailSubject(email.subject) || 'Sin asunto'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {attachmentIndicators.length > 0 && (
                      <span style={{ fontSize: 14, flexShrink: 0 }}>
                        {attachmentIndicators.join(' ')}
                      </span>
                    )}
                    <span style={{
                      fontSize: 13,
                      color: '#8E8E93',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {getTextPreview(email)}
                    </span>
                  </div>

                  {isUnread && (
                    <div style={{
                      width: 10, height: 10, borderRadius: 5,
                      backgroundColor: '#007AFF',
                      flexShrink: 0,
                      alignSelf: 'center',
                      marginTop: 12,
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EmailInboxView;
