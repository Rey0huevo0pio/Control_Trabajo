import React, { useEffect } from "react";
import { YStack } from "tamagui";
import { Text } from "../../../../../src/components/design-system";
import { WebView } from "react-native-webview";

interface HtmlEmailRendererProps {
  html: string;
  text?: string;
}

export function HtmlEmailRenderer({ html, text }: HtmlEmailRendererProps) {
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

  if (!html || html.trim() === "") {
    if (text) {
      return (
        <YStack padding="$3" gap="$2">
          <Text variant="body" color="$color" lineHeight={22}>
            {text}
          </Text>
        </YStack>
      );
    }
    return (
      <YStack padding="$4" alignItems="center">
        <Text variant="body" color="$color3">
          Sin contenido
        </Text>
      </YStack>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
          padding: 0;
          margin: 0;
          background-color: transparent;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        a {
          color: #007AFF;
        }
        table {
          max-width: 100%;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>${html}</body>
    </html>
  `;

  return (
    <YStack padding="$2" minHeight={200}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1, minHeight: 200, backgroundColor: 'transparent' }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        containerStyle={{ backgroundColor: 'transparent' }}
        nestedScrollEnabled={true}
      />
    </YStack>
  );
}
