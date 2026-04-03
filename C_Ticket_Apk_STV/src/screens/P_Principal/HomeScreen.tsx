import React from 'react'
import { YStack, XStack, Text, Button, Card, ScrollView } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { useWindowDimensions } from 'react-native'
import { useAuthStore } from '../../store'
import { ROLE_PERMISSIONS } from '../../constants'

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const { user, logout, hasPermission, hasRole } = useAuthStore()
  const { width } = useWindowDimensions()

  const permissions = user ? ROLE_PERMISSIONS[user.rol] : null
  const isMobile = width < 480

  const handleNavigateToInstalaciones = () => {
    navigation.navigate('InstalacionesHome')
  }

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
      >
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$5"
          paddingTop="$2"
          gap="$3"
          flexWrap="wrap"
        >
          <YStack flex={1}>
            <Text fontSize={isMobile ? '$7' : '$8'} fontWeight="800" color="$primary">
              🎫 C Ticket STV
            </Text>
            <Text fontSize={isMobile ? '$3' : '$4'} color="$color2" marginTop="$1">
              Panel Principal
            </Text>
          </YStack>

          <Button
            onPress={logout}
            backgroundColor="$error"
            size={isMobile ? '$4' : '$3'}
            borderRadius={10}
            pressStyle={{ opacity: 0.8 }}
          >
            <Text color="white" fontSize={isMobile ? '$3' : '$4'} fontWeight="600">
              🚪 Salir
            </Text>
          </Button>
        </XStack>

        {/* Info del Usuario */}
        <Card
          backgroundColor="$background2"
          borderRadius={16}
          padding={isMobile ? '$3.5' : '$4'}
          marginBottom="$5"
          borderColor="$primary"
          borderWidth={2}
          shadowColor="$shadowColor"
          shadowOpacity={0.1}
          shadowRadius={8}
        >
          <Text
            fontSize={isMobile ? '$5' : '$6'}
            fontWeight="700"
            color="$primary"
            marginBottom="$3"
          >
            👋 Bienvenido, {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
          </Text>

          <YStack gap="$2.5">
            <XStack gap="$2.5" alignItems="center">
              <Text
                fontSize={isMobile ? '$3' : '$4'}
                color="$color2"
                fontWeight="600"
                minWidth={80}
              >
                👤 Usuario:
              </Text>
              <Text
                fontSize={isMobile ? '$3' : '$4'}
                color="$color"
                fontWeight="500"
                flex={1}
              >
                {user?.Control_Usuario}
              </Text>
            </XStack>

            <XStack gap="$2.5" alignItems="center">
              <Text
                fontSize={isMobile ? '$3' : '$4'}
                color="$color2"
                fontWeight="600"
                minWidth={80}
              >
                🎭 Rol:
              </Text>
              <Text
                fontSize={isMobile ? '$3' : '$4'}
                color="$primary"
                fontWeight="700"
                textTransform="uppercase"
                flex={1}
              >
                {user?.rol}
              </Text>
            </XStack>
          </YStack>
        </Card>

        {/* Módulo de Instalaciones */}
        <Text
          fontSize={isMobile ? '$5' : '$6'}
          fontWeight="700"
          color="$primary"
          marginBottom="$3"
        >
          📦 Módulos Disponibles
        </Text>

        <YStack gap="$3" marginBottom="$5">
          {/* Tarjeta de Instalaciones */}
          <Card
            backgroundColor="$background2"
            borderRadius={16}
            padding={isMobile ? '$3.5' : '$4'}
            borderColor="$primary"
            borderWidth={2}
            shadowColor="$primary"
            shadowOpacity={0.2}
            shadowRadius={8}
            onPress={handleNavigateToInstalaciones}
            pressStyle={{ opacity: 0.9 }}
          >
            <XStack alignItems="center" gap={isMobile ? '$3' : '$4'}>
              <YStack
                backgroundColor="$primary"
                opacity={0.15}
                width={isMobile ? 48 : 56}
                height={isMobile ? 48 : 56}
                borderRadius={12}
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={isMobile ? '$6' : '$7'}>🏢</Text>
              </YStack>

              <YStack flex={1} gap="$1">
                <Text
                  fontSize={isMobile ? '$5' : '$6'}
                  fontWeight="700"
                  color="$color"
                >
                  Instalaciones
                </Text>
                <Text
                  fontSize={isMobile ? '$3' : '$4'}
                  color="$color2"
                  lineHeight="$1"
                >
                  Gestiona instalaciones y áreas
                </Text>
              </YStack>

              <Button
                backgroundColor="$primary"
                borderRadius={10}
                padding={isMobile ? '$2' : '$3'}
                pressStyle={{ opacity: 0.8 }}
              >
                <Text color="white" fontSize={isMobile ? '$3' : '$4'} fontWeight="600">
                  →
                </Text>
              </Button>
            </XStack>
          </Card>
        </YStack>

        {/* Permisos RBAC */}
        <Text
          fontSize={isMobile ? '$5' : '$6'}
          fontWeight="700"
          color="$primary"
          marginBottom="$3"
        >
          🔐 Tus Permisos (RBAC)
        </Text>

        <XStack gap="$2.5" flexWrap="wrap" marginBottom="$5">
          {permissions && (
            <>
              <PermissionBadge
                label="Crear"
                active={permissions.create}
                isMobile={isMobile}
              />
              <PermissionBadge
                label="Leer"
                active={permissions.read}
                isMobile={isMobile}
              />
              <PermissionBadge
                label="Actualizar"
                active={permissions.update}
                isMobile={isMobile}
              />
              <PermissionBadge
                label="Eliminar"
                active={permissions.delete}
                isMobile={isMobile}
              />
            </>
          )}
        </XStack>

        {/* Acciones por Rol */}
        <Text
          fontSize={isMobile ? '$5' : '$6'}
          fontWeight="700"
          color="$primary"
          marginBottom="$3"
        >
          ⚙️ Acciones Disponibles
        </Text>

        <YStack gap="$3" marginBottom="$5">
          {hasRole('it') && (
            <ActionButton
              title="Gestionar Usuarios"
              description="Administra usuarios y roles del sistema"
              icon="👥"
              isMobile={isMobile}
            />
          )}

          {(hasRole('it') || hasRole('rh') || hasRole('supervisor')) && (
            <ActionButton
              title="Gestionar Tickets"
              description="Crea, asigna y da seguimiento a tickets"
              icon="🎫"
              isMobile={isMobile}
            />
          )}

          {hasRole('supervisor') && (
            <ActionButton
              title="Reportes y Métricas"
              description="Visualiza reportes del equipo"
              icon="📊"
              isMobile={isMobile}
            />
          )}

          {hasRole('vigilante') && (
            <ActionButton
              title="Mis Tickets"
              description="Consulta y da seguimiento a tus tickets"
              icon="📋"
              isMobile={isMobile}
            />
          )}
        </YStack>
      </YStack>
    </ScrollView>
  )
}

