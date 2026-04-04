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

export default function GroupChatsScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()

  // Datos de ejemplo
  const groups = [
    {
      id: '1',
      nombre: 'Equipo de Desarrollo',
      descripcion: 'Chat del equipo técnico',
      miembros: 12,
      ultimoMensaje: 'Deploy completado ✅',
      hora: '11:45',
      noLeidos: 5,
    },
    {
      id: '2',
      nombre: 'Recursos Humanos',
      descripcion: 'Comunicación RRHH',
      miembros: 8,
      ultimoMensaje: 'Nueva política de vacaciones',
      hora: '10:20',
      noLeidos: 0,
    },
    {
      id: '3',
      nombre: 'Seguridad',
      descripcion: 'Equipo de seguridad',
      miembros: 15,
      ultimoMensaje: 'Reporte semanal enviado',
      hora: 'Ayer',
      noLeidos: 0,
    },
  ]

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$secondary" padding={isMobile ? '$4' : '$5'}>
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
                Chats Grupales
              </Text>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
              {groups.length} grupos
            </Text>
          </Stack>

          <IconButton
            icon="add"
            onPress={() => navigation.navigate('CreateGroup')}
            variant="ghost"
            size={24}
          />
        </HStack>
      </Card>

      {/* Lista de grupos */}
      <Stack gap="$2">
        {groups.map((group) => (
          <Card
            key={group.id}
            variant="outlined"
            padding="$4"
            onPress={() => navigation.navigate('ChatConversation', {
              chatId: group.id,
              tipo: 'group',
              nombre: group.nombre,
            })}
          >
            <HStack gap="$3">
              <YStack
                width={56}
                height={56}
                borderRadius={16}
                backgroundColor="$secondary"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="people" size={28} color="white" />
              </YStack>

              <Stack flex={1} gap="$1">
                <HStack justify="space-between">
                  <Text variant="h6" fontWeight="600" color="$color">
                    {group.nombre}
                  </Text>
                  <Text variant="caption" color="$color3">
                    {group.hora}
                  </Text>
                </HStack>
                <Text variant="bodySmall" color="$color3">
                  {group.miembros} miembros
                </Text>
                <HStack justify="space-between" align="center">
                  <Text
                    variant="bodySmall"
                    color={group.noLeidos > 0 ? '$color' : '$color3'}
                    fontWeight={group.noLeidos > 0 ? '600' : '400'}
                  >
                    {group.ultimoMensaje}
                  </Text>
                  {group.noLeidos > 0 && (
                    <YStack
                      backgroundColor="$secondary"
                      minWidth={22}
                      height={22}
                      borderRadius="$full"
                      justifyContent="center"
                      alignItems="center"
                      paddingHorizontal="$2"
                    >
                      <Text variant="caption" color="white" fontWeight="700" fontSize={11}>
                        {group.noLeidos}
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
