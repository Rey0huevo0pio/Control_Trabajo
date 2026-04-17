/**
 * ============================================================================
 * 📧 HTML EMAIL RENDERER - Visor completo de contenido HTML
 * 
 * Usa iframe aislado para evitar conflictos con CSS de Tamagui
 * ============================================================================
 */
import React, { useRef } from 'react';

export function HtmlEmailRenderer({ html, text }) {
  const iframeRef = useRef(null);

  // DEBUG: Ver qué llega exactamente al renderer
  console.log('[HtmlEmailRenderer] 🔍 Renderizando:', {
    htmlLength: html?.length,
    htmlStart: html?.substring(0, 200),
    textLength: text?.length,
  });

  if ((!html || html.trim() === '') && (!text || text.trim() === '')) {
    return (
      <div style={{
        padding: 16,
        textAlign: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
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
        padding: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <pre style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: '#1A1A1A',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
          fontFamily: 'inherit',
        }}>
          {text}
        </pre>
      </div>
    );
  }

  // Preparar HTML con estilos isolatesos para el iframe
  const srcdoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { 
          box-sizing: border-box; 
          max-width: 100% !important;
        }
        html, body {
          margin: 0;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #1a1a1a;
          background: white;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          padding: 8px;
          border: 1px solid #e0e0e0;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        a { color: #007AFF; }
        p { margin: 8px 0; }
        div { display: block !important; }
        span { display: inline !important; }
        .gmail_quote, .quote, blockquote {
          display: block;
          border-left: 3px solid #e0e0e0;
          padding-left: 16px;
          margin: 12px 0;
          color: #666;
        }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      minHeight: '300px',
      width: '100%',
    }}>
      <iframe
        ref={iframeRef}
        srcDoc={srcdoc}
        title="Email content"
        style={{
          width: '100%',
          minHeight: '300px',
          border: 'none',
          backgroundColor: 'white',
        }}
        sandbox="allow-same-origin"
      />
    </div>
  );
}

export default HtmlEmailRenderer;