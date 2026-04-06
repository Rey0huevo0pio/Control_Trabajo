import React, { useState, useEffect } from 'react'
import { YStack, XStack, ScrollView, Spinner, RefreshControl } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
  Button,
} from '../../../../components/design-system'
import api, { API_CONFIG, getAuthToken } from '../../../../services/api'

export interface Email {
  id: string
  uid: number
  from: string
  to: string
  subject: string
  date: Date
  text: string
  html: string
  attachments: any[]
  seen: boolean
  flagged: boolean
}

export function EmailInboxView() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  // ==========================================
  // CARGAR CORREOS
  // ==========================================
  const loadEmails = async () => {
    try {
      setError(null)
      const token = getAuthToken()
      if (!token) {
        setError('No hay sesión activa')
        return
      }

      const response = await api.get(API_CONFIG.endpoints.EMAIL_MESSAGES, {
        params: {
          folder: 'INBOX',
          page: 1,
          limit: 50,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setEmails(response.data.data.emails || [])
      }
    } catch (err: any) {
      console.error('Error cargando correos:', err)
      setError(err.response?.data?.message || 'Error al cargar correos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadEmails()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadEmails()
  }

  // ==========================================
  // FORMATEAR FECHA
  // ==========================================
  const formatDate = (date: Date) => {
    const emailDate = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - emailDate.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffHours < 1) {
      return 'Hace minutos'
    } else if (diffHours < 24) {
      return `Hace ${Math.floor(diffHours)}h`
    } else if (diffDays < 7) {
      return `Hace ${Math.floor(diffDays)}d`
    } else {
      return emailDate.toLocaleDateString()
    }
  }

  // ==========================================
  // OBTENER INICIALES DEL REMITENTE
  // ==========================================
  const getSenderInitials = (from: string) => {
    const parts = from.split(' ').filter(p => !p.includes('<'))
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0]?.substring(0, 2).toUpperCase() || '?'
  }

  // ==========================================
  // RENDER
  // ==========================================
  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5">
        <Spinner size="large" color="$primary" />
        <Text variant="body" color="$color2" marginTop="$3">
          Cargando correos...
        </Text>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5" gap="$3">
        <Ionicons name="mail-unread" size={48} color="$color3" />
        <Text variant="body" color="$error" textAlign="center">
          {error}
        </Text>
        <Button
          title="Reintentar"
          icon={"refresh-outline" as any}
          onPress={loadEmails}
          variant="primary"
          size="md"
        />
      </YStack>
    )
  }

  // Vista de correo seleccionado
  if (selectedEmail) {
    return (
      <YStack flex={1}>
        {/* Header del correo */}
        <Card backgroundColor="$primary" padding="$4">
          <HStack justify="space-between">
            <IconButton
              icon="arrow-back"
              onPress={() => setSelectedEmail(null)}
              variant="ghost"
              size={24}
            />
            <HStack gap="$2">
              <IconButton icon={"reply-outline" as any} onPress={() => {}} variant="ghost" size={24} />
              <IconButton icon={"share-outline" as any} onPress={() => {}} variant="ghost" size={24} />
            </HStack>
          </HStack>
        </Card>

        {/* Contenido del correo */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$4">
            {/* Info del remitente */}
            <HStack gap="$3">
              <YStack
                width={50}
                height={50}
                borderRadius="$full"
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="white" fontWeight="700" fontSize={18}>
                  {getSenderInitials(selectedEmail.from)}
                </Text>
              </YStack>
              <Stack flex={1} gap="$1">
                <Text variant="body" fontWeight="700" color="$color">
                  {selectedEmail.from}
                </Text>
                <Text variant="caption" color="$color3">
                  {new Date(selectedEmail.date).toLocaleString()}
                </Text>
              </Stack>
            </HStack>

            {/* Asunto */}
            <Text variant="h5" fontWeight="700" color="$color">
              {selectedEmail.subject || 'Sin asunto'}
            </Text>

            {/* Cuerpo del mensaje */}
            <Text variant="body" color="$color" lineHeight={24}>
              {selectedEmail.text || 'Sin contenido'}
            </Text>

            {/* Adjuntos */}
            {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
              <Stack gap="$2">
                <Text variant="label" color="$color2">
                  📎 Archivos adjuntos ({selectedEmail.attachments.length})
                </Text>
                {selectedEmail.attachments.map((att, i) => (
                  <Card key={i} variant="outlined" padding="$3">
                    <HStack gap="$2" align="center">
                      <Ionicons name="attach-outline" size={20} color="$primary" />
                      <Text variant="bodySmall" color="$color" flex={1}>
                        {att.filename || 'archivo'}
                      </Text>
                      <IconButton icon={"download-outline" as any} onPress={() => {}} variant="ghost" size={20} />
                    </HStack>
                  </Card>
                ))}
              </Stack>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    )
  }

  // Lista de correos
  return (
    <YStack flex={1}>
      {/* Header de bandeja */}
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
          {emails.length} correo{emails.length !== 1 ? 's' : ''}
        </Text>
      </Card>

      {/* Lista de correos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['$primary']}
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
            {emails.map((email, index) => (
              <Card
                key={email.id || index}
                variant="outlined"
                padding="$3"
                borderBottomWidth={index < emails.length - 1 ? 1 : 0}
                borderBottomColor="$border"
                onPress={() => setSelectedEmail(email)}
                backgroundColor={!email.seen ? '$primaryMuted' : '$background'}
              >
                <HStack gap="$3">
                  {/* Avatar del remitente */}
                  <YStack
                    width={48}
                    height={48}
                    borderRadius="$full"
                    backgroundColor={!email.seen ? '$primary' : '$background2'}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text
                      color={!email.seen ? 'white' : '$color2'}
                      fontWeight="700"
                      fontSize={16}
                    >
                      {getSenderInitials(email.from)}
                    </Text>
                  </YStack>

                  {/* Info del correo */}
                  <Stack flex={1} gap="$1">
                    <HStack justify="space-between">
                      <Text
                        variant="bodySmall"
                        fontWeight={!email.seen ? '700' : '500'}
                        color="$color"
                        flex={1}
                        numberOfLines={1}
                      >
                        {email.from.split('<')[0].trim()}
                      </Text>
                      <Text variant="caption" color="$color3">
                        {formatDate(email.date)}
                      </Text>
                    </HStack>

                    <Text
                      variant="bodySmall"
                      fontWeight={!email.seen ? '600' : '400'}
                      color="$color"
                      numberOfLines={1}
                    >
                      {email.subject || 'Sin asunto'}
                    </Text>

                    <Text
                      variant="caption"
                      color="$color3"
                      numberOfLines={2}
                    >
                      {email.text?.substring(0, 100) || ''}
                    </Text>
                  </Stack>

                  {/* Indicador de no leído */}
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
  )
}
