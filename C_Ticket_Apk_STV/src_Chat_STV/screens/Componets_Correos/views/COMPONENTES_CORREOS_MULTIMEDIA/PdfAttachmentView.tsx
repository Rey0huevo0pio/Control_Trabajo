import React from "react";
import { YStack } from "tamagui";
import { Text, Card } from "../../../../../src/components/design-system";

interface PdfAttachmentViewProps {
  fileName: string;
  size: number;
  content?: string;
}

export function PdfAttachmentView({ fileName, size }: PdfAttachmentViewProps) {
  const sizeKB = (size / 1024).toFixed(1);
  const sizeMB = (size / 1024 / 1024).toFixed(2);
  const displaySize = size > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <Card variant="outlined" padding="$3" backgroundColor="$errorMuted">
      <YStack gap="$2" alignItems="center">
        <Text fontSize={40}>📄</Text>
        <Text variant="bodySmall" fontWeight="600" color="$error">
          {fileName}
        </Text>
        <Text variant="caption" color="$color3">
          PDF • {displaySize}
        </Text>
        <Text variant="caption" color="$color3" textAlign="center">
          Vista previa no disponible
        </Text>
      </YStack>
    </Card>
  );
}




