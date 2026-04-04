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

interface DeletedEmail {
  id: string
  from: string
  subject: string
  preview: string
  deletedDate: string
  daysRemaining: number
  avatar: string
}

const mockDeleted: DeletedEmail[] = [
  {
    id: '1',
    from: 'newsletter@empresa.com',
    subject: 'Boletín semanal - Noticias del sector',
    preview: 'Las principales noticias de esta semana en el sector empresarial...',
    deletedDate: 'Hace 3 días',
    daysRemaining: 27,
    avatar: 'NL'
  },
  {
    id: '2',
    from: 'notificaciones@sistema.com',
    subject: 'Alerta de seguridad - Inicio de sesión',
    preview: 'Se ha detectado un nuevo inicio de sesión en su cuenta...',
    deletedDate: 'Hace 5 días',
    daysRemaining: 25,
    avatar: 'AS'
  }
]

export function DeletedView() {
  const { isMobile } = useResponsive()
  const [deletedEmails, setDeletedEmails] = useState(mockDeleted)

  const handleRestore = (id: string) => {
    setDeletedEmails(prev => prev.filter(email => email.id !== id))
  }

  const handlePermanentDelete = (id: string) => {
    setDeletedEmails(prev => prev.filter(email => email.id !== id))
  }

  return (
    <Card variant="outlined" padding="$4">
      <HStack justify="space-between" align="center" marginBottom="$4">
        <Text variant="h5" fontWeight="700" color="$color">
          Elementos eliminados
        </Text>
        <HStack gap="$2">
          <IconButton icon="trash-bin-outline" onPress={() => {}} variant="ghost" size={20} />
        </HStack>
      </HStack>

      <YStack
        backgroundColor="$error10"
        padding="$3"
        borderRadius="$2"
        marginBottom="$4"
      >
        <HStack gap="$2" align="center">
          <Ionicons name="warning" size={18} color="$error" />
          <Text variant="caption" color="$error">
            Los elementos se eliminan permanentemente después de 30 días
          </Text>
        </HStack>
      </YStack>

      {deletedEmails.length === 0 ? (
        <YStack alignItems="center" paddingVertical="$8" gap="$3">
          <Ionicons name="trash-outline" size={64} color="$color4" />
          <Text variant="body" color="$color3">
            Papelera vacía
          </Text>
        </YStack>
      ) : (
        <ScrollView>
          <YStack gap="$3">
            {deletedEmails.map((email) => (
              <Card
                key={email.id}
                variant="outlined"
                padding="$4"
                borderColor="$error30"
              >
                <HStack gap="$3">
                  <YStack
                    backgroundColor="$error"
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
                      <Text variant="body" fontWeight="600" color="$color" flex={1}>
                        {email.from}
                      </Text>
                      <Text variant="caption" color="$color3">
                        {email.deletedDate}
                      </Text>
                    </HStack>

                    <Text variant="bodySmall" color="$color">
                      {email.subject}
                    </Text>

                    <Text variant="caption" color="$color3" numberOfLines={2}>
                      {email.preview}
                    </Text>

                    <YStack
                      backgroundColor="$warning10"
                      padding="$2"
                      borderRadius="$1"
                      marginTop="$1"
                    >
                      <Text variant="caption" color="$warning">
                        Se eliminará en {email.daysRemaining} días
                      </Text>
                    </YStack>

                    <HStack gap="$2" marginTop="$2">
                      <IconButton 
                        icon="arrow-undo-outline" 
                        onPress={() => handleRestore(email.id)} 
                        variant="outline" 
                        size={18}
                      />
                      <Text variant="caption" color="$color2">
                        Restaurar
                      </Text>
                      <IconButton 
                        icon="trash" 
                        onPress={() => handlePermanentDelete(email.id)} 
                        variant="outline" 
                        size={18}
                      />
                      <Text variant="caption" color="$error">
                        Eliminar permanentemente
                      </Text>
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
