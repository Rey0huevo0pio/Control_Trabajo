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
import React, { useState } from 'react';

export function HtmlEmailRenderer({ html, text }) {
  const [isLoading, setIsLoading] = useState(true);

  // Si no hay HTML ni texto, mostrar mensaje vacío
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

  // Si solo hay texto plano, formatearlo bonitamente
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

  // HTML completo con estilos profesionales
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #1a1a1a;
          background-color: transparent;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .email-content {
          padding: 16px;
          background: white;
          border-radius: 12px;
          margin: 8px 0;
          max-width: 100% !important;
        }

        img {
          max-width: 100% !important;
          height: auto !important;
          display: block;
          margin: 12px 0;
          border-radius: 8px;
        }

        table {
          max-width: 100% !important;
          border-collapse: collapse;
          margin: 8px 0;
        }

        td, th {
          padding: 8px;
          vertical-align: top;
          word-wrap: break-word;
        }

        a {
          color: #007AFF;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        blockquote {
          border-left: 3px solid #e0e0e0;
          padding-left: 16px;
          margin: 16px 0;
          color: #666;
        }

        pre, code {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
          font-size: 13px;
          overflow-x: auto;
          margin: 12px 0;
        }

        h1, h2, h3, h4, h5, h6 {
          margin: 20px 0 12px 0;
          font-weight: 600;
          line-height: 1.3;
        }

        p {
          margin: 12px 0;
        }

        hr {
          border: none;
          border-top: 1px solid #e0e0e0;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-content">
        ${html}
      </div>
    </body>
    </html>
  `;

  return (
    <div style={{
      backgroundColor: '#F2F2F7',
      borderRadius: 12,
      margin: 8,
      overflow: 'hidden',
    }}>
      {isLoading && (
        <div style={{
          padding: 16,
          textAlign: 'center',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 24,
            height: 24,
            border: '3px solid #F2F2F7',
            borderTop: '3px solid #007AFF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#8E8E93' }}>
            Cargando correo...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <div
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        onLoad={() => {
          setIsLoading(false);
          console.log('✅ [HtmlEmailRenderer] HTML loaded successfully');
        }}
      />
    </div>
  );
}

export default HtmlEmailRenderer;
