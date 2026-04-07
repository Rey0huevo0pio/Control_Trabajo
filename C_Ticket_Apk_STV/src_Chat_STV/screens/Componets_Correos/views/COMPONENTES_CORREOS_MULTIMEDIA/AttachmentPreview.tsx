import React, { useState } from "react";
import { YStack, XStack, ScrollView } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../../../../src/components/design-system";
import { ImageAttachmentView } from "./ImageAttachmentView";
import { PdfAttachmentView } from "./PdfAttachmentView";
import { FileAttachmentView } from "./FileAttachmentView";

interface Attachment {
  fileName?: string;
  filename?: string;
  contentType?: string;
  mimeType?: string;
  size?: number;
  content?: string;
  thumbnail?: string;
  isImage?: boolean;
  isPDF?: boolean;
}

interface AttachmentPreviewProps {
  attachments: Attachment[];
}

export function AttachmentPreview({ attachments }: AttachmentPreviewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (!attachments || attachments.length === 0) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string): keyof typeof Ionicons.glyphMap => {
    if (mimeType.startsWith("image")) return "image";
    if (mimeType.includes("pdf")) return "document";
    if (mimeType.includes("word")) return "document-text";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
      return "grid";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
      return "easel";
    if (mimeType.startsWith("video")) return "videocam";
    if (mimeType.startsWith("audio")) return "musical-notes";
    if (mimeType.includes("zip") || mimeType.includes("rar")) return "archive";
    return "document-attach";
  };

  const getFileIconColor = (mimeType: string): string => {
    if (mimeType.startsWith("image")) return "#007AFF";
    if (mimeType.includes("pdf")) return "#FF3B30";
    if (mimeType.includes("word")) return "#2B579A";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
      return "#217346";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
      return "#D24726";
    if (mimeType.startsWith("video")) return "#AF52DE";
    if (mimeType.startsWith("audio")) return "#FF9500";
    if (mimeType.includes("zip") || mimeType.includes("rar")) return "#FFD60A";
    return "#8E8E93";
  };

  return (
    <YStack
      gap="$3"
      borderTopWidth={1}
      borderColor="$border"
      paddingTop="$4"
      marginTop="$2"
    >
      {/* Header con contador y toggle de vista */}
      <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$2" alignItems="center">
          <Ionicons name="attach" size={20} color="$color" />
          <Text variant="label" fontWeight="600" color="$color">
            {attachments.length} adjunto
            {attachments.length > 1 ? "s" : ""}
          </Text>
        </XStack>

        {/* Toggle de vista (solo si hay más de 2 adjuntos) */}
        {attachments.length > 2 && (
          <XStack
            backgroundColor="$background2"
            borderRadius={8}
            padding="$1"
            gap="$1"
          >
            <XStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              padding="$2"
              borderRadius={6}
              backgroundColor={viewMode === "grid" ? "$background" : "transparent"}
              shadowColor={viewMode === "grid" ? "rgba(0,0,0,0.1)" : "transparent"}
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.2}
              shadowRadius={2}
              onPress={() => setViewMode("grid")}
            >
              <Ionicons
                name={viewMode === "grid" ? "grid" : "grid-outline"}
                size={16}
                color={viewMode === "grid" ? "$primary" : "$color3"}
              />
            </XStack>
            <XStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              padding="$2"
              borderRadius={6}
              backgroundColor={viewMode === "list" ? "$background" : "transparent"}
              shadowColor={viewMode === "list" ? "rgba(0,0,0,0.1)" : "transparent"}
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.2}
              shadowRadius={2}
              onPress={() => setViewMode("list")}
            >
              <Ionicons
                name={viewMode === "list" ? "list" : "list-outline"}
                size={16}
                color={viewMode === "list" ? "$primary" : "$color3"}
              />
            </XStack>
          </XStack>
        )}
      </XStack>

      {/* Vista en cuadrícula */}
      {viewMode === "grid" && attachments.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="$3" paddingVertical="$2">
            {attachments.map((att, idx) => {
              const fileName = att.fileName || att.filename || "Archivo adjunto";
              const mimeType = (att.contentType || att.mimeType || "").toLowerCase();
              const size = att.size || 0;
              const isImage = mimeType.startsWith("image");
              const isPdf = mimeType.includes("pdf");

              return (
                <YStack
                  key={idx}
                  width={160}
                  backgroundColor="$background2"
                  borderRadius={12}
                  overflow="hidden"
                  shadowColor="rgba(0,0,0,0.1)"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={4}
                >
                  {/* Thumbnail o Icono */}
                  <YStack
                    height={120}
                    backgroundColor="$background3"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {isImage && att.thumbnail ? (
                      <ImageAttachmentView
                        fileName={fileName}
                        size={size}
                        content={att.content}
                        mimeType={mimeType}
                      />
                    ) : (
                      <Ionicons
                        name={getFileIcon(mimeType)}
                        size={48}
                        color={getFileIconColor(mimeType)}
                      />
                    )}
                  </YStack>

                  {/* Información del archivo */}
                  <YStack padding="$2" gap="$1">
                    <Text
                      variant="caption"
                      fontWeight="600"
                      numberOfLines={1}
                      color="$color"
                    >
                      {fileName}
                    </Text>
                    <Text variant="caption" color="$color3">
                      {formatFileSize(size)}
                    </Text>
                  </YStack>
                </YStack>
              );
            })}
          </XStack>
        </ScrollView>
      ) : (
        /* Vista en lista */
        <YStack gap="$2">
          {attachments.map((att, idx) => {
            const fileName = att.fileName || att.filename || "Archivo adjunto";
            const mimeType = (att.contentType || att.mimeType || "").toLowerCase();
            const size = att.size || 0;
            const isImage = mimeType.startsWith("image");
            const isPdf = mimeType.includes("pdf");

            return (
              <XStack
                key={idx}
                backgroundColor="$background2"
                borderRadius={12}
                padding="$3"
                gap="$3"
                alignItems="center"
                shadowColor="rgba(0,0,0,0.05)"
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.1}
                shadowRadius={2}
              >
                {/* Icono o thumbnail */}
                <YStack
                  width={48}
                  height={48}
                  borderRadius={8}
                  backgroundColor="$background3"
                  justifyContent="center"
                  alignItems="center"
                >
                  {isImage && att.thumbnail ? (
                    <Ionicons name="image" size={28} color="#007AFF" />
                  ) : (
                    <Ionicons
                      name={getFileIcon(mimeType)}
                      size={28}
                      color={getFileIconColor(mimeType)}
                    />
                  )}
                </YStack>

                {/* Información */}
                <YStack flex={1} gap="$1">
                  <Text variant="bodySmall" fontWeight="600" color="$color" numberOfLines={1}>
                    {fileName}
                  </Text>
                  <Text variant="caption" color="$color3">
                    {formatFileSize(size)} • {mimeType || "archivo"}
                  </Text>
                </YStack>

                {/* Botón de descarga */}
                <Ionicons name="download-outline" size={20} color="$color3" />
              </XStack>
            );
          })}
        </YStack>
      )}
    </YStack>
  );
}
