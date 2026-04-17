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

  // Limpiar contenido HTML eliminando etiquetas conflictivas
  const cleanHtmlContent = (content) => {
    if (!content) return '';
    let cleaned = content;
    
    console.log('[HtmlEmailRenderer] 🔍 cleanHtmlContent - input length:', cleaned.length);
    console.log('[HtmlEmailRenderer] 🔍 cleanHtmlContent - input start:', cleaned.substring(0, 500));
    
    // Verificar si es un HTML completo con tags html/body
    const hasHtmlTag = /<html[^>]*>/i.test(cleaned);
    const hasBodyTag = /<body[^>]*>/i.test(cleaned);
    
    console.log('[HtmlEmailRenderer] 🔍 hasHtmlTag:', hasHtmlTag, 'hasBodyTag:', hasBodyTag);
    
    if (hasHtmlTag && hasBodyTag) {
      // Solo extraer el body si ambos existen
      const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1].trim().length > 0) {
        cleaned = bodyMatch[1];
        console.log('[HtmlEmailRenderer] 🔍 After extracting body - length:', cleaned.length);
      } else {
        console.log('[HtmlEmailRenderer] 🔍 Body empty or not found, keeping original');
      }
    }
    // Si no tiene tags html/body, mantener el contenido como está
    
    console.log('[HtmlEmailRenderer] 🔍 Final cleaned length:', cleaned.length);
    return cleaned.trim();
  };

  // Crear Blob URLs para ambos casos AL MISMO NIVEL (antes de cualquier return/condición)
  // Esto evita el error de "React Hook called conditionally"
  
  const blobUrl = useMemo(() => {
    if (!html || html.trim() === '') return null;
    
    // Limpiar contenido antes de envolverlo
    const cleanContent = cleanHtmlContent(html);
    
    // Si después de limpiar queda vacío, usar el HTML original
    const finalContent = cleanContent || html;
    
    // Forzar estilos para asegurar visibilidad del contenido
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          /* Reset básico para asegurar visibilidad */
          * { 
            box-sizing: border-box; 
            max-width: 100% !important; 
          }
          html, body { 
            margin: 0; 
            padding: 16px; 
            width: auto !important;
            height: auto !important;
            min-height: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            font-size: 14px; 
            line-height: 1.6; 
            color: #1a1a1a !important; 
            background: white !important;
            display: block !important;
            visibility: visible !important;
            overflow: visible !important;
          }
          /* Tablas */
          table { 
            width: 100% !important; 
            border-collapse: collapse; 
            display: table !important;
          }
          tr { 
            display: table-row !important; 
          }
          td, th { 
            padding: 8px; 
            border: 1px solid #e0e0e0; 
            display: table-cell !important;
          }
          /* Imágenes */
          img { 
            max-width: 100% !important; 
            height: auto !important; 
            display: block !important;
            visibility: visible !important;
          }
          /* VML de Outlook - usando regex para seleccion */
          [class*="Mso"], [style*="mso-"] {
            visibility: visible !important;
          }
          /* Elementos básicos */
          a { color: #007AFF !important; }
          p { 
            margin: 8px 0 !important; 
            display: block !important;
          }
          div { 
            display: block !important; 
            visibility: visible !important;
          }
          span { 
            display: inline !important; 
          }
          /* Forzar visibilidad de elementos potencialmente ocultos */
          [style*="display:none"], [style*="display: none"] { 
            display: none !important; 
          }
          [hidden] {
            display: none !important;
          }
          /* Estilos de Outlook */
          .MsoNormal { 
            margin-bottom: 0 !important; 
          }
          /* Citas de correo */
          .gmail_quote, .quote, blockquote { 
            display: block; 
            border-left: 3px solid #e0e0e0; 
            padding-left: 16px; 
            margin: 12px 0; 
            color: #666; 
          }
          /* Espacios en blanco */
          br { 
            display: block !important;
            content: "" !important;
            margin-top: 8px !important;
          }
          /* Foreach de tablas anidadas */
          table table {
            border: none !important;
          }
        </style>
      </head>
      <body>${finalContent}</body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
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
          sandbox="allow-scripts allow-popups"
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
        sandbox="allow-scripts allow-popups"
      />
    </div>
  );
}

export default HtmlEmailRenderer;