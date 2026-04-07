import React, { useEffect, useState } from "react";
import { Share } from "react-native";
import { YStack, ScrollView, Spinner, XStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
  useResponsive,
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
  const { isMobile, safeSpacing } = useResponsive();

  useEffect(() => {
    console.log("📧 [EmailContentViewer] Received email:", {
      hasHtml: !!email?.html,
      htmlLength: email?.html?.length || 0,
      hasText: !!email?.text,
      textLength: email?.text?.length || 0,
      attachmentsCount: email?.attachments?.length || 0,
    });
  }, [email]);

  // ✅ FUNCIÓN PARA COMPARTIR/DESCARGAR ADJUNTOS (usa Share nativo de RN)
  const handleShareAttachment = async (attachment: any) => {
    try {
      const fileName = attachment.fileName || attachment.filename || "archivo";
      const mimeType = attachment.contentType || attachment.mimeType || "archivo";
      const size = attachment.size || 0;
      
      const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
      };

      // Mostrar diálogo de compartir nativo
      await Share.share({
        message: `📎 ${fileName}\n📄 Tipo: ${mimeType}\n📏 Tamaño: ${formatFileSize(size)}\n\n¿Cómo deseas compartir este archivo?`,
        title: `Compartir: ${fileName}`,
      });
    } catch (error) {
      console.error("❌ [EmailContentViewer] Error compartiendo adjunto:", error);
    }
  };

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
      {/* Header tipo Gmail con safe area */}
      <Card 
        backgroundColor="$background" 
        padding="$3" 
        paddingTop={isMobile ? safeSpacing.top + 12 : 16}
        borderBottomWidth={1} 
        borderColor="$border"
      >
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
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        backgroundColor="$background2"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack padding={isMobile ? "$3" : "$4"} gap="$3">
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
            <Text variant="h5" fontWeight="700" color="$color" marginBottom="$3" flexShrink={1}>
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
                borderRadius={28}
                backgroundColor="#007AFF"
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
              <YStack flex={1} gap="$2" flexShrink={1}>
                <XStack justifyContent="space-between" alignItems="flex-start" flexShrink={1}>
                  <YStack flex={1} flexShrink={1}>
                    <Text variant="body" fontWeight="700" color="$color" flexShrink={1}>
                      {extractName(email.from)}
                    </Text>
                    <Text variant="caption" color="$color3" flexShrink={1}>
                      {extractEmailAddress(email.from)}
                    </Text>
                  </YStack>
                  <Text variant="caption" color="$color3" textAlign="right" flexShrink={0}>
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

          {/* Adjuntos con botón de descarga */}
          {email.attachments && email.attachments.length > 0 && (
            <Card
              backgroundColor="$background"
              borderRadius={12}
              padding="$4"
              shadowColor="rgba(0,0,0,0.1)"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
                <XStack gap="$2" alignItems="center">
                  <Ionicons name="attach" size={20} color="$color" />
                  <Text variant="label" fontWeight="600" color="$color">
                    {email.attachments.length} adjunto{email.attachments.length > 1 ? "s" : ""}
                  </Text>
                </XStack>
              </XStack>

              <YStack gap="$2">
                {email.attachments.map((att: any, idx: number) => {
                  const fileName = att.fileName || att.filename || "Archivo adjunto";
                  const mimeType = (att.contentType || att.mimeType || "").toLowerCase();
                  const size = att.size || 0;
                  
                  // Determinar icono y color
                  let icon = "document-attach";
                  let iconColor = "#8E8E93";
                  if (mimeType.startsWith("image")) { icon = "image"; iconColor = "#007AFF"; }
                  else if (mimeType.includes("pdf")) { icon = "document"; iconColor = "#FF3B30"; }
                  else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) { icon = "grid"; iconColor = "#34C759"; }
                  else if (mimeType.includes("word")) { icon = "document-text"; iconColor = "#007AFF"; }
                  else if (mimeType.startsWith("video")) { icon = "videocam"; iconColor = "#AF52DE"; }
                  else if (mimeType.startsWith("audio")) { icon = "musical-notes"; iconColor = "#FF9500"; }
                  else if (mimeType.includes("zip") || mimeType.includes("rar")) { icon = "archive"; iconColor = "#FFCC00"; }

                  const formatFileSize = (bytes: number): string => {
                    if (bytes === 0) return "0 Bytes";
                    const k = 1024;
                    const sizes = ["Bytes", "KB", "MB", "GB"];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
                  };

                  return (
                    <XStack
                      key={idx}
                      backgroundColor="$background2"
                      borderRadius={12}
                      padding="$3"
                      gap="$3"
                      alignItems="center"
                    >
                      {/* Icono */}
                      <YStack
                        width={48}
                        height={48}
                        borderRadius={8}
                        backgroundColor="$background3"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Ionicons name={icon as any} size={28} color={iconColor} />
                      </YStack>

                      {/* Información */}
                      <YStack flex={1} gap="$1" flexShrink={1}>
                        <Text variant="bodySmall" fontWeight="600" color="$color" numberOfLines={1} flexShrink={1}>
                          {fileName}
                        </Text>
                        <Text variant="caption" color="$color3">
                          {formatFileSize(size)} • {mimeType || "archivo"}
                        </Text>
                      </YStack>

                      {/* Botón de compartir/descargar */}
                      <IconButton
                        icon="download-outline"
                        onPress={() => handleShareAttachment(att)}
                        variant="ghost"
                        size={20}
                      />
                    </XStack>
                  );
                })}
              </YStack>
            </Card>
          )}

          {/* Espacio adicional al final */}
          <YStack height={40} />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
