import React from 'react'
import { YStack, XStack, Text, Card, Button, ScrollView, Avatar } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../store'
import { ROLE_PERMISSIONS } from '../../constants'

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const { user, logout, hasRole } = useAuthStore()
  const { width } = useWindowDimensions()

  const permissions = user ? ROLE_PERMISSIONS[user.rol] : null
  const isMobile = width < 480

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
    <ScrollView
      flex={1}
      backgroundColor="$background"
      showsVerticalScrollIndicator={false}
    >
      <YStack
        flex={1}
        backgroundColor="$background"
        padding={isMobile ? '$3' : '$4'}
        gap="$4"
      >
        {/* Header profesional */}
        <Card
          backgroundColor="$primary"
          borderRadius={20}
          padding={isMobile ? '$4' : '$5'}
          overflow="hidden"
          position="relative"
        >
          <YStack position="absolute" right={-20} top={-30} opacity={0.15}>
            <Ionicons name="grid" size={180} color="white" />
          </YStack>
          
          <XStack justifyContent="space-between" alignItems="center">
            <YStack flex={1} gap="$2">
              <XStack alignItems="center" gap="$2">
                <Text fontSize={isMobile ? '$7' : '$8'} fontWeight="800" color="white">
                  C Ticket
                </Text>
                <Text fontSize={isMobile ? '$4' : '$5'} color="white" opacity={0.8}>
                  STV
                </Text>
              </XStack>
              <Text fontSize={isMobile ? '$2' : '$3'} color="white" opacity={0.7}>
                Panel de Control
              </Text>
            </YStack>

            <Avatar circular size={isMobile ? '$6' : '$7'} backgroundColor="white" opacity={0.2}>
              <Ionicons name="shield" size={isMobile ? 28 : 32} color="white" />
            </Avatar>
          </XStack>
        </Card>

        {/* Usuario Card */}
        <Card
          backgroundColor="$background"
          borderRadius={16}
          padding={isMobile ? '$3' : '$4'}
          borderColor="$borderColor"
          borderWidth={1}
          shadowColor="$shadowColor"
          shadowOpacity={0.05}
          shadowRadius={8}
        >
          <XStack alignItems="center" gap="$3">
            <Avatar circular size={isMobile ? '$5' : '$6'} backgroundColor="$primary">
              <Text color="white" fontWeight="700" fontSize={isMobile ? 14 : 16}>
                {user?.nombre?.charAt(0) || 'U'}
              </Text>
            </Avatar>
            
            <YStack flex={1} gap="$1">
              <Text fontSize={isMobile ? '$4' : '$5'} fontWeight="700" color="$color">
                {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
              </Text>
              <XStack gap="$2" alignItems="center">
                <Text fontSize={isMobile ? '$2' : '$3'} color="$color2">
                  {user?.Control_Usuario || '---'}
                </Text>
                <XStack backgroundColor="$primary" paddingHorizontal="$2" paddingVertical="$1" borderRadius={6}>
                  <Text fontSize={isMobile ? '$1' : '$2'} color="white" fontWeight="600" textTransform="uppercase">
                    {user?.rol || 'Guest'}
                  </Text>
                </XStack>
              </XStack>
            </YStack>

            <Button
              onPress={logout}
              backgroundColor="$error"
              borderRadius={10}
              size={isMobile ? '$3' : '$2'}
              pressStyle={{ opacity: 0.8 }}
            >
              <Ionicons name="exit" size={isMobile ? 18 : 20} color="white" />
            </Button>
          </XStack>
        </Card>

        {/* Módulos */}
        <YStack gap="$3">
          <Text fontSize={isMobile ? 18 : 20} fontWeight="700" color="$color" paddingHorizontal="$1">
            Módulos
          </Text>

          <YStack gap="$3">
            <Card
              backgroundColor="$background"
              borderRadius={16}
              padding={isMobile ? '$3' : '$4'}
              borderColor="$primary"
              borderWidth={2}
              shadowColor="$primary"
              shadowOpacity={0.15}
              shadowRadius={10}
              onPress={handleNavigateToInstalaciones}
              pressStyle={{ opacity: 0.9 }}
            >
              <XStack alignItems="center" gap="$3">
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

                <YStack flex={1} gap="$1">
                  <Text fontSize={isMobile ? '$4' : '$5'} fontWeight="700" color="$color">
                    Instalaciones
                  </Text>
                  <Text fontSize={isMobile ? '$2' : '$3'} color="$color2">
                    Gestiona instalaciones y áreas
                  </Text>
                </YStack>

                <Ionicons name="chevron-forward" size={24} color="$primary" />
              </XStack>
            </Card>

            {hasRole('it') && (
              <Card
                backgroundColor="$background2"
                borderRadius={16}
                padding={isMobile ? '$3' : '$4'}
                borderColor="$borderColor"
                borderWidth={1}
              >
                <XStack alignItems="center" gap="$3">
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

                  <YStack flex={1} gap="$1">
                    <Text fontSize={isMobile ? '$4' : '$5'} fontWeight="700" color="$color">
                      Gestión de Usuarios
                    </Text>
                    <Text fontSize={isMobile ? '$2' : '$3'} color="$color2">
                      Administra usuarios y roles
                    </Text>
                  </YStack>

                  <Ionicons name="chevron-forward" size={24} color="$color3" />
                </XStack>
              </Card>
            )}

            {(hasRole('it') || hasRole('rh') || hasRole('supervisor')) && (
              <Card
                backgroundColor="$background2"
                borderRadius={16}
                padding={isMobile ? '$3' : '$4'}
                borderColor="$borderColor"
                borderWidth={1}
              >
                <XStack alignItems="center" gap="$3">
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

                  <YStack flex={1} gap="$1">
                    <Text fontSize={isMobile ? '$4' : '$5'} fontWeight="700" color="$color">
                      Tickets
                    </Text>
                    <Text fontSize={isMobile ? '$2' : '$3'} color="$color2">
                      Crear, asignar y dar seguimiento
                    </Text>
                  </YStack>

                  <Ionicons name="chevron-forward" size={24} color="$color3" />
                </XStack>
              </Card>
            )}
          </YStack>
        </YStack>

        {/* Permisos */}
        <YStack gap="$3">
          <Text fontSize={isMobile ? 18 : 20} fontWeight="700" color="$color" paddingHorizontal="$1">
            Permisos
          </Text>

          <XStack gap="$2" flexWrap="wrap">
            {permissions && (
              <>
                <PermissionChip label="Crear" active={permissions.create} />
                <PermissionChip label="Leer" active={permissions.read} />
                <PermissionChip label="Actualizar" active={permissions.update} />
                <PermissionChip label="Eliminar" active={permissions.delete} />
              </>
            )}
          </XStack>
        </YStack>

        {/* Footer info */}
        <YStack alignItems="center" paddingVertical="$4">
          <Text fontSize={isMobile ? '$1' : '$2'} color="$color4">
            C Ticket STV v1.0
          </Text>
          <Text fontSize={isMobile ? '$1' : '$2'} color="$color5">
            Sistema de Gestión de Tickets
          </Text>
        </YStack>
      </YStack>
    </ScrollView>
  )
}

function PermissionChip({ label, active }: { label: string; active: boolean }) {
  return (
    <XStack
      backgroundColor={active ? '$success' : '$error'}
      opacity={active ? 0.15 : 0.1}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={10}
      borderWidth={1}
      borderColor={active ? '$success' : '$error'}
    >
      <Text
        color={active ? '$success' : '$error'}
        fontWeight="700"
        fontSize="$2"
      >
        {active ? '✓' : '✗'} {label}
      </Text>
    </XStack>
  )
}