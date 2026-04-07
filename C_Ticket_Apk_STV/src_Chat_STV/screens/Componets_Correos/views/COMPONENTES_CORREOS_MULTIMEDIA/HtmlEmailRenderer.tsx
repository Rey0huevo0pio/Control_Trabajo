import React, { useEffect, useState } from "react";
import { YStack, Spinner } from "tamagui";
import { Text } from "../../../../../src/components/design-system";
import { WebView } from "react-native-webview";

interface HtmlEmailRendererProps {
  html: string;
  text?: string;
}

export function HtmlEmailRenderer({ html, text }: HtmlEmailRendererProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("📄 [HtmlEmailRenderer] Received props:", {
      hasHtml: !!html,
      htmlLength: html?.length || 0,
      htmlPreview: html?.substring(0, 100),
      hasText: !!text,
      textLength: text?.length || 0,
      textPreview: text?.substring(0, 100)
    });
  }, [html, text]);

  // Si no hay HTML ni texto, mostrar mensaje vacío
  if ((!html || html.trim() === "") && (!text || text.trim() === "")) {
    return (
      <YStack padding="$4" alignItems="center" backgroundColor="$background2" borderRadius={12} margin="$2">
        <Text variant="body" color="$color3" padding="$3">
          📭 Este correo no tiene contenido visible
        </Text>
      </YStack>
    );
  }

  // Si solo hay texto plano, formatearlo bonitamente
  if (!html || html.trim() === "") {
    const formattedText = (text || '')
      .replace(/\n/g, '<br>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: #007AFF;">$1</a>');

    return (
      <YStack 
        backgroundColor="white" 
        borderRadius={12} 
        margin="$2" 
        padding="$4"
        shadowColor="rgba(0,0,0,0.1)"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        <Text 
          variant="body" 
          color="$color" 
          lineHeight={24}
          fontSize={15}
        >
          {text}
        </Text>
      </YStack>
    );
  }

  // HTML completo con estilos profesionales tipo Gmail/Outlook
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        /* Reset y base */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
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
        
        /* Contenedor principal */
        .email-content {
          padding: 16px;
          background: white;
          border-radius: 12px;
          margin: 8px 0;
        }
        
        /* Imágenes */
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 12px 0;
          border-radius: 8px;
        }
        
        /* Enlaces */
        a {
          color: #007AFF;
          text-decoration: none;
          word-break: break-all;
        }
        
        a:hover {
          text-decoration: underline;
        }
        
        /* Tablas (para emails con layout) */
        table {
          max-width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
        }
        
        td, th {
          padding: 8px;
          vertical-align: top;
        }
        
        /* Bloques de cita (tipo Gmail) */
        blockquote,
        .gmail_quote,
        [class*="quote"] {
          border-left: 3px solid #e0e0e0;
          padding-left: 16px;
          margin: 16px 0;
          color: #666;
        }
        
        /* Código */
        pre, code {
          background: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
          font-size: 13px;
          overflow-x: auto;
          margin: 12px 0;
        }
        
        pre {
          border-left: 4px solid #007AFF;
        }
        
        code {
          display: inline-block;
          padding: 2px 8px;
        }
        
        /* Listas */
        ul, ol {
          margin: 12px 0;
          padding-left: 24px;
        }
        
        li {
          margin: 6px 0;
        }
        
        /* Encabezados */
        h1, h2, h3, h4, h5, h6 {
          margin: 20px 0 12px 0;
          font-weight: 600;
          line-height: 1.3;
          color: #1a1a1a;
        }
        
        h1 { font-size: 24px; }
        h2 { font-size: 22px; }
        h3 { font-size: 20px; }
        h4 { font-size: 18px; }
        h5 { font-size: 16px; }
        h6 { font-size: 14px; }
        
        /* Párrafos */
        p {
          margin: 12px 0;
        }
        
        /* Dividers */
        hr {
          border: none;
          border-top: 1px solid #e0e0e0;
          margin: 20px 0;
        }
        
        /* Firma */
        .signature,
        [class*="signature"],
        [class*="footer"] {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
          color: #666;
          font-size: 13px;
        }
        
        /* Imágenes inline CID */
        img[src^="cid:"] {
          max-width: 100%;
          border-radius: 8px;
          margin: 12px 0;
        }
        
        /* Tablas responsivas */
        @media only screen and (max-width: 600px) {
          table {
            width: 100% !important;
          }
          td {
            display: block !important;
          }
        }
        
        /* Animaciones suaves */
        * {
          transition: color 0.2s ease, background-color 0.2s ease;
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
    <YStack 
      backgroundColor="$background2" 
      borderRadius={12} 
      margin="$2"
      overflow="hidden"
    >
      {isLoading && (
        <YStack 
          padding="$4" 
          alignItems="center" 
          justifyContent="center"
          minHeight={120}
        >
          <Spinner size="small" color="$primary" />
          <Text variant="caption" color="$color3" marginTop="$2">
            Cargando correo...
          </Text>
        </YStack>
      )}
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ 
          flex: 1, 
          backgroundColor: 'transparent',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => {
          setIsLoading(false);
          console.log('✅ [HtmlEmailRenderer] WebView loaded successfully');
        }}
        onError={(e) => {
          console.error('❌ [HtmlEmailRenderer] WebView error:', e.nativeEvent);
          setIsLoading(false);
        }}
        scalesPageToFit={true}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        nestedScrollEnabled={true}
        bounces={false}
        overScrollMode="never"
      />
    </YStack>
  );
}
