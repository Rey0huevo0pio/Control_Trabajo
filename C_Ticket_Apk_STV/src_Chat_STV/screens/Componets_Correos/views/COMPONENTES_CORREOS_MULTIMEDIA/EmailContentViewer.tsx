import React, { useEffect, useState } from "react";
import { YStack, ScrollView, Spinner, XStack } from "tamagui";
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
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.log("📧 [EmailContentViewer] Received email:", {
      hasHtml: !!email?.html,
      htmlLength: email?.html?.length || 0,
      hasText: !!email?.text,
      textLength: email?.text?.length || 0,
      attachmentsCount: email?.attachments?.length || 0,
    });
  }, [email]);

  const getInitials = (from: string) => {
    if (!from) return "?";
    const emailMatch = from.match(/<([^>]+)>/);
    const cleanEmail = emailMatch ? emailMatch[1] : from;
    const parts = from.split(" ").filter((p) => !p.includes("<"));
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.substring(0, 2).toUpperCase() || "?";
  };

  const extractEmailAddress = (from: string) => {
    const match = from.match(/<([^>]+)>/);
    return match ? match[1] : from;
  };

  const extractName = (from: string) => {
    const match = from.match(/<([^>]+)>/);
    return match ? from.substring(0, from.indexOf("<")).trim() : from;
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const emailDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - emailDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) return "Hace menos de 1 hora";
    if (diffHours < 24)
      return `Hace ${Math.floor(diffHours)} hora${Math.floor(diffHours) > 1 ? "s" : ""}`;
    if (diffDays < 7)
      return `Hace ${Math.floor(diffDays)} día${Math.floor(diffDays) > 1 ? "s" : ""}`;

    return emailDate.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5">
        <Spinner size="large" color="#007AFF" />
        <Text variant="body" color="$color2" marginTop="$3">
          Cargando correo...
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header tipo Gmail */}
      <Card backgroundColor="$background" padding="$3" borderBottomWidth={1} borderColor="$border">
        <XStack justifyContent="space-between" alignItems="center">
          <IconButton
            icon="arrow-back"
            onPress={onBack}
            variant="ghost"
            size={24}
          />
          <Text variant="label" fontWeight="700" color="$color" flex={1} textAlign="center">
            Correo
          </Text>
          <HStack gap="$1">
            <IconButton
              icon="mail-outline"
              onPress={() => {}}
              variant="ghost"
              size={20}
            />
            <IconButton
              icon="ellipsis-vertical"
              onPress={() => setShowDetails(!showDetails)}
              variant="ghost"
              size={20}
            />
          </HStack>
        </XStack>
      </Card>

      {/* Contenido del correo */}
      <ScrollView showsVerticalScrollIndicator={false} backgroundColor="$background2">
        <YStack padding="$3" gap="$3">
          {/* Tarjeta principal del correo */}
          <Card
            backgroundColor="$background"
            borderRadius={12}
            padding="$4"
            shadowColor="rgba(0,0,0,0.1)"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={8}
          >
            {/* Asunto */}
            <Text variant="h5" fontWeight="700" color="$color" marginBottom="$3">
              {email.subject || "Sin asunto"}
            </Text>

            {/* Divider */}
            <YStack
              height={1}
              backgroundColor="$border"
              marginVertical="$3"
            />

            {/* Información del remitente */}
            <XStack gap="$3" alignItems="flex-start">
              {/* Avatar */}
              <YStack
                width={56}
                height={56}
                borderRadius="$full"
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
                shadowColor="rgba(0,0,0,0.2)"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.3}
                shadowRadius={4}
              >
                <Text color="white" fontWeight="700" fontSize={20}>
                  {getInitials(email.from)}
                </Text>
              </YStack>

              {/* Detalles del remitente */}
              <YStack flex={1} gap="$2">
                <XStack justifyContent="space-between" alignItems="flex-start">
                  <YStack flex={1}>
                    <Text variant="body" fontWeight="700" color="$color">
                      {extractName(email.from)}
                    </Text>
                    <Text variant="caption" color="$color3">
                      {extractEmailAddress(email.from)}
                    </Text>
                  </YStack>
                  <Text variant="caption" color="$color3" textAlign="right">
                    {formatDate(email.date)}
                  </Text>
                </XStack>

                {/* Detalles expandibles */}
                {showDetails && (
                  <YStack
                    marginTop="$2"
                    padding="$3"
                    backgroundColor="$background2"
                    borderRadius={8}
                    gap="$2"
                  >
                    <Text variant="caption" color="$color3">
                      <Text fontWeight="600">De:</Text> {email.from}
                    </Text>
                    <Text variant="caption" color="$color3">
                      <Text fontWeight="600">Fecha:</Text>{" "}
                      {new Date(email.date).toLocaleString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </Text>
                  </YStack>
                )}
              </YStack>
            </XStack>

            {/* Divider */}
            <YStack
              height={1}
              backgroundColor="$border"
              marginVertical="$4"
            />

            {/* Contenido del correo */}
            <HtmlEmailRenderer html={email.html} text={email.text} />
          </Card>

          {/* Adjuntos */}
          <AttachmentPreview attachments={email.attachments || []} />

          {/* Espacio adicional al final */}
          <YStack height={40} />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
