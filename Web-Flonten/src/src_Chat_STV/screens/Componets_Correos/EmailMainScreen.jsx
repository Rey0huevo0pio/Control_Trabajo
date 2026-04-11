/**
 * ============================================================================
 * 📧 EMAIL MAIN SCREEN - Correo electrónico con vistas (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/EmailMainScreen.tsx
 *
 * QUÉ HACE:
 * - Pantalla principal del correo con sidebar y vistas
 * - Alterna entre bandeja de entrada y redactar
 * - Sidebar colapsable
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
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #34C759 0%, #28A745 100%)',
          padding: '20px 24px',
          borderRadius: 20,
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -40, opacity: 0.1 }}>
            <span style={{ fontSize: 200 }}>📧</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => navigate('/chat')} style={{
                width: 40, height: 40, borderRadius: 20, border: 'none',
                backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
                fontSize: 18, color: 'white',
              }}>←</button>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>
                  Correo STV
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                  Bandeja de entrada empresarial
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setCurrentView('compose')}
                style={{
                  backgroundColor: 'white', border: 'none', borderRadius: 12,
                  padding: '8px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>✏️</span>
                <span style={{ color: '#34C759', fontSize: 14, fontWeight: 700 }}>Redactar</span>
              </button>
              <button
                onClick={() => setCurrentView('inbox')}
                style={{
                  width: 40, height: 40, borderRadius: 20, border: 'none',
                  backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
                  fontSize: 18, color: 'white',
                }}
              >🔄</button>
            </div>
          </div>
        </div>

        {/* Contenido Principal con Sidebar */}
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Sidebar */}
          {sidebarOpen && (
            <EmailSidebar
              currentView={currentView}
              onViewChange={(view) => setCurrentView(view)}
              onClose={() => setSidebarOpen(false)}
            />
          )}

          {/* Vista seleccionada */}
          <div style={{ flex: 1 }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  backgroundColor: 'white', border: '1px solid #D1D1D6', borderRadius: 10,
                  padding: '6px 12px', cursor: 'pointer', marginBottom: 12,
                  fontSize: 14, color: '#3C3C43',
                }}
              >☰ Menú</button>
            )}
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};
