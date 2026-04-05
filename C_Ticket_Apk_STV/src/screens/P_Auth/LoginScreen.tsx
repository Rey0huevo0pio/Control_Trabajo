import { useState } from 'react'
import { YStack, XStack, Input, Text, Button, Spinner } from 'tamagui'
import { useAuthStore } from '../../store'
import { authApi } from '../../services'
import { LoginRequest } from '../../types'
import { useWindowDimensions } from 'react-native'
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
  const { width } = useWindowDimensions()

  const { login, setLoading, isLoading } = useAuthStore()
  const isMobile = width < 480

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
      padding={isMobile ? '$3' : '$4'}
      justifyContent="center"
      alignItems="center"
    >
      <YStack
        width="100%"
        maxWidth={400}
        padding={isMobile ? '$5' : '$6'}
        backgroundColor="$background2"
        borderRadius={20}
        gap="$5"
        shadowColor="$shadowColor"
        shadowOpacity={0.1}
        shadowRadius={12}
      >
        {/* Logo/Título */}
        <YStack alignItems="center" gap="$2">
          <Text
            fontSize={isMobile ? '$8' : '$9'}
            fontWeight="800"
            color="$primary"
            textAlign="center"
          >
            🎫
          </Text>
          <Text
            fontSize={isMobile ? '$7' : '$9'}
            fontWeight="700"
            color="$color"
            textAlign="center"
          >
            C Ticket STV
          </Text>
          <Text
            fontSize={isMobile ? '$3' : '$4'}
            color="$color2"
            textAlign="center"
            lineHeight={20}
          >
            Sistema de Tickets de Soporte
          </Text>
        </YStack>

        {/* Campo Control de Usuario */}
        <YStack gap="$2.5">
          <Text fontSize={isMobile ? '$4' : '$4'} color="$color" fontWeight="600">
            👤 Control de Usuario
          </Text>
          <Input
            value={controlUsuario}
            onChangeText={setControlUsuario}
            placeholder="Ej: USUARIO123"
            autoCapitalize="none"
            autoCorrect={false}
            height={isMobile ? 56 : 50}
            paddingHorizontal="$4"
            paddingVertical="$3"
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={2}
            color="$color"
            placeholderTextColor="$color2"
            fontSize={isMobile ? 18 : 16}
            fontWeight="500"
            borderRadius={12}
          />
        </YStack>

        {/* Campo Contraseña */}
        <YStack gap="$2.5">
          <Text fontSize={isMobile ? '$4' : '$4'} color="$color" fontWeight="600">
            🔐 Contraseña
          </Text>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            height={isMobile ? 56 : 50}
            paddingHorizontal="$4"
            paddingVertical="$3"
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={2}
            color="$color"
            placeholderTextColor="$color2"
            fontSize={isMobile ? 18 : 16}
            fontWeight="500"
            borderRadius={12}
          />
        </YStack>

        {/* Mensaje de Error */}
        {error ? (
          <XStack
            backgroundColor="$error"
            opacity={0.15}
            padding="$3"
            borderRadius={12}
            borderLeftWidth={4}
            borderLeftColor="$error"
            alignItems="center"
          >
            <Text color="$error" fontSize={isMobile ? '$4' : '$3'} fontWeight="600" flex={1}>
              ⚠️ {error}
            </Text>
          </XStack>
        ) : null}

        {/* Botón Login */}
        <Button
          onPress={handleLogin}
          backgroundColor="$primary"
          paddingVertical={isMobile ? '$3.5' : '$3'}
          paddingHorizontal="$4"
          disabled={isLoading}
          borderRadius={12}
          marginTop="$2"
          shadowColor="$primary"
          shadowOpacity={0.3}
          shadowRadius={8}
          justifyContent="center"
          alignItems="center"
          minHeight={isMobile ? 58 : 50}
          width="100%"
        >
          {isLoading ? (
            <XStack gap="$2" alignItems="center" justifyContent="center">
              <Spinner color="white" size="small" />
              <Text 
                color="white" 
                fontWeight="700" 
                fontSize={isMobile ? '$4' : '$4'}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Ingresando...
              </Text>
            </XStack>
          ) : (
            <Text 
              color="white" 
              fontWeight="700" 
              fontSize={isMobile ? '$4' : '$4'}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Ingresar
            </Text>
          )}
        </Button>

        {/* Info adicional */}
        <YStack alignItems="center" gap="$1.5" marginTop="$3">
          <Text 
            fontSize={isMobile ? '$3' : '$2'} 
            color="$color2" 
            textAlign="center"
            fontWeight="500"
          >
            Versión 1.0.0
          </Text>
          <Text
            fontSize={isMobile ? '$3' : '$2'}
            color="$color2"
            textAlign="center"
            lineHeight={22}
            fontWeight="400"
            numberOfLines={2}
          >
            © 2026 C Ticket STV
          </Text>
        </YStack>
      </YStack>
    </YStack>
  )
}
