/**
 * ============================================================================
 * 🧭 APP NAVIGATOR - Configuración de Navegación Principal
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Define todas las rutas de la aplicación
 * - Configura el Stack Navigator de React Navigation
 * - Conecta los módulos principales (Instalaciones, Tickets, Chat, Archivero)
 * - Decide qué pantalla mostrar según autenticación
 * 
 * CONEXIONES:
 * - Types: RootStackParamList (../types) - Define tipos de rutas
 * - Screens: LoginScreen, HomeScreen (../screens/)
 * - Módulos externos:
 *   - src_Instalaciones_STV/navigation → Instalaciones
 *   - src_P_Ticket_IT/navigation → Tickets IT
 *   - src_Chat_STV/navigation → Chat
 *   - src_Archivero_STV/navigation → Archivero
 * - Store: useAuthStore (para verificar autenticación si es necesario)
 * 
 * RUTAS DEFINIDAS:
 * - Login → Pantalla de inicio de sesión (P_Auth)
 * - Home → Pantalla principal después de login (P_Principal)
 * - InstalacionesHome → Módulo de instalaciones
 * - TicketsHome → Módulo de tickets IT
 * - ChatHome → Módulo de chat empresarial
 * - ArchiveroHome → Módulo de gestión documental
 * - UserManagement → Gestión de usuarios
 * 
 * FLUJO DE NAVEGACIÓN:
 * App.tsx
 *   └─ AppNavigator
 *       ├─ Login (pantalla inicial)
 *       └─ Home (después de login exitoso)
 *           ├─ → InstalacionesHome
 *           ├─ → TicketsHome
 *           ├─ → ChatHome
 *           ├─ → ArchiveroHome
 *           └─ → UserManagement
 * 
 * PARA AGREGAR NUEVA RUTA:
 * 1. Importar el screen: import { NuevoScreen } from '../screens/P_Nuevo';
 * 2. Agregar al Stack:
 *    <Stack.Screen name="Nuevo" component={NuevoScreen} />
 * 3. Si es un módulo con navegación propia:
 *    <Stack.Screen name="NuevoHome" component={NuevoNavigator} />
 * 
 * PARA MODIFICAR:
 * - Cambiar pantalla inicial: modificar initialRouteName
 * - Mostrar headers: cambiar headerShown: true
 * - Agregar animación: agregar animation: 'slide_from_right'
 * 
 * ============================================================================
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import { LoginScreen } from '../screens/P_Auth'
import { HomeScreen } from '../screens/P_Principal'
import { InstalacionNavigator } from '../../src_Instalaciones_STV/navigation'
import { TicketNavigator } from '../../src_P_Ticket_IT/navigation'
import { ChatNavigator } from '../../src_Chat_STV/navigation'
import { ArchiveroNavigator } from '../../src_Archivero_STV/navigation'
import UserManagementScreen from '../screens/Components_Usuarios/screens/UserManagementScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="InstalacionesHome"
        component={InstalacionNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TicketsHome"
        component={TicketNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatHome"
        component={ChatNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ArchiveroHome"
        component={ArchiveroNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
