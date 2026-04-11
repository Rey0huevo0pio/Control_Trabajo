/**
 * ============================================================================
 * 💬 CHAT HOME SCREEN - Hub de Mensajería (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/ChatHomeScreen.tsx
 *
 * QUÉ HACE:
 * - Hub principal del módulo Chat
 * - Accesos a: Mensajería Privada, Grupal, Correo, Directorio, Noticias
 * - Búsqueda rápida
 *
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src_Chat_STV/screens/ChatHomeScreen.tsx
 * - Navigation: Navega a PrivateChats, GroupChats, EmailMain, etc.
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const ChatHomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const mainOptions = [
    {
      id: 'private',
      title: 'Mensajería Privada',
      description: 'Chats individuales',
      icon: '💬',
      color: '#5856D6',
      badge: 3,
      route: '/chat/private',
    },
    {
      id: 'group',
      title: 'Mensajería Grupal',
      description: 'Chats en grupo',
      icon: '👥',
      color: '#007AFF',
      badge: 1,
      route: '/chat/groups',
    },
    {
      id: 'email',
      title: 'Correo Electrónico',
      description: 'Outlook Web',
      icon: '📧',
      color: '#34C759',
      badge: 5,
      route: '/chat/email',
    },
    {
      id: 'employees',
      title: 'Directorio de Empleados',
      description: 'Todos los empleados',
      icon: '📋',
      color: '#FF9500',
      route: '/chat/directorio',
    },
    {
      id: 'news',
      title: 'Noticias y Carteles',
      description: 'Información general',
      icon: '📰',
      color: '#FF3B30',
      badge: 2,
      route: '/chat/noticias',
    },
  ];

  const quickActions = [
    { icon: '➕', label: 'Nuevo Chat', action: () => navigate('/chat/private') },
    { icon: '🔍', label: 'Buscar', action: () => navigate('/chat/buscar') },
    { icon: '👤', label: 'Mi Perfil', action: () => console.log('Mi perfil') },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Header Premium */}
        <div
          style={{
            background: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
            padding: '32px',
            borderRadius: 20,
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1 }}>
            <span style={{ fontSize: 200 }}>💬</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'white' }}>
                  Chat STV
                </h2>
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'white',
                }}>
                  MENSAJERÍA
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>
                Sistema de comunicación empresarial
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                width: 44, height: 44, borderRadius: 22,
                border: '2px solid rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                cursor: 'pointer', fontSize: 20, color: 'white',
              }}
            >
              ←
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: 16,
          marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, color: '#8E8E93' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar conversaciones, contactos, noticias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: 15, background: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none', backgroundColor: 'transparent',
                  cursor: 'pointer', fontSize: 20, color: '#8E8E93',
                }}
              >✕</button>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
          border: '1px solid #D1D1D6',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>
            Acciones Rápidas
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {quickActions.map((action) => (
              <div key={action.label} style={{ textAlign: 'center' }}>
                <div
                  onClick={action.action}
                  style={{
                    width: 56, height: 56, borderRadius: 14,
                    backgroundColor: '#F2F2F7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, cursor: 'pointer', marginBottom: 8,
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {action.icon}
                </div>
                <span style={{ fontSize: 13, color: '#3C3C43', fontWeight: 600 }}>
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Opciones principales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>
            Secciones
          </h3>
          {mainOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => navigate(option.route)}
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 16,
                border: '1px solid #D1D1D6',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.95';
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                backgroundColor: `${option.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>
                {option.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: '#000' }}>
                    {option.title}
                  </span>
                  {option.badge && (
                    <span style={{
                      backgroundColor: option.color,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 14, color: '#8E8E93' }}>
                  {option.description}
                </span>
              </div>

              <span style={{ fontSize: 24, color: '#C7C7CC' }}>▶</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 13, color: '#C7C7CC' }}>
            Chat STV v1.0 - Sistema de Comunicación
          </div>
        </div>
      </div>
    </div>
  );
};