// Componente auxiliar para badges de permisos
function PermissionBadge({
  label,
  active,
  isMobile,
}: {
  label: string
  active: boolean
  isMobile: boolean
}) {
  return (
    <XStack
      backgroundColor={active ? '$success' : '$error'}
      opacity={0.25}
      paddingHorizontal={isMobile ? '$3' : '$3.5'}
      paddingVertical={isMobile ? '$2.5' : '$3'}
      borderRadius={10}
      borderWidth={1}
      borderColor={active ? '$success' : '$error'}
    >
      <Text
        color={active ? '$success' : '$error'}
        fontWeight="700"
        fontSize={isMobile ? '$2' : '$3'}
      >
        {active ? '✓' : '✗'} {label}
      </Text>
    </XStack>
  )
}

// Componente auxiliar para botones de acción
function ActionButton({
  title,
  description,
  icon,
  isMobile,
}: {
  title: string
  description: string
  icon: string
  isMobile: boolean
}) {
  return (
    <XStack
      backgroundColor="$background2"
      padding={isMobile ? '$3.5' : '$4'}
      borderRadius={14}
      alignItems="center"
      gap={isMobile ? '$2.5' : '$4'}
      borderColor="$borderColor"
      borderWidth={1}
      shadowColor="$shadowColor"
      shadowOpacity={0.08}
      shadowRadius={6}
      pressStyle={{ opacity: 0.7 }}
    >
      <Text fontSize={isMobile ? '$5' : '$6'}>{icon}</Text>
      <YStack flex={1} gap="$1">
        <Text
          fontSize={isMobile ? '$4' : '$5'}
          fontWeight="700"
          color="$color"
          lineHeight="$1"
        >
          {title}
        </Text>
        <Text
          fontSize={isMobile ? '$2' : '$3'}
          color="$color2"
          lineHeight="$1"
        >
          {description}
        </Text>
      </YStack>
    </XStack>
  )
}
