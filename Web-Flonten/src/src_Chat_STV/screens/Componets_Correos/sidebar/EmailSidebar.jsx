/**
 * ============================================================================
 * 📧 EMAIL SIDEBAR - Menú lateral del correo (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/sidebar/EmailSidebar.tsx
 *
 * ============================================================================
 */
import React from 'react';

const menuItems = [
  { id: 'inbox', title: 'Bandeja de Entrada', icon: '📥', color: '#007AFF' },
  { id: 'compose', title: 'Redactar Correo', icon: '✏️', color: '#34C759' },
];

export function EmailSidebar({ currentView, onViewChange, onClose }) {
  return (
    <div style={{
      width: 260, flexShrink: 0,
      backgroundColor: 'white', borderRadius: 16,
      border: '1px solid #D1D1D6', padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#000' }}>Correo</span>
        <button onClick={onClose} style={{
          border: 'none', backgroundColor: 'transparent',
          cursor: 'pointer', fontSize: 18, color: '#8E8E93',
        }}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              padding: 12,
              borderRadius: 12,
              cursor: 'pointer',
              backgroundColor: currentView === item.id ? `${item.color}15` : 'transparent',
              border: currentView === item.id ? `1px solid ${item.color}` : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: 15,
              fontWeight: currentView === item.id ? 700 : 500,
              color: '#3C3C43',
            }}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
