import React from 'react'
import { YStack, XStack, ScrollView } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../store'
import { ROLE_PERMISSIONS } from '../../constants'
import {
  Text,
  Button,
  IconButton,
  Card,
  ScreenLayout,
  Stack,
  HStack,
} from '../../components/design-system'
import { useResponsive } from '../../components/useResponsive'

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const { user, logout, hasRole } = useAuthStore()
  const { isMobile, spacing, buttonSizes } = useResponsive()

  const permissions = user ? ROLE_PERMISSIONS[user.rol] : null

  const handleNavigateToInstalaciones = () => {
    navigation.navigate('InstalacionesHome')
  }

  const handleNavigateToTickets = () => {
    navigation.navigate('TicketsHome')
  }

  const handleNavigateToChat = () => {
    navigation.navigate('ChatHome')
  }

  const handleNavigateToArchivero = () => {
    navigation.navigate('ArchiveroHome')
  }

  const handleNavigateToUserManagement = () => {
    navigation.navigate('UserManagement')
  }

  const modules = [
    {
      id: 'instalaciones',
      title: 'Instalaciones',
      description: 'Gestiona instalaciones y áreas'
    },
    {
      id: 'tickets',
      title: 'Tickets',
      description: 'Crea, asigna y da seguimiento'
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      description: 'Administra usuarios y roles',
      requiredRole: 'it'
    },
    {
      id: 'reportes',
      title: 'Reportes',
      description: 'Métricas y análisis',
      requiredRole: 'supervisor'
    }
  ]

  return (
    <ScreenLayout>
      {/* Header profesional con gradiente */}
      <Card 
        variant="default" 
        backgroundColor="$primary" 
        padding={isMobile ? '$5' : '$6'} 
        overflow="hidden" 
        position="relative" 
        borderRadius="$xl"
      >
        <YStack position="absolute" right={-20} top={-30} opacity={0.15}>
          <Ionicons name="grid" size={180} color="white" />
        </YStack>

        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <HStack gap="$2" align="center">
              <Text variant="h3" color="white" fontWeight="800" letterSpacing={-0.5}>
                C Ticket
              </Text>
              <Text variant="h6" color="white" opacity={0.8} fontWeight="600">
                STV
              </Text>
            </HStack>
            <Text variant="bodySmall" color="white" opacity={0.75} fontWeight="500">
              Panel de Control
            </Text>
          </Stack>

          <YStack
            width={56}
            height={56}
            borderRadius="$full"
            backgroundColor="rgba(255,255,255,0.2)"
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons name="shield-checkmark" size={32} color="white" />
          </YStack>
        </HStack>
      </Card>

      {/* Usuario Card mejorado */}
      <Card variant="outlined" padding={isMobile ? '$4' : '$5'} borderColor="$borderColor" borderWidth={1.5}>
        <HStack gap="$3">
          <YStack
            width={56}
            height={56}
            borderRadius="$full"
            backgroundColor="$primary"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="white" fontWeight="800" fontSize={22}>
              {user?.nombre?.charAt(0) || 'U'}
            </Text>
          </YStack>

          <Stack flex={1} gap="$1">
            <Text variant="h6" fontWeight="700" color="$color">
              {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
            </Text>
            <HStack gap="$2" align="center">
              <Text variant="bodySmall" color="$color2">
                {user?.Control_Usuario || '---'}
              </Text>
              <XStack backgroundColor="$primary" paddingHorizontal="$3" paddingVertical="$2" borderRadius="$md">
                <Text variant="caption" color="white" fontWeight="600" textTransform="uppercase">
                  {user?.rol || 'Guest'}
                </Text>
              </XStack>
            </HStack>
          </Stack>

          <IconButton
            icon="exit"
            onPress={logout}
            variant="error"
            size={22}
          />
        </HStack>
      </Card>

      {/* Módulos */}
      <Stack gap="$4">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1" letterSpacing={-0.3}>
          Módulos del Sistema
        </Text>

        <Stack gap="$3">
          {/* Instalaciones */}
          <Card
            variant="outlined"
            borderColor="$primary"
            borderWidth={1.5}
            onPress={handleNavigateToInstalaciones}
            padding={isMobile ? '$4' : '$5'}
            pressStyle={{ backgroundColor: '$primaryMuted', scale: 0.98 }}
            borderRadius="$lg"
          >
            <HStack gap="$3">
              <YStack
                backgroundColor="$primary"
                width={isMobile ? '$6' : '$7'}
                height={isMobile ? '$6' : '$7'}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                shadowColor="$primary"
                shadowOpacity={0.3}
                shadowRadius={8}
              >
                <Ionicons name="business" size={isMobile ? 24 : 28} color="white" />
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="h6" fontWeight="700" color="$color">
                  Instalaciones
                </Text>
                <Text variant="bodySmall" color="$color2" lineHeight={18}>
                  Gestiona instalaciones y áreas
                </Text>
              </Stack>

              <Ionicons name="chevron-forward-circle" size={28} color="$primary" />
            </HStack>
          </Card>

          {/* Chat y Mensajería */}
          <Card
            variant="outlined"
            borderColor="$success"
            borderWidth={1.5}
            onPress={handleNavigateToChat}
            padding={isMobile ? '$4' : '$5'}
            pressStyle={{ backgroundColor: '$successMuted', scale: 0.98 }}
            borderRadius="$lg"
          >
            <HStack gap="$3">
              <YStack
                backgroundColor="$success"
                width={isMobile ? '$6' : '$7'}
                height={isMobile ? '$6' : '$7'}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                shadowColor="$success"
                shadowOpacity={0.3}
                shadowRadius={8}
              >
                <Ionicons name="chatbubbles" size={isMobile ? 24 : 28} color="white" />
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="h6" fontWeight="700" color="$color">
                  Chat y Mensajería
                </Text>
                <Text variant="bodySmall" color="$color2" lineHeight={18}>
                  Mensajería privada, grupal y noticias
                </Text>
              </Stack>

              <Ionicons name="chevron-forward-circle" size={28} color="$success" />
            </HStack>
          </Card>

          {/* Archivero */}
          <Card
            variant="outlined"
            borderColor="$secondary"
            borderWidth={1.5}
            onPress={handleNavigateToArchivero}
            padding={isMobile ? '$4' : '$5'}
            pressStyle={{ backgroundColor: '$secondaryMuted', scale: 0.98 }}
            borderRadius="$lg"
          >
            <HStack gap="$3">
              <YStack
                backgroundColor="$secondary"
                width={isMobile ? '$6' : '$7'}
                height={isMobile ? '$6' : '$7'}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                shadowColor="$secondary"
                shadowOpacity={0.3}
                shadowRadius={8}
              >
                <Ionicons name="folder" size={isMobile ? 24 : 28} color="white" />
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="h6" fontWeight="700" color="$color">
                  Archivero
                </Text>
                <Text variant="bodySmall" color="$color2" lineHeight={18}>
                  Gestión documental y archivos
                </Text>
              </Stack>

              <Ionicons name="chevron-forward-circle" size={28} color="$secondary" />
            </HStack>
          </Card>

          {/* Gestión de Usuarios */}
          {hasRole('it') && (
            <Card
              variant="outlined"
              borderColor="$secondary"
              borderWidth={1.5}
              onPress={handleNavigateToUserManagement}
              padding={isMobile ? '$4' : '$5'}
              pressStyle={{ backgroundColor: '$secondaryMuted', scale: 0.98 }}
              borderRadius="$lg"
            >
              <HStack gap="$3">
                <YStack
                  backgroundColor="$secondary"
                  width={isMobile ? '$6' : '$7'}
                  height={isMobile ? '$6' : '$7'}
                  borderRadius="$md"
                  justifyContent="center"
                  alignItems="center"
                  shadowColor="$secondary"
                  shadowOpacity={0.3}
                  shadowRadius={8}
                >
                  <Ionicons name="people" size={isMobile ? 24 : 28} color="white" />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="h6" fontWeight="700" color="$color">
                    Gestión de Usuarios
                  </Text>
                  <Text variant="bodySmall" color="$color2" lineHeight={18}>
                    Administra usuarios y roles
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward-circle" size={28} color="$secondary" />
              </HStack>
            </Card>
          )}

          {/* Tickets */}
          {(hasRole('it') || hasRole('rh') || hasRole('supervisor')) && (
            <Card
              variant="outlined"
              borderColor="$warning"
              borderWidth={1.5}
              onPress={handleNavigateToTickets}
              padding={isMobile ? '$4' : '$5'}
              pressStyle={{ backgroundColor: '$warningMuted', scale: 0.98 }}
              borderRadius="$lg"
            >
              <HStack gap="$3">
                <YStack
                  backgroundColor="$warning"
                  width={isMobile ? '$6' : '$7'}
                  height={isMobile ? '$6' : '$7'}
                  borderRadius="$md"
                  justifyContent="center"
                  alignItems="center"
                  shadowColor="$warning"
                  shadowOpacity={0.3}
                  shadowRadius={8}
                >
                  <Ionicons name="ticket" size={isMobile ? 24 : 28} color="white" />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="h6" fontWeight="700" color="$color">
                    Tickets de Soporte
                  </Text>
                  <Text variant="bodySmall" color="$color2" lineHeight={18}>
                    Crear, asignar y dar seguimiento
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward-circle" size={28} color="$warning" />
              </HStack>
            </Card>
          )}
        </Stack>
      </Stack>

      {/* Permisos */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1" letterSpacing={-0.3}>
          Permisos de tu Rol
        </Text>

        <HStack gap="$2" flexWrap="wrap">
          {permissions && (
            <>
              <PermissionChip label="Crear" active={permissions.create} />
              <PermissionChip label="Leer" active={permissions.read} />
              <PermissionChip label="Actualizar" active={permissions.update} />
              <PermissionChip label="Eliminar" active={permissions.delete} />
            </>
          )}
        </HStack>
      </Stack>

      {/* Footer info */}
      <YStack alignItems="center" paddingVertical="$5" gap="$1">
        <YStack 
          width={60} 
          height={3} 
          backgroundColor="$color4" 
          borderRadius="$full" 
          marginBottom="$3"
          opacity={0.3}
        />
        <Text variant="caption" color="$color3" fontWeight="600">
          C Ticket STV v1.0
        </Text>
        <Text variant="caption" color="$color4">
          Sistema de Gestión de Tickets
        </Text>
      </YStack>
    </ScreenLayout>
  )
}

function PermissionChip({ label, active }: { label: string; active: boolean }) {
  return (
    <XStack
      backgroundColor={active ? '$successMuted' : '$errorMuted'}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$full"
      borderWidth={1.5}
      borderColor={active ? '$success' : '$error'}
      alignItems="center"
      gap="$1.5"
    >
      <Ionicons
        name={active ? "checkmark-circle" : "close-circle"}
        size={14}
        color={active ? '$success' : '$error'}
      />
      <Text
        variant="labelSmall"
        color={active ? '$success' : '$error'}
        fontWeight="700"
      >
        {label}
      </Text>
    </XStack>
  )
}