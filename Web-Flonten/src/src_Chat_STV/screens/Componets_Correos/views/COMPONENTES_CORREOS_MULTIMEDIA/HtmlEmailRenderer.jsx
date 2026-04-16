/**
 * ============================================================================
 * 📧 HTML EMAIL RENDERER - Renderizador de correos HTML (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/.../HtmlEmailRenderer.tsx
 *
 * QUÉ HACE:
 * - Renderiza contenido HTML de correos electrónicos
 * - Si no hay HTML, muestra texto plano formateado
 * - Aplica estilos profesionales tipo Gmail/Outlook
 *
 * ============================================================================
 */
import React, { useState, useEffect, useRef } from 'react';

export function HtmlEmailRenderer({ html, text }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (containerRef.current) {
      setIsLoading(false);
    }
  }, []);

  if ((!html || html.trim() === '') && (!text || text.trim() === '')) {
    return (
      <div style={{
        padding: 16,
        textAlign: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        margin: 8,
      }}>
        <span style={{ fontSize: 24 }}>📭</span>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: '#8E8E93' }}>
          Este correo no tiene contenido visible
        </p>
      </div>
    );
  }

  if (!html || html.trim() === '') {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 8,
        padding: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <p style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: '#1A1A1A',
          whiteSpace: 'pre-wrap',
          margin: 0,
        }}>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <div
        ref={containerRef}
        style={{
          padding: 16,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
          color: '#1a1a1a',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default HtmlEmailRenderer;
