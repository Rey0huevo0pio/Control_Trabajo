import { useState } from 'react'
import { YStack, XStack, Input, Text, Button, Spinner } from 'tamagui'
import { useAuthStore } from '../../store'
import { authApi } from '../../services'
import { LoginRequest } from '../../types'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../types'

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [controlUsuario, setControlUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login, setLoading, isLoading } = useAuthStore()

  const handleLogin = async () => {
    setError('')

    if (!controlUsuario || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    try {
      const data: LoginRequest = { Control_Usuario: controlUsuario, password }
      const response = await authApi.login(data)

      if (response.success && response.data) {
        login(response.data.user, response.data.token)
        navigation.replace('Home')
      } else {
        setError(response.message || 'Error al iniciar sesión')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de conexión con el servidor')
    }
  }

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$4"
      justifyContent="center"
      alignItems="center"
    >
      <YStack
        width="100%"
        maxWidth={400}
        padding="$6"
        backgroundColor="$background2"
        borderRadius={16}
        gap="$4"
      >
        <Text
          fontSize="$9"
          fontWeight="700"
          color="$color"
          textAlign="center"
          marginBottom="$2"
        >
          C Ticket STV
        </Text>

        <Text
          fontSize="$4"
          color="$color2"
          textAlign="center"
          marginBottom="$4"
        >
          Inicia sesión para continuar
        </Text>

        <YStack gap="$2">
          <Text fontSize="$3" color="$color" fontWeight="500">
            Control de Usuario
          </Text>
          <Input
            value={controlUsuario}
            onChangeText={setControlUsuario}
            placeholder="Tu control de usuario"
            autoCapitalize="none"
            autoCorrect={false}
            backgroundColor="$background"
            borderColor="$borderColor"
            color="$color"
          />
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" color="$color" fontWeight="500">
            Contraseña
          </Text>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            backgroundColor="$background"
            borderColor="$borderColor"
            color="$color"
          />
        </YStack>

        {error ? (
          <Text color="$error" fontSize="$3" textAlign="center">
            {error}
          </Text>
        ) : null}

        <Button
          onPress={handleLogin}
          backgroundColor="$primary"
          paddingVertical="$3"
          disabled={isLoading}
          marginTop="$2"
        >
          {isLoading ? <Spinner color="white" /> : <Text color="white" fontWeight="600">Ingresar</Text>}
        </Button>
      </YStack>
    </YStack>
  )
}
