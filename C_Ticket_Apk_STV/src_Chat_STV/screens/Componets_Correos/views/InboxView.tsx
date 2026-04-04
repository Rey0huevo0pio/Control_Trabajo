import React, { useState } from 'react'
import { YStack, ScrollView } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  IconButton,
} from '../../../../src/components/design-system'
import { useResponsive } from '../../../../src/components/useResponsive'

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  read: boolean
  hasAttachment: boolean
  avatar: string
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'Juan Pérez',
    subject: 'Reunión de proyecto - Actualización',
    preview: 'Hola equipo, les escribo para actualizarles sobre el progreso del proyecto...',
    date: '10:30 AM',
    read: false,
    hasAttachment: true,
    avatar: 'JP'
  },
  {
    id: '2',
    from: 'María González',
    subject: 'Reporte mensual de ventas',
    preview: 'Adjunto encontrarán el reporte correspondiente al mes de marzo...',
    date: '9:15 AM',
    read: false,
    hasAttachment: true,
    avatar: 'MG'
  },
  {
    id: '3',
    from: 'Soporte TI',
    subject: 'Mantenimiento programado del servidor',
    preview: 'Les informamos que el día sábado se realizará mantenimiento...',
    date: 'Ayer',
    read: true,
    hasAttachment: false,
    avatar: 'TI'
  },
  {
    id: '4',
    from: 'Recursos Humanos',
    preview: 'Estimados colaboradores, les recordamos que la fecha límite...',
    subject: 'Recordatorio: Entrega de documentos',
    date: 'Ayer',
    read: true,
    hasAttachment: false,
    avatar: 'RH'
  },
  {
    id: '5',
    from: 'Carlos Ramírez',
    subject: 'Propuesta de nuevo cliente',
    preview: 'Les comparto la propuesta que preparamos para el cliente XYZ...',
    date: 'Lun',
    read: true,
    hasAttachment: true,
    avatar: 'CR'
  }
]

export function InboxView() {
  const { isMobile } = useResponsive()
  const [emails, setEmails] = useState(mockEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  if (selectedEmail) {
    return (
      <EmailDetail
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
      />
    )
  }

  return (
    <Card variant="outlined" padding="$4">
      <HStack justify="space-between" align="center" marginBottom="$4">
        <Text variant="h5" fontWeight="700" color="$color">
          Bandeja de entrada
        </Text>
        <HStack gap="$2">
          <IconButton icon="refresh" onPress={() => {}} variant="ghost" size={20} />
          <IconButton icon="filter" onPress={() => {}} variant="ghost" size={20} />
        </HStack>
      </HStack>

      <ScrollView>
        <YStack gap="$3">
          {emails.map((email) => (
            <Card
              key={email.id}
              variant="outlined"
              padding="$4"
              onPress={() => setSelectedEmail(email)}
              backgroundColor={email.read ? '$background' : '$info10'}
              borderColor={email.read ? '$border' : '$info'}
              cursor="pointer"
            >
              <HStack gap="$3">
                <YStack
                  backgroundColor="$info"
                  width={48}
                  height={48}
                  borderRadius="$full"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text variant="body" color="white" fontWeight="700">
                    {email.avatar}
                  </Text>
                </YStack>

                <Stack flex={1} gap="$2">
                  <HStack justify="space-between" align="center">
                    <Text
                      variant="body"
                      fontWeight={email.read ? '500' : '700'}
                      color="$color"
                      flex={1}
                    >
                      {email.from}
                    </Text>
                    <Text variant="caption" color="$color3">
                      {email.date}
                    </Text>
                  </HStack>

                  <Text
                    variant="bodySmall"
                    fontWeight={email.read ? '400' : '600'}
                    color="$color"
                  >
                    {email.subject}
                  </Text>

                  <Text variant="caption" color="$color3" numberOfLines={2}>
                    {email.preview}
                  </Text>

                  <HStack gap="$2" marginTop="$1">
                    {email.hasAttachment && (
                      <HStack gap="$1" align="center">
                        <Ionicons name="attach" size={14} color="$color3" />
                        <Text variant="caption" color="$color3">
                          Adjunto
                        </Text>
                      </HStack>
                    )}
                  </HStack>
                </Stack>

                {!email.read && (
                  <YStack
                    width={10}
                    height={10}
                    borderRadius="$full"
                    backgroundColor="$info"
                    alignSelf="center"
                  />
                )}
              </HStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </Card>
  )
}

function EmailDetail({ email, onBack }: { email: Email; onBack: () => void }) {
  return (
    <Card variant="outlined" padding="$4">
      <HStack gap="$3" align="center" marginBottom="$4">
        <IconButton icon="arrow-back-outline" onPress={onBack} variant="ghost" size={24} />
        <Text variant="h5" fontWeight="700" color="$color" flex={1}>
          {email.subject}
        </Text>
      </HStack>

      <HStack gap="$3" marginBottom="$4">
        <YStack
          backgroundColor="$info"
          width={56}
          height={56}
          borderRadius="$full"
          justifyContent="center"
          alignItems="center"
        >
          <Text variant="h6" color="white" fontWeight="700">
            {email.avatar}
          </Text>
        </YStack>

        <Stack flex={1} gap="$1">
          <Text variant="body" fontWeight="700" color="$color">
            {email.from}
          </Text>
          <Text variant="caption" color="$color3">
            {email.date}
          </Text>
        </Stack>
      </HStack>

      <YStack
        borderTopWidth={1}
        borderTopColor="$border"
        paddingTop="$4"
        gap="$3"
      >
        <Text variant="body" color="$color">
          {email.preview}
        </Text>
        <Text variant="body" color="$color">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </Text>
        <Text variant="body" color="$color">
          Saludos cordiales,
        </Text>
      </YStack>

      <HStack gap="$2" marginTop="$4" paddingTop="$4" borderTopWidth={1} borderTopColor="$border">
        <IconButton icon="mail" onPress={() => {}} variant="outline" size={20} />
        <IconButton icon="mail-unread" onPress={() => {}} variant="outline" size={20} />
        <IconButton icon="share" onPress={() => {}} variant="outline" size={20} />
        <IconButton icon="trash" onPress={() => {}} variant="outline" size={20} />
      </HStack>
    </Card>
  )
}
