import React, { useState } from "react";
import { Image, Dimensions } from "react-native";
import { YStack, Spinner } from "tamagui";
import { Text } from "../../../../../src/components/design-system";

interface ImageAttachmentViewProps {
  fileName: string;
  size: number;
  content?: string; // base64
  mimeType: string;
}

export function ImageAttachmentView({
  fileName,
  size,
  content,
  mimeType,
}: ImageAttachmentViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth - 80; // Margen de 40px a cada lado

  const sizeKB = (size / 1024).toFixed(1);
  const sizeMB = (size / 1024 / 1024).toFixed(2);
  const displaySize = size > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  // Construir URI de imagen desde base64
  const imageUri = content 
    ? `data:${mimeType};base64,${content}`
    : null;

  return (
    <YStack gap="$2">
      {/* ✅ Mostrar imagen real si hay contenido */}
      {imageUri ? (
        <YStack
          borderRadius={12}
          overflow="hidden"
          backgroundColor="$backgroundTertiary"
        >
          <Image
            source={{ uri: imageUri }}
            style={{
              width: imageWidth,
              height: 250,
              resizeMode: "contain",
            }}
            onLoadStart={() => {
              setLoading(true);
              setError(false);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
          {loading && (
            <YStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              justifyContent="center"
              alignItems="center"
              backgroundColor="rgba(0,0,0,0.1)"
            >
              <Spinner size="large" color="#007AFF" />
            </YStack>
          )}
          {error && (
            <YStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              justifyContent="center"
              alignItems="center"
              backgroundColor="rgba(0,0,0,0.5)"
            >
              <Text color="white" fontSize={40}>⚠️</Text>
              <Text variant="caption" color="white" marginTop="$2">
                Error al cargar imagen
              </Text>
            </YStack>
          )}
        </YStack>
      ) : (
        /* Placeholder si no hay contenido */
        <YStack
          backgroundColor="$backgroundTertiary"
          minHeight={150}
          borderRadius={12}
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
          padding="$4"
        >
          <Text fontSize={40}>🖼️</Text>
          <Text variant="body" color="$color2" marginTop="$2" textAlign="center">
            {fileName}
          </Text>
          <Text variant="caption" color="$color3" marginTop="$1">
            {displaySize} • {mimeType}
          </Text>
        </YStack>
      )}
    </YStack>
  );
}
