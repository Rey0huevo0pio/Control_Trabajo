import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import LoginScreen from '../screens/P_Auth/LoginScreen'
import HomeScreen from '../screens/P_Principal/HomeScreen'

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
    </Stack.Navigator>
  )
}
