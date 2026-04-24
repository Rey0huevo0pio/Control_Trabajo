/**
 * ============================================================================
 * 💬 PRIVATE CHATS SCREEN - Chats privados (Web)
 * ============================================================================
 *
 * QUÉ HACE:
 * - Lista de conversaciones privadas
 * - Búsqueda de chats
 * - Indicadores de mensajes no leídos
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PrivateChatsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const privateChats = [
    { id: '1', name: 'Juan Perez', lastMessage: 'Revisé el reporte, todo bien', time: '10:30 AM', unread: 2, online: true, avatar: '👤' },
    { id: '2', name: 'Maria Garcia', lastMessage: '¿Puedes enviarme el archivo?', time: '9:15 AM', unread: 1, online: true, avatar: '👩' },
    { id: '3', name: 'Carlos Lopez', lastMessage: 'Listo, ya terminé la tarea', time: 'Ayer', unread: 0, online: false, avatar: '👨' },
    { id: '4', name: 'Ana Martinez', lastMessage: 'Gracias por la información', time: 'Ayer', unread: 0, online: false, avatar: '👩‍💼' },
    { id: '5', name: 'Pedro Sanchez', lastMessage: 'Nos vemos mañana en la reunión', time: 'Lun', unread: 3, online: true, avatar: '👨‍💻' },
  ];

  const filtered = privateChats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Mensajería Privada
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                Chats individuales
              </p>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div style={{
          backgroundColor: 'white', padding: '12px 16px', borderRadius: 14,
          marginBottom: 16, border: '1px solid #D1D1D6',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: '#8E8E93' }}>🔍</span>
          <input
            type="text" placeholder="Buscar contacto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
          />
        </div>

        {/* Lista de chats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((chat) => (
            <div
              key={chat.id}
              onClick={() => console.log('Abrir chat:', chat.id)}
              style={{
                backgroundColor: 'white', padding: 16, borderRadius: 14,
                border: '1px solid #D1D1D6', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 26, backgroundColor: '#F2F2F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>{chat.avatar}</div>
                {chat.online && (
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 14, height: 14, borderRadius: 7, backgroundColor: '#34C759',
                    border: '2px solid white',
                  }} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>{chat.name}</span>
                  <span style={{ fontSize: 12, color: '#8E8E93' }}>{chat.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: '#3C3C43', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                    {chat.lastMessage}
                  </span>
                  {chat.unread > 0 && (
                    <span style={{
                      backgroundColor: '#5856D6', color: 'white',
                      padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                    }}>{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
