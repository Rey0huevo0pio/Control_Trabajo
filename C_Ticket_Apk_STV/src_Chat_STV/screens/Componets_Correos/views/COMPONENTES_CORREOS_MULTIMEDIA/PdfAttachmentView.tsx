import React from "react";
import { Dimensions } from "react-native";
import { YStack } from "tamagui";
import { Text, Card } from "../../../../../src/components/design-system";

interface PdfAttachmentViewProps {
  fileName: string;
  size: number;
  content?: string;
}

export function PdfAttachmentView({ fileName, size, content }: PdfAttachmentViewProps) {
  const screenWidth = Dimensions.get("window").width;
  const pdfWidth = screenWidth - 80;
  
  const sizeKB = (size / 1024).toFixed(1);
  const sizeMB = (size / 1024 / 1024).toFixed(2);
  const displaySize = size > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <Card variant="outlined" padding="$4" backgroundColor="$backgroundTertiary" borderRadius={12}>
      <YStack gap="$3">
        {/* Header del PDF */}
        <YStack
          backgroundColor="#FF3B30"
          padding="$3"
          borderRadius={8}
          alignItems="center"
        >
          <Text fontSize={40}>📄</Text>
          <Text variant="body" fontWeight="600" color="white" marginTop="$2" textAlign="center">
            {fileName}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.8)">
            PDF • {displaySize}
          </Text>
        </YStack>

        {/* Preview si hay contenido */}
        {content ? (
          <YStack
            backgroundColor="white"
            borderRadius={8}
            padding="$3"
            minHeight={100}
            maxHeight={200}
            overflow="hidden"
          >
            <Text variant="caption" color="$color3" marginBottom="$2">
              📋 Contenido del PDF:
            </Text>
            <Text
              variant="bodySmall"
              color="$color"
              numberOfLines={6}
              lineHeight={20}
            >
              {content.length > 500 
                ? content.substring(0, 500) + "..." 
                : content}
            </Text>
          </YStack>
        ) : (
          <YStack
            backgroundColor="white"
            borderRadius={8}
            padding="$4"
            alignItems="center"
          >
            <Text variant="caption" color="$color3" textAlign="center">
              📎 Descarga para ver el contenido completo
            </Text>
          </YStack>
        )}
      </YStack>
    </Card>
  );
}




