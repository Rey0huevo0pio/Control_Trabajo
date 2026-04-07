import React from "react";
import { YStack } from "tamagui";
import { Text, Card } from "../../../../../src/components/design-system";

interface FileAttachmentViewProps {
  fileName: string;
  size: number;
  mimeType: string;
}

export function FileAttachmentView({
  fileName,
  size,
  mimeType,
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
      padding="$3"
      backgroundColor="$backgroundSecondary"
    >
      <YStack gap="$2" alignItems="center">
        <Text fontSize={40}>{getIcon()}</Text>
        <Text
          variant="bodySmall"
          fontWeight="600"
          color="$color"
          numberOfLines={1}
        >
          {fileName}
        </Text>
        <Text variant="caption" color="$color3">
          {getExtension()} • {displaySize}
        </Text>
      </YStack>
    </Card>
  );
}
