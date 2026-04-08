/**
 * ============================================================================
 * 📱 MAIN TABS - Bottom Tab Navigation (Google/Microsoft Style)
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Crea navegación con tabs inferiores estilo Google/Microsoft
 * - Tabs principales: Home, Instalaciones, Chat, Archivero, Tickets
 * - Iconos profesionales con estados activo/inactivo
 * - Navegación fluida entre módulos
 *
 * DISEÑO:
 * - Tab bar con fondo blur (estilo iOS)
 * - Iconos animados al cambiar de tab
 * - Labels claros y concisos
 * - Colores de marca por módulo
 *
 * ============================================================================
 */
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { Platform, View, StyleSheet } from 'react-native'
import { MainTabParamList } from '../types'
import { HomeScreen } from '../screens/P_Principal'
import { InstalacionNavigator } from '../../src_Instalaciones_STV/navigation'
import { ChatNavigator } from '../../src_Chat_STV/navigation'
import { ArchiveroNavigator } from '../../src_Archivero_STV/navigation'
import { TicketNavigator } from '../../src_P_Ticket_IT/navigation'
import { useAuthStore } from '../store'

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function MainTabs() {
  const { user, hasRole } = useAuthStore()

  // Determinar qué tabs mostrar según el rol
  const showTickets = hasRole('it') || hasRole('rh') || hasRole('supervisor')
  const showUserManagement = hasRole('it')

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.95)' : '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 68,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      {/* Tab: Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Tab: Instalaciones */}
      <Tab.Screen
        name="InstalacionesTab"
        component={InstalacionNavigator}
        options={{
          title: 'Instalaciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />

      {/* Tab: Chat */}
      <Tab.Screen
        name="ChatTab"
        component={ChatNavigator}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          tabBarBadge: undefined, // Puedes agregar notificaciones aquí
        }}
      />

      {/* Tab: Archivero */}
      <Tab.Screen
        name="ArchiveroTab"
        component={ArchiveroNavigator}
        options={{
          title: 'Archivero',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" size={size} color={color} />
          ),
        }}
      />

      {/* Tab: Tickets (condicional) */}
      {showTickets && (
        <Tab.Screen
          name="TicketsTab"
          component={TicketNavigator}
          options={{
            title: 'Tickets',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ticket" size={size} color={color} />
            ),
            tabBarBadge: undefined, // Puedes agregar tickets pendientes aquí
          }}
        />
      )}
    </Tab.Navigator>
  )
}
