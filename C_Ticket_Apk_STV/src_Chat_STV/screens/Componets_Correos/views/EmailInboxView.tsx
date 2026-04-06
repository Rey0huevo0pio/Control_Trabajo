import React, { useState, useEffect } from 'react'
import { YStack, XStack, ScrollView, Spinner } from 'tamagui'
import { RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
  Button,
} from '../../../../src/components/design-system'
import api, { API_CONFIG, getAuthToken } from '../../../../src/services/api'

export interface Email {
  id: string
  uid: number
  from: string
  to: string
  subject: string
  date: string
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

  const loadEmails = async () => {
    try {
      setError(null)
      const token = getAuthToken()
      if (!token) {
        setError('No hay sesión activa')
        setLoading(false)
        return
      }

      const response = await api.get(API_CONFIG.endpoints.EMAIL_MESSAGES, {
        params: { folder: 'INBOX', page: 1, limit: 50 },
        headers: { Authorization: `Bearer ${token}` },
      })

      let emailsList: Email[] = []
      if (response.data?.success && response.data?.data?.emails) {
        emailsList = response.data.data.emails
      } else if (Array.isArray(response.data?.emails)) {
        emailsList = response.data.emails
      } else if (Array.isArray(response.data)) {
        emailsList = response.data
      }
      
      setEmails(emailsList)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar correos')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadEmails() }, [])

  const onRefresh = () => { setRefreshing(true); loadEmails() }

  const formatDate = (date: string) => {
    if (!date) return ''
    const d = new Date(date)
    const diffMs = Date.now() - d.getTime()
    const diffH = diffMs / (1000 * 60 * 60)
    const diffD = diffMs / (1000 * 60 * 60 * 24)
    if (diffH < 1) return 'Hace min'
    if (diffH < 24) return `${Math.floor(diffH)}h`
    if (diffD < 7) return `${Math.floor(diffD)}d`
    return d.toLocaleDateString()
  }

  const getInitials = (from: string) => {
    const parts = from.split(' ').filter(p => !p.includes('<'))
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0]?.substring(0, 2).toUpperCase() || '?'
  }

  if (loading) {
    return <YStack flex={1} justifyContent="center" alignItems="center" padding="$5"><Spinner size="large" color="$primary" /><Text variant="body" color="$color2" marginTop="$3">Cargando correos reales...</Text></YStack>
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5" gap="$3">
        <Ionicons name="mail-unread" size={48} color="$color3" />
        <Text variant="body" color="$error" textAlign="center">{error}</Text>
        <Button title="Reintentar" icon={"refresh-outline" as any} onPress={loadEmails} variant="primary" size="md" />
      </YStack>
    )
  }

  if (selectedEmail) {
    return (
      <YStack flex={1}>
        <Card backgroundColor="$primary" padding="$4">
          <HStack justify="space-between">
            <IconButton icon="arrow-back" onPress={() => setSelectedEmail(null)} variant="ghost" size={24} />
            <HStack gap="$2">
              <IconButton icon={"reply-outline" as any} onPress={() => {}} variant="ghost" size={24} />
              <IconButton icon={"share-outline" as any} onPress={() => {}} variant="ghost" size={24} />
            </HStack>
          </HStack>
        </Card>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$4">
            <HStack gap="$3">
              <YStack width={50} height={50} borderRadius="$full" backgroundColor="$primary" justifyContent="center" alignItems="center">
                <Text color="white" fontWeight="700" fontSize={18}>{getInitials(selectedEmail.from)}</Text>
              </YStack>
              <Stack flex={1} gap="$1">
                <Text variant="body" fontWeight="700" color="$color">{selectedEmail.from}</Text>
                <Text variant="caption" color="$color3">{new Date(selectedEmail.date).toLocaleString()}</Text>
              </Stack>
            </HStack>
            <Text variant="h5" fontWeight="700" color="$color">{selectedEmail.subject || 'Sin asunto'}</Text>
            <Text variant="body" color="$color" lineHeight={24}>{selectedEmail.text || 'Sin contenido'}</Text>
            {selectedEmail.attachments?.length > 0 && (
              <Stack gap="$2">
                <Text variant="label" color="$color2">📎 Archivos adjuntos ({selectedEmail.attachments.length})</Text>
                {selectedEmail.attachments.map((att: any, i: number) => (
                  <Card key={i} variant="outlined" padding="$3">
                    <HStack gap="$2" align="center">
                      <Ionicons name="attach-outline" size={20} color="$primary" />
                      <Text variant="bodySmall" color="$color" flex={1}>{att.filename || 'archivo'}</Text>
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

  return (
    <YStack flex={1}>
      <Card backgroundColor="$primary" padding="$4">
        <HStack justify="space-between">
          <Text variant="h5" color="white" fontWeight="700">📬 Bandeja de Entrada</Text>
          <IconButton icon={"refresh-outline" as any} onPress={onRefresh} variant="ghost" size={24} />
        </HStack>
        <Text variant="bodySmall" color="rgba(255,255,255,0.7)">{emails.length} correo{emails.length !== 1 ? 's' : ''}</Text>
      </Card>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['$primary']} />}>
        {emails.length === 0 ? (
          <YStack padding="$5" alignItems="center" gap="$3">
            <Ionicons name="mail-open-outline" size={64} color="$color3" />
            <Text variant="h6" color="$color2" textAlign="center">No hay correos reales</Text>
            <Text variant="bodySmall" color="$color3" textAlign="center">Los correos aparecerán aquí cuando el backend los obtenga vía IMAP</Text>
          </YStack>
        ) : (
          <YStack>
            {emails.map((email: Email, index: number) => (
              <Card key={email.id || index} variant="outlined" padding="$3" borderBottomWidth={index < emails.length - 1 ? 1 : 0} borderBottomColor="$border" onPress={() => setSelectedEmail(email)} backgroundColor={!email.seen ? '$primaryMuted' : '$background'}>
                <HStack gap="$3">
                  <YStack width={48} height={48} borderRadius="$full" backgroundColor={!email.seen ? '$primary' : '$background2'} justifyContent="center" alignItems="center">
                    <Text color={!email.seen ? 'white' : '$color2'} fontWeight="700" fontSize={16}>{getInitials(email.from)}</Text>
                  </YStack>
                  <Stack flex={1} gap="$1">
                    <HStack justify="space-between">
                      <Text variant="bodySmall" fontWeight={!email.seen ? '700' : '500'} color="$color" flex={1} numberOfLines={1}>{email.from.split('<')[0].trim()}</Text>
                      <Text variant="caption" color="$color3">{formatDate(email.date)}</Text>
                    </HStack>
                    <Text variant="bodySmall" fontWeight={!email.seen ? '600' : '400'} color="$color" numberOfLines={1}>{email.subject || 'Sin asunto'}</Text>
                    <Text variant="caption" color="$color3" numberOfLines={2}>{email.text?.substring(0, 100) || ''}</Text>
                  </Stack>
                  {!email.seen && <YStack width={10} height={10} borderRadius="$full" backgroundColor="$primary" alignSelf="center" />}
                </HStack>
              </Card>
            ))}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  )
}
