/**
 * ============================================================================
 * 🔍 CHAT SEARCH SCREEN - Búsqueda de chats (Web)
 * ============================================================================
 *
 * QUÉ HACE:
 * - Búsqueda global en mensajes, contactos, grupos y noticias
 * - Resultados categorizados
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChatSearchScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const mockResults = {
    contacts: [
      { id: '1', name: 'Juan Perez', role: 'Vigilante', avatar: '👤' },
      { id: '2', name: 'Maria Garcia', role: 'Supervisora', avatar: '👩' },
    ],
    groups: [
      { id: '1', name: 'Equipo de Seguridad', members: 12, icon: '🛡️' },
      { id: '2', name: 'Departamento IT', members: 8, icon: '💻' },
    ],
    messages: [
      { id: '1', from: 'Juan Perez', text: 'El reporte está listo para revisión', time: '10:30 AM', chat: 'Chat con Juan' },
      { id: '2', from: 'Maria Garcia', text: '¿Puedes enviarme el archivo del reporte?', time: '9:15 AM', chat: 'Chat con Maria' },
    ],
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#5856D6', padding: '24px 32px',
          borderRadius: 20, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/chat')} style={{
              width: 40, height: 40, borderRadius: 20, border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              fontSize: 18, color: 'white',
            }}>←</button>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>
                Búsqueda
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                Busca en mensajes, contactos y grupos
              </p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div style={{
          backgroundColor: 'white', padding: 16, borderRadius: 16,
          marginBottom: 20, border: '1px solid #D1D1D6',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24, color: '#8E8E93' }}>🔍</span>
          <input
            type="text"
            placeholder="Escribe para buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 17, background: 'transparent' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
              fontSize: 20, color: '#8E8E93',
            }}>✕</button>
          )}
        </div>

        {/* Resultados */}
        {searchQuery && (
          <div>
            {/* Contactos */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: '#3C3C43' }}>
                Contactos ({mockResults.contacts.length})
              </h3>
              {mockResults.contacts.map((c) => (
                <div key={c.id} style={{
                  backgroundColor: 'white', padding: 16, borderRadius: 14,
                  marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
                  border: '1px solid #D1D1D6',
                }}>
                  <span style={{ fontSize: 28 }}>{c.avatar}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: '#8E8E93' }}>{c.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grupos */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: '#3C3C43' }}>
                Grupos ({mockResults.groups.length})
              </h3>
              {mockResults.groups.map((g) => (
                <div key={g.id} style={{
                  backgroundColor: 'white', padding: 16, borderRadius: 14,
                  marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12,
                  border: '1px solid #D1D1D6',
                }}>
                  <span style={{ fontSize: 28 }}>{g.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{g.name}</div>
                    <div style={{ fontSize: 13, color: '#8E8E93' }}>{g.members} miembros</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensajes */}
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: '#3C3C43' }}>
                Mensajes ({mockResults.messages.length})
              </h3>
              {mockResults.messages.map((m) => (
                <div key={m.id} style={{
                  backgroundColor: 'white', padding: 16, borderRadius: 14,
                  marginBottom: 8, border: '1px solid #D1D1D6',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{m.from}</span>
                    <span style={{ fontSize: 12, color: '#8E8E93' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#3C3C43', marginBottom: 4 }}>{m.text}</div>
                  <div style={{ fontSize: 12, color: '#8E8E93' }}>En: {m.chat}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8E8E93' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
              Busca en todo el sistema de comunicación
            </div>
            <div style={{ fontSize: 14 }}>
              Encuentra mensajes, contactos, grupos y más
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
