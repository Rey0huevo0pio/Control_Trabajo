import React from "react";
import { YStack } from "tamagui";
import { Text, Spinner } from "../../../../../src/components/design-system";

interface HtmlEmailRendererProps {
  html: string;
  text?: string;
}

export function HtmlEmailRenderer({ html, text }: HtmlEmailRendererProps) {
  // Si no hay HTML, mostrar texto plano
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

  // Para web: usar un iframe o div dangerouslySetInnerHTML
  // Para React Native: necesitamos WebView
  return (
    <YStack padding="$2">
      <Text variant="caption" color="$color3" marginBottom="$2">
        📄 Contenido HTML disponible
      </Text>
      <YStack
        padding="$3"
        backgroundColor="$backgroundSecondary"
        borderRadius="$md"
        minHeight={80}
        justifyContent="center"
      >
        <Text variant="body" color="$color2" textAlign="center">
          HTML no renderizable en modo texto
        </Text>
      </YStack>
    </YStack>
  );
}
