import React from "react";
import { Dimensions } from "react-native";
import { YStack } from "tamagui";
import { Text, Card } from "../../../../../src/components/design-system";

interface FileAttachmentViewProps {
  fileName: string;
  size: number;
  mimeType: string;
  content?: string;
}

export function FileAttachmentView({
  fileName,
  size,
  mimeType,
  content,
}: FileAttachmentViewProps) {
  const sizeKB = (size / 1024).toFixed(1);
  const sizeMB = (size / 1024 / 1024).toFixed(2);
  const displaySize = size > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

  const getExtension = () => {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
  };

  const getIcon = () => {
    const mt = mimeType.toLowerCase();
    if (mt.includes("word") || mt.includes("document")) return "📝";
    if (mt.includes("excel") || mt.includes("sheet") || mt.includes("csv"))
      return "📊";
    if (mt.includes("powerpoint") || mt.includes("presentation")) return "📑";
    if (mt.includes("zip") || mt.includes("rar") || mt.includes("compressed"))
      return "📦";
    if (mt.includes("audio")) return "🎵";
    if (mt.includes("video")) return "🎬";
    if (mt.includes("text")) return "📃";
    return "📎";
  };

  return (
    <Card
      variant="outlined"
      padding="$4"
      backgroundColor="$backgroundTertiary"
      borderRadius={12}
    >
      <YStack gap="$3">
        {/* Header del archivo */}
        <YStack
          backgroundColor="$backgroundSecondary"
          padding="$3"
          borderRadius={8}
          alignItems="center"
        >
          <Text fontSize={40}>{getIcon()}</Text>
          <Text
            variant="body"
            fontWeight="600"
            color="$color"
            numberOfLines={1}
            marginTop="$2"
            textAlign="center"
          >
            {fileName}
          </Text>
          <Text variant="caption" color="$color3">
            {getExtension()} • {displaySize}
          </Text>
        </YStack>

        {/* Preview si hay contenido (archivos de texto) */}
        {content && mimeType.includes("text") ? (
          <YStack
            backgroundColor="white"
            borderRadius={8}
            padding="$3"
            maxHeight={150}
            overflow="hidden"
          >
            <Text variant="caption" color="$color3" marginBottom="$2">
              📋 Vista previa:
            </Text>
            <Text
              variant="bodySmall"
              color="$color"
              numberOfLines={5}
              lineHeight={20}
              fontSize={12}
              style={{ fontFamily: "monospace" }}
            >
              {content.length > 400 
                ? content.substring(0, 400) + "..." 
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
              📎 {mimeType.includes("zip") || mimeType.includes("rar") 
                ? "Archivo comprimido - descarga para extraer" 
                : "Descarga para ver el contenido"}
            </Text>
          </YStack>
        )}
      </YStack>
    </Card>
  );
}
