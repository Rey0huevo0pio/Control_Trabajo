/**
 * ============================================================================
 * ✏️ COMPOSE EMAIL VIEW - Redactar correo (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/views/ComposeEmailView.tsx
 *
 * ============================================================================
 */
import React, { useState } from 'react';

export function ComposeEmailView({ onBack, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSend = async () => {
    setError(null);
    setSuccess(null);

    if (!to) { setError('El destinatario es obligatorio'); return; }
    if (!emailSubject) { setError('El asunto es obligatorio'); return; }
    if (!message) { setError('El mensaje no puede estar vacío'); return; }

    setLoading(true);
    // Simular envío (luego vendrá de la API)
    setTimeout(() => {
      setSuccess('✅ Correo enviado correctamente');
      setTimeout(() => onSuccess(), 1500);
      setLoading(false);
    }, 1000);
  };

  const inputStyle = {
    width: '100%', padding: 12, borderRadius: 12,
    border: '1px solid #D1D1D6', fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
    backgroundColor: '#F9F9F9',
  };

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 14, fontWeight: 600, color: '#3C3C43', marginBottom: 6,
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: 16, border: '1px solid #D1D1D6' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#007AFF', padding: '16px 20px',
        borderRadius: '16px 16px 0 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={onBack} style={{
          border: 'none', backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 18, width: 36, height: 36, cursor: 'pointer',
          fontSize: 16, color: 'white',
        }}>←</button>
        <span style={{ color: 'white', fontSize: 17, fontWeight: 700 }}>✉️ Redactar Correo</span>
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            border: 'none', backgroundColor: loading ? '#99C9FF' : 'white',
            borderRadius: 10, padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer',
            color: '#007AFF', fontSize: 14, fontWeight: 700,
          }}
        >
          {loading ? 'Enviando...' : '📤 Enviar'}
        </button>
      </div>

      {/* Errores / Éxito */}
      {error && (
        <div style={{
          backgroundColor: '#FFE5E3', border: '1px solid #FF3B30',
          borderRadius: 10, padding: 12, margin: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>⚠️</span><span style={{ color: '#FF3B30', fontSize: 14 }}>{error}</span>
        </div>
      )}
      {success && (
        <div style={{
          backgroundColor: '#E3F9E8', border: '1px solid #34C759',
          borderRadius: 10, padding: 12, margin: 16,
        }}>
          <span style={{ color: '#34C759', fontSize: 14, fontWeight: 600 }}>{success}</span>
        </div>
      )}

      {/* Campos */}
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={labelStyle}>📧 Para *</div>
          <input
            type="email" placeholder="destinatario@email.com"
            value={to} onChange={(e) => setTo(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>📋 CC (opcional)</div>
          <input
            type="email" placeholder="copia@email.com"
            value={cc} onChange={(e) => setCc(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>📝 Asunto *</div>
          <input
            type="text" placeholder="Asunto del correo"
            value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>💬 Mensaje *</div>
          <textarea
            placeholder="Escribe tu mensaje aquí..."
            value={message} onChange={(e) => setMessage(e.target.value)}
            rows={8}
            style={{ ...inputStyle, minHeight: 200, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#99C9FF' : '#007AFF',
            border: 'none', borderRadius: 12, padding: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16, fontWeight: 700, color: 'white',
          }}
        >
          {loading ? '⏳ Enviando...' : '📤 Enviar Correo'}
        </button>
      </div>
    </div>
  );
}
