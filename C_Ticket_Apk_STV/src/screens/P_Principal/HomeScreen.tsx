import React from 'react'
import { YStack, XStack, Avatar } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { useWindowDimensions } from 'react-native'
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
  const { width } = useWindowDimensions()
  const { isMobile } = useResponsive()

  const permissions = user ? ROLE_PERMISSIONS[user.rol] : null

  const handleNavigateToInstalaciones = () => {
    navigation.navigate('InstalacionesHome')
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
      {/* Header profesional */}
      <Card variant="default" backgroundColor="$primary" padding={isMobile ? '$5' : '$6'} overflow="hidden" position="relative">
        <YStack position="absolute" right={-20} top={-30} opacity={0.15}>
          <Ionicons name="grid" size={180} color="white" />
        </YStack>

        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <HStack gap="$2" align="center">
              <Text variant="h3" color="white" fontWeight="800">
                C Ticket
              </Text>
              <Text variant="h6" color="white" opacity={0.8}>
                STV
              </Text>
            </HStack>
            <Text variant="bodySmall" color="white" opacity={0.7}>
              Panel de Control
            </Text>
          </Stack>

          <Avatar circular size="$7" backgroundColor="white" opacity={0.2}>
            <Ionicons name="shield" size={32} color="white" />
          </Avatar>
        </HStack>
      </Card>

      {/* Usuario Card */}
      <Card variant="outlined" padding={isMobile ? '$4' : '$5'}>
        <HStack gap="$3">
          <Avatar circular size="$6" backgroundColor="$primary">
            <Text color="white" fontWeight="700" fontSize={18}>
              {user?.nombre?.charAt(0) || 'U'}
            </Text>
          </Avatar>

          <Stack flex={1} gap="$1">
            <Text variant="h6" fontWeight="700" color="$color">
              {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
            </Text>
            <HStack gap="$2" align="center">
              <Text variant="bodySmall" color="$color2">
                {user?.Control_Usuario || '---'}
              </Text>
              <XStack backgroundColor="$primary" paddingHorizontal="$3" paddingVertical="$2" borderRadius={8}>
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
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1">
          Módulos
        </Text>

        <Stack gap="$3">
          <Card
            variant="outlined"
            borderColor="$primary"
            onPress={handleNavigateToInstalaciones}
            padding={isMobile ? '$4' : '$5'}
          >
            <HStack gap="$3">
              <YStack
                backgroundColor="$primary"
                width={isMobile ? 50 : 60}
                height={isMobile ? 50 : 60}
                borderRadius={14}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="business" size={isMobile ? 24 : 28} color="white" />
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="h6" fontWeight="700" color="$color">
                  Instalaciones
                </Text>
                <Text variant="bodySmall" color="$color2">
                  Gestiona instalaciones y áreas
                </Text>
              </Stack>

              <Ionicons name="chevron-forward" size={24} color="$primary" />
            </HStack>
          </Card>

          {hasRole('it') && (
            <Card variant="outlined" padding={isMobile ? '$4' : '$5'}>
              <HStack gap="$3">
                <YStack
                  backgroundColor="$secondary"
                  width={isMobile ? 50 : 60}
                  height={isMobile ? 50 : 60}
                  borderRadius={14}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name="people" size={isMobile ? 24 : 28} color="white" />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="h6" fontWeight="700" color="$color">
                    Gestión de Usuarios
                  </Text>
                  <Text variant="bodySmall" color="$color2">
                    Administra usuarios y roles
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward" size={24} color="$color3" />
              </HStack>
            </Card>
          )}

          {(hasRole('it') || hasRole('rh') || hasRole('supervisor')) && (
            <Card variant="outlined" padding={isMobile ? '$4' : '$5'}>
              <HStack gap="$3">
                <YStack
                  backgroundColor="$warning"
                  width={isMobile ? 50 : 60}
                  height={isMobile ? 50 : 60}
                  borderRadius={14}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name="ticket" size={isMobile ? 24 : 28} color="white" />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="h6" fontWeight="700" color="$color">
                    Tickets
                  </Text>
                  <Text variant="bodySmall" color="$color2">
                    Crear, asignar y dar seguimiento
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward" size={24} color="$color3" />
              </HStack>
            </Card>
          )}
        </Stack>
      </Stack>

      {/* Permisos */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1">
          Permisos
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
      <YStack alignItems="center" paddingVertical="$4">
        <Text variant="caption" color="$color4">
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
      borderRadius={10}
      borderWidth={1}
      borderColor={active ? '$success' : '$error'}
    >
      <Text
        variant="labelSmall"
        color={active ? '$success' : '$error'}
      >
        {active ? '✓' : '✗'} {label}
      </Text>
    </XStack>
  )
}