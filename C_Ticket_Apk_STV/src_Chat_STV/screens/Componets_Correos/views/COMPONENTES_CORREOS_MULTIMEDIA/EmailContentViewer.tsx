import React from "react";
import { YStack, ScrollView, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
} from "../../../../../src/components/design-system";
import { HtmlEmailRenderer } from "./HtmlEmailRenderer";
import { AttachmentPreview } from "./AttachmentPreview";

interface EmailContent {
  from: string;
  subject: string;
  date: string;
  text: string;
  html: string;
  attachments: any[];
}

interface EmailContentViewerProps {
  email: EmailContent;
  onBack: () => void;
  loading?: boolean;
}

export function EmailContentViewer({
  email,
  onBack,
  loading = false,
}: EmailContentViewerProps) {
  const getInitials = (from: string) => {
    if (!from) return "?";
    const parts = from.split(" ").filter((p) => !p.includes("<"));
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.substring(0, 2).toUpperCase() || "?";
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5">
        <Spinner size="large" color="$primary" />
        <Text variant="body" color="$color2" marginTop="$3">
          Cargando correo...
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      {/* Header */}
      <Card backgroundColor="$primary" padding="$4">
        <HStack justifyContent="space-between" alignItems="center">
          <IconButton
            icon="arrow-back"
            onPress={onBack}
            variant="ghost"
            size={24}
          />
          <HStack gap="$2">
            <IconButton
              icon="mail-outline"
              onPress={() => {}}
              variant="ghost"
              size={24}
            />
            <IconButton
              icon="send-outline"
              onPress={() => {}}
              variant="ghost"
              size={24}
            />
          </HStack>
        </HStack>
      </Card>

      {/* Email Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          {/* Sender Info */}
          <HStack gap="$3" alignItems="center">
            <YStack
              width={50}
              height={50}
              borderRadius="$full"
              backgroundColor="$primary"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="white" fontWeight="700" fontSize={18}>
                {getInitials(email.from)}
              </Text>
            </YStack>
            <Stack flex={1} gap="$1">
              <Text variant="body" fontWeight="700" color="$color">
                {email.from}
              </Text>
              <Text variant="caption" color="$color3">
                {new Date(email.date).toLocaleString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Stack>
          </HStack>

          {/* Subject */}
          <Text variant="h5" fontWeight="700" color="$color">
            {email.subject || "Sin asunto"}
          </Text>

          {/* Content */}
          <HtmlEmailRenderer html={email.html} text={email.text} />

          {/* Attachments */}
          <AttachmentPreview attachments={email.attachments || []} />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
