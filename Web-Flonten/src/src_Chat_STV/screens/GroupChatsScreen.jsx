/**
 * ============================================================================
 * 👥 GROUP CHATS SCREEN - Chats grupales (Web)
 * ============================================================================
 *
 * QUÉ HACE:
 * - Lista de grupos de chat
 * - Indicadores de miembros y mensajes recientes
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const GroupChatsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const groups = [
    { id: '1', name: 'Equipo de Seguridad', description: 'Turno matutino', members: 12, lastMessage: 'Todo bajo control', time: '11:00 AM', unread: 5, icon: '🛡️' },
    { id: '2', name: 'Departamento IT', description: 'Soporte técnico', members: 8, lastMessage: 'Servidor actualizado', time: '10:30 AM', unread: 2, icon: '💻' },
    { id: '3', name: 'Recursos Humanos', description: 'Comunicados RRHH', members: 5, lastMessage: 'Nueva política de vacaciones', time: 'Ayer', unread: 0, icon: '👥' },
    { id: '4', name: 'General STV', description: 'Canal general', members: 45, lastMessage: 'Bienvenidos al nuevo sistema', time: 'Lun', unread: 12, icon: '🏢' },
  ];

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#007AFF', padding: '24px 32px',
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
                Chats Grupales
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                Conversaciones en grupo
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
            type="text" placeholder="Buscar grupo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent' }}
          />
        </div>

        {/* Lista de grupos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((group) => (
            <div
              key={group.id}
              onClick={() => console.log('Abrir grupo:', group.id)}
              style={{
                backgroundColor: 'white', padding: 20, borderRadius: 16,
                border: '1px solid #D1D1D6', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14, backgroundColor: '#F2F2F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              }}>{group.icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#000' }}>{group.name}</span>
                  {group.unread > 0 && (
                    <span style={{
                      backgroundColor: '#007AFF', color: 'white',
                      padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                    }}>{group.unread}</span>
                  )}
                </div>
                <div style={{ fontSize: 14, color: '#8E8E93', marginBottom: 4 }}>
                  {group.description} · {group.members} miembros
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#3C3C43' }}>{group.lastMessage}</span>
                  <span style={{ fontSize: 12, color: '#8E8E93' }}>{group.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
