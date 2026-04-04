import React from 'react'
import { YStack } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  IconButton,
} from '../../src/components/design-system'
import { useResponsive } from '../../src/components/useResponsive'

export default function PrivateChatsScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()

  // Datos de ejemplo - luego vendrán de la API
  const conversations = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      avatar: undefined,
      ultimoMensaje: 'Hola, ¿cómo estás?',
      hora: '10:30',
      noLeidos: 2,
      enLinea: true,
    },
    {
      id: '2',
      nombre: 'María García',
      avatar: undefined,
      ultimoMensaje: 'Te envié el archivo',
      hora: '09:15',
      noLeidos: 0,
      enLinea: false,
    },
    {
      id: '3',
      nombre: 'Carlos López',
      avatar: undefined,
      ultimoMensaje: 'Perfecto, nos vemos mañana',
      hora: 'Ayer',
      noLeidos: 0,
      enLinea: false,
    },
  ]

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$primary" padding={isMobile ? '$4' : '$5'}>
        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <HStack gap="$2" align="center">
              <IconButton
                icon="arrow-back"
                onPress={() => navigation.goBack()}
                variant="ghost"
                size={24}
              />
              <Text variant="h4" color="white" fontWeight="700">
                Mensajería Privada
              </Text>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
              {conversations.length} conversaciones
            </Text>
          </Stack>

          <IconButton
            icon="create"
            onPress={() => {}}
            variant="ghost"
            size={24}
          />
        </HStack>
      </Card>

      {/* Lista de conversaciones */}
      <Stack gap="$2">
        {conversations.map((conv) => (
          <Card
            key={conv.id}
            variant="outlined"
            padding="$4"
            onPress={() => navigation.navigate('ChatConversation', {
              chatId: conv.id,
              tipo: 'private',
              nombre: conv.nombre,
            })}
          >
            <HStack gap="$3">
              <YStack position="relative">
                <YStack
                  width={56}
                  height={56}
                  borderRadius="$full"
                  backgroundColor="$primary"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="white" fontWeight="700" fontSize={20}>
                    {conv.nombre.charAt(0)}
                  </Text>
                </YStack>
                {conv.enLinea && (
                  <YStack
                    position="absolute"
                    bottom={0}
                    right={0}
                    width={14}
                    height={14}
                    borderRadius="$full"
                    backgroundColor="$success"
                    borderWidth={2}
                    borderColor="$background"
                  />
                )}
              </YStack>

              <Stack flex={1} gap="$1">
                <HStack justify="space-between">
                  <Text variant="h6" fontWeight="600" color="$color">
                    {conv.nombre}
                  </Text>
                  <Text variant="caption" color="$color3">
                    {conv.hora}
                  </Text>
                </HStack>
                <HStack justify="space-between" align="center">
                  <Text
                    variant="bodySmall"
                    color={conv.noLeidos > 0 ? '$color' : '$color3'}
                    fontWeight={conv.noLeidos > 0 ? '600' : '400'}
                  >
                    {conv.ultimoMensaje}
                  </Text>
                  {conv.noLeidos > 0 && (
                    <YStack
                      backgroundColor="$primary"
                      minWidth={22}
                      height={22}
                      borderRadius="$full"
                      justifyContent="center"
                      alignItems="center"
                      paddingHorizontal="$2"
                    >
                      <Text variant="caption" color="white" fontWeight="700" fontSize={11}>
                        {conv.noLeidos}
                      </Text>
                    </YStack>
                  )}
                </HStack>
              </Stack>
            </HStack>
          </Card>
        ))}
      </Stack>
    </ScreenLayout>
  )
}
