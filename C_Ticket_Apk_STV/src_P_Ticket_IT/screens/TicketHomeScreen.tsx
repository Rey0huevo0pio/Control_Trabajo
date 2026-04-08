/**
 * ============================================================================
 * 🎫 TICKET HOME - Professional Ticket Management Dashboard
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Dashboard principal del módulo de tickets
 * - Diseño moderno con gradientes y animaciones
 * - Estadísticas en tiempo real
 * - Navegación intuitiva a sub-módulos
 *
 * ============================================================================
 */
import React from 'react'
import { ScrollView, Dimensions, TouchableOpacity } from 'react-native'
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
  Loading,
} from '../../src/components/design-system'
import { useResponsive } from '../../src/components/useResponsive'

const { width } = Dimensions.get('window')

interface TicketStats {
  pendientes: number
  enProgreso: number
  completados: number
  total: number
}

export default function TicketHomeScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [loading, setLoading] = React.useState(false)
  
  // Mock data - replace with real API calls
  const [stats, setStats] = React.useState<TicketStats>({
    pendientes: 0,
    enProgreso: 0,
    completados: 0,
    total: 0,
  })

  const ticketOptions = [
    {
      id: 'crear',
      title: 'Crear Ticket',
      description: 'Registra un nuevo ticket de soporte',
      icon: 'add-circle-outline' as const,
      gradient: ['#007AFF', '#5AC8FA'],
      screen: 'CrearTicket'
    },
    {
      id: 'mis-tickets',
      title: 'Mis Tickets',
      description: 'Tickets asignados a ti',
      icon: 'person-outline' as const,
      gradient: ['#5856D6', '#AF52DE'],
      screen: 'MisTickets'
    },
    {
      id: 'todos',
      title: 'Todos los Tickets',
      description: 'Lista completa de tickets del sistema',
      icon: 'list-outline' as const,
      gradient: ['#FF9500', '#FF6B00'],
      screen: 'TodosTickets'
    },
    {
      id: 'reportes',
      title: 'Reportes y Métricas',
      description: 'Estadísticas y análisis de tickets',
      icon: 'analytics-outline' as const,
      gradient: ['#34C759', '#30D158'],
      screen: 'ReportesTickets'
    }
  ]

  const handleNavigate = (screen: string) => {
    // TODO: Implement navigation when screens are created
    console.log(`Navegar a: ${screen}`)
  }

  return (
    <ScreenLayout style={{ backgroundColor: '#F2F2F7' }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Modern Header with Gradient */}
        <YStack
          style={{
            background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
            padding: isMobile ? 24 : 32,
            paddingTop: 60,
            paddingBottom: 32,
            marginBottom: 24,
            borderRadius: 0,
          }}
        >
          {/* Decorative elements */}
          <YStack
            style={{
              position: 'absolute',
              right: -30,
              top: -40,
              opacity: 0.1,
            }}
          >
            <Ionicons name="ticket" size={200} color="white" />
          </YStack>

          <HStack justify="space-between" align="center">
            <Stack gap={8} flex={1}>
              <Text 
                variant="h1" 
                color="white" 
                fontWeight="800"
                style={{ fontSize: 32 }}
              >
                Tickets
              </Text>
              <Text 
                variant="body" 
                color="white" 
                opacity={0.9}
                style={{ fontSize: 15 }}
              >
                Gestión de Tickets STV
              </Text>
            </Stack>

            <TouchableOpacity
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
              <Ionicons name="ticket" size={28} color="white" />
            </TouchableOpacity>
          </HStack>
        </YStack>

        {/* Statistics Cards */}
        <Stack gap={16} paddingHorizontal={isMobile ? 16 : 24} marginBottom={24}>
          <Text 
            variant="h5" 
            fontWeight="700" 
            color="#000000"
            style={{ fontSize: 20 }}
          >
            Resumen de Actividad
          </Text>

          <YStack gap={12}>
            <HStack gap={12}>
              <StatCard
                icon="time-outline"
                value={stats.pendientes}
                label="Pendientes"
                color="#FF9500"
                gradient={['#FF9500', '#FF6B00']}
              />
              <StatCard
                icon="sync-outline"
                value={stats.enProgreso}
                label="En Progreso"
                color="#5856D6"
                gradient={['#5856D6', '#AF52DE']}
              />
            </HStack>
            <HStack gap={12}>
              <StatCard
                icon="checkmark-circle-outline"
                value={stats.completados}
                label="Completados"
                color="#34C759"
                gradient={['#34C759', '#30D158']}
              />
              <StatCard
                icon="layers-outline"
                value={stats.total}
                label="Total"
                color="#007AFF"
                gradient={['#007AFF', '#5AC8FA']}
              />
            </HStack>
          </YStack>
        </Stack>

        {/* Options Grid */}
        <Stack gap={20} paddingHorizontal={isMobile ? 16 : 24}>
          <Text 
            variant="h5" 
            fontWeight="700" 
            color="#000000"
            style={{ fontSize: 20 }}
          >
            Opciones de Gestión
          </Text>

          <YStack gap={16}>
            {ticketOptions.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                onPress={() => handleNavigate(option.screen)}
              />
            ))}
          </YStack>
        </Stack>

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
            Módulo de Tickets v2.0
          </Text>
        </YStack>
      </ScrollView>
    </ScreenLayout>
  )
}

