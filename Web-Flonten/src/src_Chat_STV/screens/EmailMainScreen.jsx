/**
 * ============================================================================
 * 📧 EMAIL MAIN SCREEN - Correo electrónico (Web)
 * ============================================================================
 *
 * QUÉ HACE:
 * - Bandeja de entrada principal del correo
 * - Vista tipo Outlook Web
 * - Acciones: Redactar, Bandeja de entrada, Enviados, Borradores
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EmailMainScreen = () => {
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState('inbox');

  const emails = [
    { id: '1', from: 'Carlos Lopez', subject: 'Servidor actualizado exitosamente', preview: 'El mantenimiento del servidor principal se completó sin problemas. Todos los servicios están operativos...', time: '10:45 AM', unread: true, hasAttachment: false },
    { id: '2', from: 'Ana Martinez', subject: 'Nueva política de vacaciones 2026', preview: 'Adjunto encontrarás la nueva política de vacaciones actualizada. Por favor revisa los cambios importantes...', time: '9:30 AM', unread: true, hasAttachment: true },
    { id: '3', from: 'Sistema de Tickets', subject: 'Ticket #TK-005 asignado', preview: 'Se te ha asignado el ticket TK-005: "Error en conexión de red en Oficina Central"...', time: '8:15 AM', unread: false, hasAttachment: false },
    { id: '4', from: 'Pedro Sanchez', subject: 'Reunión de planificación mensual', preview: 'Te invito a la reunión de planificación del próximo mes. Se discutirán los objetivos y metas...', time: 'Ayer', unread: false, hasAttachment: true },
    { id: '5', from: 'Laura Diaz', subject: 'Reporte de incidencias semanal', preview: 'Comparto el reporte de incidencias de la semana. Se registraron 15 tickets, todos resueltos...', time: 'Ayer', unread: false, hasAttachment: false },
  ];

  const folders = [
    { id: 'inbox', name: 'Bandeja de entrada', icon: '📥', count: 2 },
    { id: 'sent', name: 'Enviados', icon: '📤', count: 0 },
    { id: 'drafts', name: 'Borradores', icon: '📝', count: 1 },
    { id: 'archive', name: 'Archivados', icon: '📦', count: 0 },
    { id: 'trash', name: 'Papelera', icon: '🗑️', count: 0 },
  ];

  const filtered = emails.filter(e => {
    if (selectedFolder === 'inbox') return true;
    if (selectedFolder === 'sent') return false;
    if (selectedFolder === 'drafts') return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#34C759', padding: '24px 32px',
          borderRadius: 20, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/chat')} style={{
              width: 40, height: 40, borderRadius: 20, border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              fontSize: 18, color: 'white',
            }}>←</button>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>
                Correo Electrónico
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                Outlook Web - user@stv.com
              </p>
            </div>
            <button style={{
              backgroundColor: 'white', border: 'none', borderRadius: 12,
              padding: '10px 20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>✏️</span>
              <span style={{ color: '#34C759', fontSize: 14, fontWeight: 700 }}>Redactar</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {/* Sidebar de carpetas */}
          <div style={{ width: 240, flexShrink: 0 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #D1D1D6', overflow: 'hidden' }}>
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  style={{
                    padding: '14px 16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: selectedFolder === folder.id ? '#F2F2F7' : 'white',
                    borderBottom: '1px solid #F2F2F7',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{folder.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#3C3C43' }}>
                      {folder.name}
                    </span>
                  </div>
                  {folder.count > 0 && (
                    <span style={{
                      backgroundColor: '#34C759', color: 'white',
                      padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                    }}>{folder.count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lista de emails */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: 'white', borderRadius: 16, border: '1px solid #D1D1D6',
              overflow: 'hidden',
            }}>
              {/* Header de la bandeja */}
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #F2F2F7',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 17, fontWeight: 700 }}>
                  {folders.find(f => f.id === selectedFolder)?.name}
                </span>
                <span style={{ fontSize: 13, color: '#8E8E93' }}>
                  {filtered.length} mensajes
                </span>
              </div>

              {/* Emails */}
              {filtered.map((email) => (
                <div
                  key={email.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #F2F2F7',
                    cursor: 'pointer',
                    backgroundColor: email.unread ? '#F8F9FF' : 'white',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = email.unread ? '#F8F9FF' : 'white'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{
                      fontSize: 15, fontWeight: email.unread ? 700 : 500, color: '#000',
                    }}>
                      {email.from}
                    </span>
                    <span style={{ fontSize: 12, color: '#8E8E93' }}>{email.time}</span>
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: email.unread ? 600 : 400,
                    color: '#3C3C43', marginBottom: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {email.subject}
                    {email.hasAttachment && <span style={{ marginLeft: 8, fontSize: 12 }}>📎</span>}
                  </div>
                  <div style={{
                    fontSize: 13, color: '#8E8E93',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {email.preview}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div style={{ padding: 60, textAlign: 'center', color: '#8E8E93' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>No hay mensajes</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
