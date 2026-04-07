import React, { useState, useEffect } from "react";
import { RefreshControl } from "react-native";
import { YStack, XStack, ScrollView, Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
  Button,
} from "../../../../src/components/design-system";
import { emailMessagesService } from "../../../services/emailMessages.service";
import { EmailContentViewer } from "./COMPONENTES_CORREOS_MULTIMEDIA";

interface EmailMessage {
  id: string;
  uid: number;
  from: string;
  to: string;
  subject: string;
  date: string;
  text: string;
  html: string;
  attachments: any[];
  seen: boolean;
  flagged: boolean;
  folder: string;
  cachedAt?: string;
}

export function EmailInboxView() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [fullEmailContent, setFullEmailContent] = useState<EmailMessage | null>(
    null,
  );
  const [loadingFullContent, setLoadingFullContent] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const loadEmails = async (forceRefresh: boolean = false) => {
    try {
      setError(null);
      console.log("📧 [EmailInboxView] Cargando correos...");

      const result = await emailMessagesService.getMessages("INBOX", 1, 50);

      console.log("📩 [EmailInboxView] Resultado:", result.message);
      console.log("📩 [EmailInboxView] Correos:", result.emails.length);
      console.log("📩 [EmailInboxView] Desde caché:", result.fromCache);

      setEmails(result.emails);
      setFromCache(result.fromCache);
    } catch (err: any) {
      console.error("❌ [EmailInboxView] Error:", err);
      setError(err.message || "Error al cargar correos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEmails(true);
  };

  const openEmail = async (email: EmailMessage) => {
    setSelectedEmail(email);
    setFullEmailContent(null);
    setLoadingFullContent(true);

    try {
      console.log("📧 [EmailInboxView] Abriendo email UID:", email.uid);
      
      const fullContent = await emailMessagesService.getFullMessage(
        email.uid,
        email.folder,
      );
      
      console.log("📧 [EmailInboxView] FullContent recibido:", {
        hasHtml: !!fullContent?.html,
        htmlLength: fullContent?.html?.length || 0,
        hasText: !!fullContent?.text,
        textLength: fullContent?.text?.length || 0,
        attachmentsCount: fullContent?.attachments?.length || 0,
        attachments: fullContent?.attachments?.map(a => ({ fileName: a.fileName, contentType: a.contentType }))
      });
      
      if (fullContent) {
        setFullEmailContent(fullContent);
      }
    } catch (err) {
      console.error("❌ [EmailInboxView] Error loading full content:", err);
    } finally {
      setLoadingFullContent(false);
    }
  };

  const closeEmail = () => {
    setSelectedEmail(null);
    setFullEmailContent(null);
    setLoadingFullContent(false);
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const emailDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - emailDate.getTime();
    const diffH = diffMs / (1000 * 60 * 60);
    const diffD = diffMs / (1000 * 60 * 60 * 24);

    if (diffH < 1) return "Hace min";
    if (diffH < 24) return `${Math.floor(diffH)}h`;
    if (diffD < 7) return `${Math.floor(diffD)}d`;
    return emailDate.toLocaleDateString();
  };

  const getInitials = (from: string) => {
    if (!from) return "?";
    const parts = from.split(" ").filter((p) => !p.includes("<"));
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.substring(0, 2).toUpperCase() || "?";
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5">
        <Spinner size="large" color="#007AFF" />
        <Text variant="body" color="$color2" marginTop="$3">
          Cargando correos...
        </Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$5"
        gap="$3"
      >
        <Ionicons name="alert-circle" size={48} color="$error" />
        <Text variant="body" color="$error" textAlign="center">
          {error}
        </Text>
        <Button
          title="Reintentar"
          icon={"refresh-outline" as any}
          onPress={() => loadEmails(true)}
          variant="primary"
          size="md"
        />
      </YStack>
    );
  }

  if (selectedEmail) {
    const displayContent = fullEmailContent || selectedEmail;

    return (
      <EmailContentViewer
        email={{
          from: displayContent.from,
          subject: displayContent.subject,
          date: displayContent.date,
          text: displayContent.text,
          html: displayContent.html,
          attachments: displayContent.attachments,
        }}
        onBack={closeEmail}
        loading={loadingFullContent}
      />
    );
  }

  return (
    <YStack flex={1}>
      <Card backgroundColor="$primary" padding="$4">
        <HStack justify="space-between">
          <Text variant="h5" color="white" fontWeight="700">
            📬 Bandeja de Entrada
          </Text>
          <IconButton
            icon={"refresh-outline" as any}
            onPress={onRefresh}
            variant="ghost"
            size={24}
          />
        </HStack>
        <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
          {emails.length} correo{emails.length !== 1 ? "s" : ""}{" "}
          {fromCache ? "(caché)" : "(servidor)"}
        </Text>
      </Card>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["$primary"]}
          />
        }
      >
        {emails.length === 0 ? (
          <YStack padding="$5" alignItems="center" gap="$3">
            <Ionicons name="mail-open-outline" size={64} color="$color3" />
            <Text variant="h6" color="$color2" textAlign="center">
              No hay correos
            </Text>
            <Text variant="bodySmall" color="$color3" textAlign="center">
              Tu bandeja está vacía
            </Text>
          </YStack>
        ) : (
          <YStack>
            {emails.map((email: EmailMessage, index: number) => (
              <Card
                key={email.id || index}
                variant="outlined"
                padding="$3"
                borderBottomWidth={index < emails.length - 1 ? 1 : 0}
                borderBottomColor="$border"
                onPress={() => openEmail(email)}
                backgroundColor={!email.seen ? "$primaryMuted" : "$background"}
              >
                <HStack gap="$3">
                  <YStack
                    width={48}
                    height={48}
                    borderRadius="$full"
                    backgroundColor={!email.seen ? "$primary" : "$background2"}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      color={!email.seen ? "white" : "$color2"}
                      fontWeight="700"
                      fontSize={16}
                    >
                      {getInitials(email.from)}
                    </Text>
                  </YStack>

                  <Stack flex={1} gap="$1">
                    <HStack justify="space-between">
                      <Text
                        variant="bodySmall"
                        fontWeight={!email.seen ? "700" : "500"}
                        color="$color"
                        flex={1}
                        numberOfLines={1}
                      >
                        {email.from.split("<")[0].trim()}
                      </Text>
                      <Text variant="caption" color="$color3">
                        {formatDate(email.date)}
                      </Text>
                    </HStack>

                    <Text
                      variant="bodySmall"
                      fontWeight={!email.seen ? "600" : "400"}
                      color="$color"
                      numberOfLines={1}
                    >
                      {email.subject || "Sin asunto"}
                    </Text>

                    <Text variant="caption" color="$color3" numberOfLines={2}>
                      {email.text?.substring(0, 100) || ""}
                    </Text>
                  </Stack>

                  {!email.seen && (
                    <YStack
                      width={10}
                      height={10}
                      borderRadius="$full"
                      backgroundColor="$primary"
                      alignSelf="center"
                    />
                  )}
                </HStack>
              </Card>
            ))}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
}
