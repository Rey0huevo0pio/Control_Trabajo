import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  InstalacionesHomeScreen,
  RegistroInstalacionScreen,
  DetalleInstalacionScreen,
  RegistroAreaScreen,
} from '../screens'
import type { InstalacionStackParamList } from '../types'

const Stack = createNativeStackNavigator<InstalacionStackParamList>()

export function InstalacionNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="InstalacionesHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="InstalacionesHome" component={InstalacionesHomeScreen} />
      <Stack.Screen name="RegistroInstalacion" component={RegistroInstalacionScreen} />
      <Stack.Screen name="DetalleInstalacion" component={DetalleInstalacionScreen} />
      <Stack.Screen name="RegistroArea" component={RegistroAreaScreen} />
    </Stack.Navigator>
  )
}
