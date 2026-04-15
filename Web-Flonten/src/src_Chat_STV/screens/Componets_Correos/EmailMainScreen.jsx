/**
 * ============================================================================
 * 📧 EMAIL MAIN SCREEN - Correo electrónico profesional (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/EmailMainScreen.tsx
 *
 * MEJORAS:
 * - Layout tipo Gmail/Outlook con sidebar fijo
 * - Header limpio con búsqueda
 * - Contenido principal con mejor espaciado
 * - Sidebar colapsable con animación
 *
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailInboxView } from './views/EmailInboxView';
import { ComposeEmailView } from './views/ComposeEmailView';
import { EmailSidebar } from './sidebar/EmailSidebar';

export const EmailMainScreen = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('inbox');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <EmailInboxView />;
      case 'compose':
        return (
          <ComposeEmailView
            onBack={() => setCurrentView('inbox')}
            onSuccess={() => setCurrentView('inbox')}
          />
        );
      default:
        return <EmailInboxView />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ==========================================
          HEADER GLOBAL (Tipo Gmail)
      ========================================== */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E5EA',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        {/* Izquierda: Logo + Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/chat')}
            style={{
              width: 36, height: 36, borderRadius: 18, border: '1px solid #D1D1D6',
              backgroundColor: 'white', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            ←
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              📧
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>
                Correo STV
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: '#8E8E93' }}>
                Bandeja empresarial
              </p>
            </div>
          </div>
        </div>

        {/* Derecha: Acciones */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setCurrentView('compose')}
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              border: 'none',
              borderRadius: 12,
              padding: '10px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,122,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,122,255,0.3)';
            }}
          >
            <span style={{ fontSize: 16 }}>✏️</span>
            <span>Redactar</span>
          </button>
          <button
            onClick={() => setCurrentView('inbox')}
            style={{
              width: 40, height: 40, borderRadius: 10, border: '1px solid #D1D1D6',
              backgroundColor: 'white', cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            title="Actualizar bandeja"
          >
            🔄
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: 40, height: 40, borderRadius: 10, border: '1px solid #D1D1D6',
              backgroundColor: sidebarOpen ? '#F2F2F7' : 'white',
              cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ==========================================
          CONTENIDO PRINCIPAL (Layout tipo Gmail)
      ========================================== */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 0,
        padding: 16,
        maxWidth: 1600,
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: 240,
            flexShrink: 0,
            marginRight: 16,
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              position: 'sticky',
              top: 80,
            }}>
              <EmailSidebar
                currentView={currentView}
                onViewChange={(view) => setCurrentView(view)}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Vista seleccionada */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default EmailMainScreen;
