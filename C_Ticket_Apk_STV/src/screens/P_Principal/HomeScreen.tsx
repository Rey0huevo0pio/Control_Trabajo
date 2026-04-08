/**
 * ============================================================================
 * 🏠 HOME SCREEN - Professional Dashboard Redesign
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Dashboard principal con diseño profesional nivel Google/Microsoft
 * - Tarjetas de módulos con gradientes y animaciones
 * - Navegación intuitiva entre módulos
 * - Diseño moderno con sombras, bordes redondeados y micro-interacciones
 *
 * DISEÑO:
 * - Gradientes suaves y modernos
 * - Cards con elevación y sombras
 * - Animaciones suaves al presionar
 * - Iconografía clara y profesional
 * - Espaciado optimizado para touch
 *
 * ============================================================================
 */
import React from 'react'
import { ScrollView, Dimensions, Platform } from 'react-native'
import { YStack, XStack } from 'tamagui'
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

const { width } = Dimensions.get('window')

interface ModuleCard {
  id: string
  title: string
  description: string
  icon: keyof typeof Ionicons.glyphMap
  gradient: string[]
  screen: string
  requiredRole?: string
  badge?: number
}

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const { user, logout, hasRole } = useAuthStore()
  const { isMobile, spacing, buttonSizes } = useResponsive()

  const permissions = user ? ROLE_PERMISSIONS[user.rol] : null

  // Handle navigation to main tabs
  const handleNavigateToMainTabs = () => {
    navigation.navigate('MainTabs')
  }

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

  // Module definitions with modern design
  const modules: ModuleCard[] = [
    {
      id: 'instalaciones',
      title: 'Instalaciones',
      description: 'Gestiona instalaciones y áreas',
      icon: 'business',
      gradient: ['#007AFF', '#5AC8FA'],
      screen: 'InstalacionesHome',
    },
    {
      id: 'chat',
      title: 'Chat y Mensajería',
      description: 'Mensajería privada, grupal y noticias',
      icon: 'chatbubbles',
      gradient: ['#34C759', '#30D158'],
      screen: 'ChatHome',
    },
    {
      id: 'archivero',
      title: 'Archivero Digital',
      description: 'Gestión documental y archivos',
      icon: 'folder',
      gradient: ['#5856D6', '#AF52DE'],
      screen: 'ArchiveroHome',
    },
    {
      id: 'tickets',
      title: 'Tickets de Soporte',
      description: 'Crear, asignar y dar seguimiento',
      icon: 'ticket',
      gradient: ['#FF9500', '#FF6B00'],
      screen: 'TicketsHome',
      requiredRole: 'it,rh,supervisor',
    },
    {
      id: 'usuarios',
      title: 'Gestión de Usuarios',
      description: 'Administra usuarios y roles del sistema',
      icon: 'people',
      gradient: ['#FF2D55', '#FF3742'],
      screen: 'UserManagement',
      requiredRole: 'it',
    },
  ]

  // Filter modules based on user role
  const filteredModules = modules.filter(module => {
    if (!module.requiredRole) return true
    const roles = module.requiredRole.split(',')
    return user && roles.includes(user.rol)
  })

  return (
    <ScreenLayout style={{ backgroundColor: '#F2F2F7' }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Modern Header with Gradient */}
        <YStack
          style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
            padding: isMobile ? 24 : 32,
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
            paddingBottom: 32,
            borderRadius: 0,
            marginBottom: 24,
          }}
        >
          {/* Decorative background elements */}
          <YStack
            style={{
              position: 'absolute',
              right: -30,
              top: -40,
              opacity: 0.1,
            }}
          >
            <Ionicons name="grid" size={200} color="white" />
          </YStack>
          
          <YStack
            style={{
              position: 'absolute',
              left: -20,
              bottom: -30,
              opacity: 0.08,
            }}
          >
            <Ionicons name="apps" size={150} color="white" />
          </YStack>

          {/* Header content */}
          <HStack justify="space-between" align="center">
            <Stack gap={8} flex={1}>
              <HStack gap={8} align="center">
                <Text 
                  variant="h1" 
                  color="white" 
                  fontWeight="800" 
                  letterSpacing={-0.5}
                  style={{ fontSize: 32 }}
                >
                  C Ticket
                </Text>
                <Text 
                  variant="h3" 
                  color="white" 
                  opacity={0.9} 
                  fontWeight="600"
                  style={{ fontSize: 20 }}
                >
                  STV
                </Text>
              </HStack>
              <Text 
                variant="body" 
                color="white" 
                opacity={0.8} 
                fontWeight="500"
                style={{ fontSize: 15 }}
              >
                Panel de Control Profesional
              </Text>
            </Stack>

            <YStack
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Ionicons name="shield-checkmark" size={30} color="white" />
            </YStack>
          </HStack>
        </YStack>

        {/* User Profile Card */}
        <Card
          variant="elevated"
          padding={isMobile ? 20 : 24}
          marginHorizontal={isMobile ? 16 : 24}
          marginBottom={24}
          borderRadius={20}
          style={{
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <HStack gap={16} align="center">
            {/* Avatar */}
            <YStack
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#007AFF',
                shadowOpacity: 0.3,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <Text color="white" fontWeight="800" fontSize={26}>
                {user?.nombre?.charAt(0) || 'U'}
              </Text>
            </YStack>

            {/* User info */}
            <Stack flex={1} gap={6}>
              <Text variant="h5" fontWeight="700" color="#000000" style={{ fontSize: 18 }}>
                {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
              </Text>
              <HStack gap={8} align="center" flexWrap="wrap">
                <Text variant="bodySmall" color="#8E8E93" style={{ fontSize: 13 }}>
                  {user?.Control_Usuario || '---'}
                </Text>
                <XStack 
                  style={{
                    backgroundColor: '#007AFF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text variant="caption" color="white" fontWeight="700" textTransform="uppercase" style={{ fontSize: 11 }}>
                    {user?.rol || 'Guest'}
                  </Text>
                </XStack>
              </HStack>
            </Stack>

            {/* Logout button */}
            <IconButton
              icon="power"
              onPress={logout}
              variant="error"
              size={24}
            />
          </HStack>
        </Card>

        {/* Modules Grid */}
        <Stack gap={20} paddingHorizontal={isMobile ? 16 : 24}>
          <Text 
            variant="h5" 
            fontWeight="700" 
            color="#000000" 
            letterSpacing={-0.3}
            style={{ fontSize: 20 }}
          >
            Módulos del Sistema
          </Text>

          {/* Modern grid layout for modules */}
          <YStack gap={16}>
            {filteredModules.map((module, index) => (
              <ModuleCardComponent
                key={module.id}
                module={module}
                index={index}
                onPress={() => {
                  switch (module.screen) {
                    case 'InstalacionesHome':
                      handleNavigateToInstalaciones()
                      break
                    case 'ChatHome':
                      handleNavigateToChat()
                      break
                    case 'ArchiveroHome':
                      handleNavigateToArchivero()
                      break
                    case 'TicketsHome':
                      handleNavigateToTickets()
                      break
                    case 'UserManagement':
                      handleNavigateToUserManagement()
                      break
                  }
                }}
              />
            ))}
          </YStack>
        </Stack>

        {/* Permissions Section */}
        {permissions && (
          <Stack gap={16} paddingHorizontal={isMobile ? 16 : 24} marginTop={32}>
            <Text 
              variant="h5" 
              fontWeight="700" 
              color="#000000" 
              letterSpacing={-0.3}
              style={{ fontSize: 20 }}
            >
              Permisos de tu Rol
            </Text>

            <XStack gap={10} flexWrap="wrap">
              <PermissionChip label="Crear" active={permissions.create} />
              <PermissionChip label="Leer" active={permissions.read} />
              <PermissionChip label="Actualizar" active={permissions.update} />
              <PermissionChip label="Eliminar" active={permissions.delete} />
            </XStack>
          </Stack>
        )}

        {/* Footer */}
        <YStack alignItems="center" paddingVertical={40} gap={8} marginTop={24}>
          <YStack
            style={{
              width: 60,
              height: 4,
              backgroundColor: '#C7C7CC',
              borderRadius: 2,
              opacity: 0.3,
            }}
          />
          <Text variant="caption" color="#8E8E93" fontWeight="600">
            C Ticket STV v2.0
          </Text>
          <Text variant="caption" color="#C7C7CC">
            Sistema de Gestión Profesional
          </Text>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  )
}

/**
 * Modern Module Card Component
 */
function ModuleCardComponent({ 
  module, 
  index, 
  onPress 
}: { 
  module: ModuleCard
  index: number
  onPress: () => void
}) {
  return (
    <YStack
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: module.gradient[0],
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        borderWidth: 1,
        borderColor: `${module.gradient[0]}20`,
        transform: [{ scale: 1 }],
      }}
      pressStyle={{
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
      }}
    >
      <HStack gap={16} align="center">
        {/* Icon with gradient background */}
        <YStack
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${module.gradient[0]} 0%, ${module.gradient[1]} 100%)`,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: module.gradient[0],
            shadowOpacity: 0.4,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Ionicons name={module.icon} size={28} color="white" />
        </YStack>

        {/* Text content */}
        <Stack flex={1} gap={4}>
          <Text variant="h6" fontWeight="700" color="#000000" style={{ fontSize: 17 }}>
            {module.title}
          </Text>
          <Text variant="bodySmall" color="#8E8E93" lineHeight={18} style={{ fontSize: 14 }}>
            {module.description}
          </Text>
        </Stack>

        {/* Arrow icon */}
        <Ionicons name="chevron-forward-circle" size={26} color={module.gradient[0]} />
      </HStack>
    </YStack>
  )
}

/**
 * Permission Chip Component
 */
function PermissionChip({ label, active }: { label: string; active: boolean }) {
  return (
    <XStack
      style={{
        backgroundColor: active ? '#E3F9E8' : '#FFE5E3',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: active ? '#34C759' : '#FF3B30',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Ionicons
        name={active ? "checkmark-circle" : "close-circle"}
        size={14}
        color={active ? '#34C759' : '#FF3B30'}
      />
      <Text
        variant="labelSmall"
        color={active ? '#34C759' : '#FF3B30'}
        fontWeight="700"
        style={{ fontSize: 12 }}
      >
        {label}
      </Text>
    </XStack>
  )
}
