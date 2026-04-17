/**
 * ============================================================================
 * 📧 HTML EMAIL RENDERER - Visor completo de contenido HTML
 * 
 * Usa iframe aislado para evitar conflictos con CSS de Tamagui
 * ============================================================================
 */
import React, { useMemo } from 'react';

export function HtmlEmailRenderer({ html, text }) {
  // DEBUG: Ver qué llega exactamente al renderer
  console.log('[HtmlEmailRenderer] 🔍 Renderizando:', {
    htmlLength: html?.length,
    htmlStart: html?.substring(0, 200),
    textLength: text?.length,
  });

  // Crear Blob URL
  const blobUrl = useMemo(() => {
    if (!html || html.trim() === '') return null;
    
    // Usar el HTML original tal cual
    const finalContent = html.trim();
    
    console.log('[HtmlEmailRenderer] 🔍 blobUrl - creating with length:', finalContent.length);
    
    // Usar el HTML originales sin wrapper extra
    const htmlContent = finalContent;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    console.log('[HtmlEmailRenderer] 🔍 blobUrl - created:', url.substring(0, 50));
    return url;
  }, [html]);

  const textBlobUrl = useMemo(() => {
    if (html && html.trim() !== '') return null;
    
    const textContent = text || '';
    const textAsHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; max-width: 100% !important; }
          html, body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a; background: white; }
          pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; }
        </style>
      </head>
      <body>
        <pre>${textContent}</pre>
      </body>
      </html>
    `;
    const blob = new Blob([textAsHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [html, text]);

  const iframeStyle = {
    width: '100%',
    height: '500px',
    border: 'none',
    backgroundColor: 'white',
  };

  const containerStyle = {
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minHeight: '500px',
    width: '100%',
    overflow: 'auto',
  };

  const emptyStyle = {
    padding: 16,
    textAlign: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  };

  // Determinar qué contenido mostrar
  const hasHtml = html && html.trim() !== '';
  const hasText = text && text.trim() !== '';

  // Caso 1: Sin contenido
  if (!hasHtml && !hasText) {
    return (
      <div style={emptyStyle}>
        <span style={{ fontSize: 24 }}>📭</span>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: '#8E8E93' }}>
          Este correo no tiene contenido visible
        </p>
      </div>
    );
  }

  // Caso 2: Solo texto (sin HTML)
  if (!hasHtml) {
    return (
      <div style={containerStyle}>
        <iframe
          src={textBlobUrl}
          title="Email content"
          style={iframeStyle}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    );
  }

  // Caso 3: Con HTML - mostrar en iframe
  return (
    <div style={containerStyle}>
      <iframe
        src={blobUrl}
        title="Email content"
        style={iframeStyle}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}

export default HtmlEmailRenderer;