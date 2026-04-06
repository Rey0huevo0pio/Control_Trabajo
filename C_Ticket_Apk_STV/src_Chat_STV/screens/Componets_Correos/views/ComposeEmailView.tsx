import React, { useState } from 'react'
import { YStack, XStack, Input, ScrollView, Spinner } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
  Button,
} from '../../../../src/components/design-system'
import { emailMessagesService, SendEmailData } from '../../../services/emailMessages.service'

interface ComposeEmailViewProps {
  onBack: () => void
  onSuccess: () => void
  toEmail?: string
  subject?: string
}

export function ComposeEmailView({ onBack, onSuccess, toEmail, subject }: ComposeEmailViewProps) {
  const [loading, setLoading] = useState(false)
  const [to, setTo] = useState(toEmail || '')
  const [emailSubject, setEmailSubject] = useState(subject || '')
  const [message, setMessage] = useState('')
  const [cc, setCc] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSend = async () => {
    setError(null)
    setSuccess(null)

    if (!to) {
      setError('El destinatario es obligatorio')
      return
    }
    if (!emailSubject) {
      setError('El asunto es obligatorio')
      return
    }
    if (!message) {
      setError('El mensaje no puede estar vacío')
      return
    }

    try {
      setLoading(true)
      const emailData: SendEmailData = {
        to,
        subject: emailSubject,
        html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        text: message,
        cc: cc || undefined,
      }

      const result = await emailMessagesService.sendEmail(emailData)
      
      if (result.success) {
        setSuccess('✅ Correo enviado correctamente')
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        setError(result.error || 'Error al enviar correo')
      }
    } catch (err: any) {
      setError(err.message || 'Error al enviar correo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack flex={1}>
      {/* Header */}
      <Card backgroundColor="$primary" padding="$4">
        <HStack justify="space-between">
          <IconButton
            icon="arrow-back"
            onPress={onBack}
            variant="ghost"
            size={24}
          />
          <Text variant="h5" color="white" fontWeight="700">
            ✉️ Redactar Correo
          </Text>
          <Button
            title={loading ? 'Enviando...' : 'Enviar'}
            icon={"send" as any}
            onPress={handleSend}
            disabled={loading}
            variant="ghost"
            size="sm"
          />
        </HStack>
      </Card>

      {error && (
        <Card backgroundColor="$errorMuted" borderColor="$error" borderWidth={1} padding="$3" margin="$3">
          <Text color="$error" fontWeight="600">⚠️ {error}</Text>
        </Card>
      )}

      {success && (
        <Card backgroundColor="$successMuted" borderColor="$success" borderWidth={1} padding="$3" margin="$3">
          <Text color="$success" fontWeight="600">{success}</Text>
        </Card>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$3" gap="$3">
          {/* Para */}
          <InputField label="Para" icon="mail-outline">
            <Input
              placeholder="destinatario@email.com"
              value={to}
              onChangeText={setTo}
              keyboardType="email-address"
              autoCapitalize="none"
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              height={50}
              paddingHorizontal="$3"
            />
          </InputField>

          {/* CC */}
          <InputField label="CC (opcional)" icon="copy-outline">
            <Input
              placeholder="copia@email.com"
              value={cc}
              onChangeText={setCc}
              keyboardType="email-address"
              autoCapitalize="none"
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              height={50}
              paddingHorizontal="$3"
            />
          </InputField>

          {/* Asunto */}
          <InputField label="Asunto" icon="create-outline">
            <Input
              placeholder="Asunto del correo"
              value={emailSubject}
              onChangeText={setEmailSubject}
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              height={50}
              paddingHorizontal="$3"
            />
          </InputField>

          {/* Mensaje */}
          <InputField label="Mensaje" icon="chatbubble-outline">
            <Input
              placeholder="Escribe tu mensaje aquí..."
              value={message}
              onChangeText={setMessage}
              multiline
              minHeight={200}
              textAlignVertical="top"
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              padding="$3"
              fontSize={16}
            />
          </InputField>

          {/* Botón Enviar */}
          <Button
            title={loading ? 'Enviando...' : '📤 Enviar Correo'}
            icon={"send" as any}
            onPress={handleSend}
            disabled={loading}
            variant="primary"
            size="lg"
            fullWidth
          />
        </YStack>
      </ScrollView>
    </YStack>
  )
}

function InputField({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2">
      <HStack gap="$2" align="center">
        {icon && <Ionicons name={icon as any} size={16} color="$color2" />}
        <Text variant="label" color="$color2">
          {label}
        </Text>
      </HStack>
      {children}
    </YStack>
  )
}