/**
 * Statistic Card Component
 */
function StatCard({
  icon,
  value,
  label,
  color,
  gradient,
}: {
  icon: keyof typeof Ionicons.glyphMap
  value: number
  label: string
  color: string
  gradient: string[]
}) {
  return (
    <Card
      variant="elevated"
      flex={1}
      padding={16}
      borderRadius={16}
      style={{
        backgroundColor: 'white',
      }}
    >
      <Stack gap={8} align="center">
        <YStack
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: gradient[0],
            shadowOpacity: 0.3,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <Ionicons name={icon} size={24} color="white" />
        </YStack>
        
        <Text 
          variant="h3" 
          fontWeight="800" 
          style={{ 
            fontSize: 24,
            color: color,
          }}
        >
          {value}
        </Text>
        
        <Text 
          variant="caption" 
          style={{ 
            fontSize: 12,
            color: '#8E8E93',
            fontWeight: '600',
          }}
        >
          {label}
        </Text>
      </Stack>
    </Card>
  )
}

/**
 * Option Card Component
 */
function OptionCard({
  option,
  onPress,
}: {
  option: {
    id: string
    title: string
    description: string
    icon: keyof typeof Ionicons.glyphMap
    gradient: string[]
    screen: string
  }
  onPress: () => void
}) {
  return (
    <Card
      variant="elevated"
      padding={20}
      borderRadius={20}
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderColor: `${option.gradient[0]}20`,
        borderWidth: 1,
      }}
    >
      <HStack gap={16} align="center">
        {/* Icon with gradient */}
        <YStack
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${option.gradient[0]} 0%, ${option.gradient[1]} 100%)`,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: option.gradient[0],
            shadowOpacity: 0.4,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Ionicons name={option.icon} size={28} color="white" />
        </YStack>

        {/* Text content */}
        <Stack flex={1} gap={4}>
          <Text 
            variant="h6" 
            fontWeight="700" 
            style={{ 
              fontSize: 17,
              color: '#000000',
            }}
          >
            {option.title}
          </Text>
          <Text 
            variant="bodySmall" 
            style={{ 
              fontSize: 14,
              color: '#8E8E93',
              lineHeight: 18,
            }}
          >
            {option.description}
          </Text>
        </Stack>

        {/* Arrow */}
        <Ionicons name="chevron-forward-circle" size={26} color={option.gradient[0]} />
      </HStack>
    </Card>
  )
}
