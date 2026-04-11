/**
 * ============================================================================
 * 📄 HTML EMAIL RENDERER - Renderiza HTML de correos (Web)
 * ============================================================================
 *
 * ADAPTADO DE: C_Ticket_Apk_STV/src_Chat_STV/screens/Componets_Correos/views/COMPONENTES_CORREOS_MULTIMEDIA/HtmlEmailRenderer.tsx
 *
 * ============================================================================
 */
import React from 'react';

export function HtmlEmailRenderer({ html, text }) {
  if (html && html.length > 0) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: '#3C3C43',
        }}
      />
    );
  }

  if (text && text.length > 0 && text !== 'Sin contenido') {
    return (
      <div style={{
        fontSize: 15,
        lineHeight: 1.6,
        color: '#3C3C43',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {text}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: 20, color: '#8E8E93' }}>
      <p>Sin contenido disponible</p>
    </div>
  );
}
