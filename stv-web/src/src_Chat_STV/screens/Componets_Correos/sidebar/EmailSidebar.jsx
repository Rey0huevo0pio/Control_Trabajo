/**
 * ============================================================================
 * 📧 EMAIL SIDEBAR - Menú lateral del correo (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/sidebar/EmailSidebar.tsx
 *
 * QUÉ HACE:
 * - Menú lateral con navegación del correo
 * - Items con iconos y estados activos
 * - Diseño limpio tipo Gmail
 *
 * ============================================================================
 */
import React from 'react';

const menuItems = [
  { id: 'inbox', title: 'Bandeja de Entrada', icon: '📥', color: '#007AFF', description: 'Correos recibidos' },
  { id: 'compose', title: 'Redactar Correo', icon: '✏️', color: '#34C759', description: 'Nuevo mensaje' },
];

export function EmailSidebar({ currentView, onViewChange, onClose }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 16,
      border: '1px solid #E5E5EA',
      padding: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottom: '1px solid #F2F2F7',
      }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
          Menú
        </h3>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: 14,
            border: 'none',
            backgroundColor: '#F2F2F7',
            cursor: 'pointer',
            fontSize: 14,
            color: '#8E8E93',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E5EA'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2F2F7'}
        >
          ✕
        </button>
      </div>

      {/* Items de menú */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                cursor: 'pointer',
                backgroundColor: isActive ? `${item.color}10` : 'transparent',
                border: isActive ? `2px solid ${item.color}30` : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#F2F2F7';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {/* Icono */}
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                backgroundColor: isActive ? item.color : '#F2F2F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
                transition: 'all 0.2s',
              }}>
                <span role="img" aria-label={item.title}>{item.icon}</span>
              </div>

              {/* Texto */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? item.color : '#1A1A1A',
                  marginBottom: 2,
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#8E8E93',
                }}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmailSidebar;
