import React from "react";
import { YStack, ScrollView } from "tamagui";
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
}

interface AttachmentPreviewProps {
  attachments: Attachment[];
}

export function AttachmentPreview({ attachments }: AttachmentPreviewProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <YStack gap="$3" borderTopWidth={1} borderColor="$border" paddingTop="$4">
      <Text variant="label" fontWeight="600" color="$color">
        📎 {attachments.length} adjunto{attachments.length > 1 ? "s" : ""}
      </Text>

      {attachments.map((att, idx) => {
        const fileName = att.fileName || att.filename || "Archivo adjunto";
        const mimeType = (att.contentType || att.mimeType || "").toLowerCase();
        const size = att.size || 0;

        const isImage = mimeType.startsWith("image");
        const isPdf = mimeType.includes("pdf");
        const isVideo = mimeType.startsWith("video");
        const isAudio = mimeType.startsWith("audio");

        return (
          <YStack key={idx}>
            {isImage ? (
              <ImageAttachmentView
                fileName={fileName}
                size={size}
                content={att.content}
                mimeType={mimeType}
              />
            ) : isPdf ? (
              <PdfAttachmentView
                fileName={fileName}
                size={size}
                content={att.content}
              />
            ) : isVideo || isAudio ? (
              <FileAttachmentView
                fileName={fileName}
                size={size}
                mimeType={mimeType}
              />
            ) : (
              <FileAttachmentView
                fileName={fileName}
                size={size}
                mimeType={mimeType}
              />
            )}
          </YStack>
        );
      })}
    </YStack>
  );
}
