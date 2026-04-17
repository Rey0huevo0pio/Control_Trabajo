/**
 * ============================================================================
 * 📧 HTML EMAIL RENDERER - Visor completo de contenido HTML
 * ============================================================================
 */
import React, { useRef, useEffect } from 'react';

export function HtmlEmailRenderer({ html, text }) {
  const containerRef = useRef(null);

  // DEBUG: Ver qué llega exactamente al renderer
  console.log('[HtmlEmailRenderer] 🔍 Renderizando:', {
    htmlLength: html?.length,
    htmlStart: html?.substring(0, 500),
    textLength: text?.length,
  });

  useEffect(() => {
    if (containerRef.current && html) {
      // Aplicar estilos a los elementos dentro del contenedor
      const container = containerRef.current;
      const tables = container.querySelectorAll('table');
      tables.forEach(table => {
        table.style.maxWidth = '100%';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
      });
      
      const imgs = container.querySelectorAll('img');
      imgs.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      });
    }
  }, [html]);

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

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 12,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflowX: 'auto',
      minHeight: '200px',
    }}>
      <div
        ref={containerRef}
        className="email-html-content"
        style={{
          padding: 16,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
          color: '#1a1a1a',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          minWidth: '100%',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{`
        .email-html-content {
          display: block !important;
          visibility: visible !important;
        }
        .email-html-content * {
          max-width: 100% !important;
          word-break: break-word !important;
        }
        .email-html-content table {
          max-width: 100% !important;
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 12px 0 !important;
        }
        .email-html-content table td, 
        .email-html-content table th {
          padding: 8px !important;
          border: 1px solid #e0e0e0 !important;
          word-break: break-word !important;
        }
        .email-html-content img {
          max-width: 100% !important;
          height: auto !important;
        }
        .email-html-content a {
          color: #007AFF !important;
        }
        .email-html-content blockquote, .email-html-content .gmail_quote, .email-html-content .quote {
          display: block !important;
          border-left: 3px solid #e0e0e0 !important;
          padding-left: 16px !important;
          margin: 12px 0 !important;
          color: #666 !important;
          visibility: visible !important;
        }
        .email-html-content p {
          margin: 8px 0 !important;
        }
        .email-html-content div {
          display: block !important;
          visibility: visible !important;
        }
        .email-html-content ul, .email-html-content ol {
          padding-left: 24px !important;
          margin: 8px 0 !important;
        }
        .email-html-content span {
          display: inline !important;
        }
      `}</style>
    </div>
  );
}

export default HtmlEmailRenderer;
