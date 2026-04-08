/**
 * ============================================================================
 * 🎨 MODERN APP NAVIGATOR - Google/Microsoft Style Navigation
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Implementa navegación con Bottom Tabs (estilo apps modernas)
 * - Transiciones suaves entre pantallas
 * - Navegación intuitiva tipo Google/Microsoft apps
 * - Mantiene Stack Navigation para módulos internos
 *
 * ARQUITECTURA:
 * - Bottom Tabs para módulos principales
 * - Stack Navigation dentro de cada módulo
 * - Animaciones compartidas entre transiciones
 *
 * ============================================================================
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { RootStackParamList, MainTabParamList } from '../types'
import { LoginScreen } from '../screens/P_Auth'
import { HomeScreen } from '../screens/P_Principal'
import { InstalacionNavigator } from '../../src_Instalaciones_STV/navigation'
import { TicketNavigator } from '../../src_P_Ticket_IT/navigation'
import { ChatNavigator } from '../../src_Chat_STV/navigation'
import { ArchiveroNavigator } from '../../src_Archivero_STV/navigation'
import UserManagementScreen from '../screens/Components_Usuarios/screens/UserManagementScreen'
import MainTabs from './MainTabs'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      
      {/* Modern Bottom Tabs Navigator */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{
          animation: 'fade',
          animationDuration: 200,
        }}
      />
      
      {/* Module screens (accessible from tabs and home) */}
      <Stack.Screen
        name="InstalacionesHome"
        component={InstalacionNavigator}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="TicketsHome"
        component={TicketNavigator}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ChatHome"
        component={ChatNavigator}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ArchiveroHome"
        component={ArchiveroNavigator}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  )
}
