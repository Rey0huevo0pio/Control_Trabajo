import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const sizeKB = (size / 1024).toFixed(1);
  const sizeMB = (size / 1024 / 1024).toFixed(2);
  const displaySize = size > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <YStack gap="$3">
      <YStack
        backgroundColor="$backgroundTertiary"
        minHeight={150}
        borderRadius="$md"
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
      >
        {loading ? (
          <Spinner size="large" color="#007AFF" />
        ) : (
          <>
            <Text fontSize={40}>🖼️</Text>
            <Text variant="caption" color="$color3" marginTop="$2">
              Imagen: {fileName}
            </Text>
            <Text variant="caption" color="$color3">
              {displaySize} • {mimeType}
            </Text>
          </>
        )}
      </YStack>
    </YStack>
  );
}
