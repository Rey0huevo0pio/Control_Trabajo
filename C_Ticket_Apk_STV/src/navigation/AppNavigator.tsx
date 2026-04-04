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
