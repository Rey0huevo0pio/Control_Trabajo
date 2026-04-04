import React, { useState } from 'react'
import { YStack, ScrollView } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
} from '../../../../src/components/design-system'
import { useResponsive } from '../../../../src/components/useResponsive'

interface Draft {
  id: string
  to: string
  subject: string
  preview: string
  lastModified: string
  avatar: string
}

const mockDrafts: Draft[] = [
  {
    id: '1',
    to: 'equipo@empresa.com',
    subject: 'Propuesta de mejora - Proceso interno',
    preview: 'Estimados, les comparto la propuesta de mejora que hemos estado trabajando...',
    lastModified: 'Hace 2 horas',
    avatar: 'PM'
  },
  {
    id: '2',
    to: 'cliente@ejemplo.com',
    subject: 'Presupuesto proyecto Q2',
    preview: 'Adjunto encontrarán el presupuesto detallado para el segundo trimestre...',
    lastModified: 'Ayer',
    avatar: 'PR'
  }
]

export function DraftsView() {
  const { isMobile } = useResponsive()
  const [drafts, setDrafts] = useState(mockDrafts)

  return (
    <Card variant="outlined" padding="$4">
      <HStack justify="space-between" align="center" marginBottom="$4">
        <Text variant="h5" fontWeight="700" color="$color">
          Borradores
        </Text>
        <HStack gap="$2">
          <IconButton icon="refresh" onPress={() => {}} variant="ghost" size={20} />
        </HStack>
      </HStack>

      {drafts.length === 0 ? (
        <YStack alignItems="center" paddingVertical="$8" gap="$3">
          <Ionicons name="create-outline" size={64} color="$color4" />
          <Text variant="body" color="$color3">
            No hay borradores guardados
          </Text>
        </YStack>
      ) : (
        <ScrollView>
          <YStack gap="$3">
            {drafts.map((draft) => (
              <Card
                key={draft.id}
                variant="outlined"
                padding="$4"
                cursor="pointer"
              >
                <HStack gap="$3">
                  <YStack
                    backgroundColor="$warning"
                    width={48}
                    height={48}
                    borderRadius="$full"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text variant="body" color="white" fontWeight="700">
                      {draft.avatar}
                    </Text>
                  </YStack>

                  <Stack flex={1} gap="$2">
                    <HStack justify="space-between" align="center">
                      <Text variant="body" fontWeight="600" color="$color" flex={1}>
                        {draft.to}
                      </Text>
                      <Text variant="caption" color="$color3">
                        {draft.lastModified}
                      </Text>
                    </HStack>

                    <Text variant="bodySmall" fontWeight="600" color="$color">
                      {draft.subject}
                    </Text>

                    <Text variant="caption" color="$color3" numberOfLines={2}>
                      {draft.preview}
                    </Text>

                    <HStack gap="$2" marginTop="$2">
                      <IconButton icon="create" onPress={() => {}} variant="outline" size={18} />
                      <IconButton icon="trash" onPress={() => {}} variant="outline" size={18} />
                      <IconButton icon="paper-plane" onPress={() => {}} variant="outline" size={18} />
                    </HStack>
                  </Stack>
                </HStack>
              </Card>
            ))}
          </YStack>
        </ScrollView>
      )}
    </Card>
  )
}
