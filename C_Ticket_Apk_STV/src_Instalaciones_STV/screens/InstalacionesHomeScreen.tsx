import React, { useState, useCallback } from 'react'
import {
  YStack,
  XStack,
  Text,
  Card,
  ScrollView,
  Button,
  Spinner,
} from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useResponsive } from '../../src/components/useResponsive'
import { InstalacionCard } from '../components'
import { instalacionApi } from '../lib'
import type { Instalacion } from '@/types'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { InstalacionStackParamList } from '@/types'

type NavigationProp = NativeStackNavigationProp<InstalacionStackParamList>

interface Props {
  navigation: NavigationProp
}

export function InstalacionesHomeScreen({ navigation }: Props) {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { isMobile } = useResponsive()
  const mainNavigation = useNavigation<any>()

  const loadInstalaciones = async () => {
    try {
      const data = await instalacionApi.getActivas()
      setInstalaciones(data)
    } catch (error) {
      console.error('Error al cargar instalaciones:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadInstalaciones()
    }, [])
  )

  const onRefresh = () => {
    setRefreshing(true)
    loadInstalaciones()
  }

  const handleCreateInstalacion = () => {
    navigation.navigate('RegistroInstalacion')
  }

  const handleVerDetalle = (instalacionId: string) => {
    navigation.navigate('DetalleInstalacion', { instalacionId })
  }

  const handleCrearArea = (instalacionId: string, instalacionNombre: string) => {
    navigation.navigate('RegistroArea', {
      instalacionId,
      instalacionNombre,
    })
  }

  const handleGoHome = () => {
    mainNavigation.navigate('Home')
  }

  if (loading) {
    return (
      <YStack 
        flex={1} 
        justifyContent="center" 
        alignItems="center" 
        backgroundColor="$background"
        paddingHorizontal="$5"
      >
        <YStack gap="$4" alignItems="center">
          <YStack
            width={isMobile ? 80 : 100}
            height={isMobile ? 80 : 100}
            borderRadius="$full"
            backgroundColor="$background2"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner size="large" color="$primary" />
          </YStack>
          <Text 
            color="$color2" 
            fontSize={isMobile ? '$3' : '$4'}
            fontWeight="500"
          >
            Cargando instalaciones...
          </Text>
        </YStack>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header con gradiente */}
      <YStack
        backgroundColor="$primary"
        paddingHorizontal={isMobile ? '$5' : '$6'}
        paddingTop="$5"
        paddingBottom="$4"
        gap="$3"
      >
        {/* Botón regresar al home */}
        <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
          <Button
            onPress={handleGoHome}
            backgroundColor="rgba(255,255,255,0.2)"
            borderRadius="$full"
            height={40}
            paddingHorizontal="$3"
            pressStyle={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            <XStack alignItems="center" gap="$2">
              <Ionicons name="arrow-back" size={20} color="white" />
              <Text color="white" fontSize="$3" fontWeight="600">
                Inicio
              </Text>
            </XStack>
          </Button>

          <Button
            onPress={handleCreateInstalacion}
            backgroundColor="white"
            borderRadius="$full"
            height={40}
            paddingHorizontal="$4"
            pressStyle={{ opacity: 0.9 }}
          >
            <XStack alignItems="center" gap="$2">
              <Ionicons name="add-circle" size={20} color="$primary" />
              <Text color="$primary" fontSize="$3" fontWeight="700">
                Nueva
              </Text>
            </XStack>
          </Button>
        </XStack>

        {/* Título y subtítulo */}
        <YStack gap="$1">
          <XStack alignItems="center" gap="$3">
            <YStack
              width={48}
              height={48}
              borderRadius="$md"
              backgroundColor="rgba(255,255,255,0.2)"
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons name="business" size={28} color="white" />
            </YStack>
            <YStack flex={1}>
              <Text
                fontSize={isMobile ? '$8' : '$9'}
                fontWeight="800"
                color="white"
                letterSpacing={-0.5}
              >
                Instalaciones
              </Text>
              <Text
                fontSize={isMobile ? '$3' : '$4'}
                color="rgba(255,255,255,0.85)"
                fontWeight="500"
              >
                {instalaciones.length} {instalaciones.length === 1 ? 'instalación' : 'instalaciones'}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </YStack>

      {/* Contenido principal */}
      <ScrollView
        flex={1}
        backgroundColor="$background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          padding: isMobile ? 20 : 32,
          paddingBottom: 40,
        }}
      >
        {instalaciones.length === 0 ? (
          <Card
            backgroundColor="$background2"
            borderRadius="$xl"
            padding={isMobile ? '$6' : '$7'}
            borderColor="$primary"
            borderWidth={2}
            borderStyle="dashed"
          >
            <YStack alignItems="center" gap="$4">
              <YStack
                width={isMobile ? 120 : 140}
                height={isMobile ? 120 : 140}
                borderRadius="$full"
                backgroundColor="$background3"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  name="business-outline"
                  size={isMobile ? 56 : 64}
                  color="$color4"
                />
              </YStack>

              <YStack alignItems="center" gap="$2">
                <Text
                  fontSize={isMobile ? '$6' : '$7'}
                  fontWeight="700"
                  color="$color"
                >
                  Sin instalaciones
                </Text>

                <Text
                  fontSize={isMobile ? '$3' : '$4'}
                  color="$color2"
                  textAlign="center"
                  lineHeight={isMobile ? 24 : 28}
                  paddingHorizontal="$3"
                >
                  No hay instalaciones registradas aún.{'\n'}
                  ¡Comienza registrando tu primera instalación!
                </Text>
              </YStack>

              <Button
                onPress={handleCreateInstalacion}
                backgroundColor="$primary"
                borderRadius="$lg"
                paddingHorizontal="$5"
                height={52}
                marginTop="$2"
                pressStyle={{ opacity: 0.85, scale: 0.98 }}
              >
                <XStack alignItems="center" gap="$2">
                  <Ionicons name="add-circle-outline" size={22} color="white" />
                  <Text
                    color="white"
                    fontSize="$4"
                    fontWeight="700"
                    letterSpacing={0.3}
                  >
                    Registrar Instalación
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </Card>
        ) : (
          <YStack gap="$4">
            {instalaciones.map((item) => (
              <InstalacionCard
                key={item._id}
                instalacion={item}
                showCreateArea
                onPress={() => handleVerDetalle(item._id)}
                onCreateArea={() =>
                  handleCrearArea(item._id, item.nombre_instalacion)
                }
              />
            ))}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  )
}