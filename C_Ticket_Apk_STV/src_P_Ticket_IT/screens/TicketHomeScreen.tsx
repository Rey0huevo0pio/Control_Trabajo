import React from 'react'
import { YStack, XStack } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Button,
  Card,
  ScreenLayout,
  Stack,
  HStack,
} from '../../src/components/design-system'
import { useResponsive } from '../../src/components/useResponsive'

export default function TicketHomeScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()

  const ticketOptions = [
    {
      id: 'crear',
      title: 'Crear Ticket',
      description: 'Registra un nuevo ticket',
      icon: 'add-circle' as const,
      color: '$primary',
      screen: 'CrearTicket'
    },
    {
      id: 'mis-tickets',
      title: 'Mis Tickets',
      description: 'Tickets asignados a ti',
      icon: 'person' as const,
      color: '$secondary',
      screen: 'MisTickets'
    },
    {
      id: 'todos',
      title: 'Todos los Tickets',
      description: 'Lista completa de tickets',
      icon: 'list' as const,
      color: '$warning',
      screen: 'TodosTickets'
    },
    {
      id: 'reportes',
      title: 'Reportes',
      description: 'Estadísticas y métricas',
      icon: 'analytics' as const,
      color: '$success',
      screen: 'ReportesTickets'
    }
  ]

  return (
    <ScreenLayout>
      {/* Header */}
      <Card
        variant="default"
        backgroundColor="$primary"
        padding={isMobile ? '$5' : '$6'}
        overflow="hidden"
        position="relative"
      >
        <YStack position="absolute" right={-20} top={-30} opacity={0.15}>
          <Ionicons name="ticket" size={180} color="white" />
        </YStack>

        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <Text variant="h3" color="white" fontWeight="800">
              Tickets
            </Text>
            <Text variant="bodySmall" color="white" opacity={0.7}>
              Gestión de Tickets STV
            </Text>
          </Stack>

          <YStack
            width={50}
            height={50}
            borderRadius="$full"
            backgroundColor="rgba(255,255,255,0.2)"
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons name="ticket" size={28} color="white" />
          </YStack>
        </HStack>
      </Card>

      {/* Opciones principales */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1">
          Opciones
        </Text>

        <YStack gap="$3">
          {ticketOptions.map((option) => (
            <Card
              key={option.id}
              variant="outlined"
              padding={isMobile ? '$4' : '$5'}
              onPress={() => handleNavigate(option.screen)}
            >
              <HStack gap="$3">
                <YStack
                  backgroundColor={option.color}
                  width={isMobile ? 50 : 60}
                  height={isMobile ? 50 : 60}
                  borderRadius={14}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons
                    name={option.icon}
                    size={isMobile ? 24 : 28}
                    color="white"
                  />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="h6" fontWeight="700" color="$color">
                    {option.title}
                  </Text>
                  <Text variant="bodySmall" color="$color2">
                    {option.description}
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward" size={24} color="$primary" />
              </HStack>
            </Card>
          ))}
        </YStack>
      </Stack>

      {/* Estadísticas rápidas */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1">
          Resumen
        </Text>

        <HStack gap="$3">
          <Card variant="outlined" flex={1} padding="$4" alignItems="center">
            <Text variant="h3" color="$primary" fontWeight="800">
              0
            </Text>
            <Text variant="caption" color="$color2">
              Pendientes
            </Text>
          </Card>

          <Card variant="outlined" flex={1} padding="$4" alignItems="center">
            <Text variant="h3" color="$warning" fontWeight="800">
              0
            </Text>
            <Text variant="caption" color="$color2">
              En Progreso
            </Text>
          </Card>
        </HStack>

        <HStack gap="$3">
          <Card variant="outlined" flex={1} padding="$4" alignItems="center">
            <Text variant="h3" color="$success" fontWeight="800">
              0
            </Text>
            <Text variant="caption" color="$color2">
              Completados
            </Text>
          </Card>

          <Card variant="outlined" flex={1} padding="$4" alignItems="center">
            <Text variant="h3" color="$color" fontWeight="800">
              0
            </Text>
            <Text variant="caption" color="$color2">
              Total
            </Text>
          </Card>
        </HStack>
      </Stack>

      {/* Footer */}
      <YStack alignItems="center" paddingVertical="$4">
        <Text variant="caption" color="$color4">
          Módulo de Tickets v1.0
        </Text>
      </YStack>
    </ScreenLayout>
  )

  function handleNavigate(screen: string) {
    // TODO: Implementar navegación cuando se creen las pantallas
    console.log(`Navegar a: ${screen}`)
  }
}
