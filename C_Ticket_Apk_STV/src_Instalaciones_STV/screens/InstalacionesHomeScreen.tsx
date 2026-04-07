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
import { useFocusEffect } from '@react-navigation/native'
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

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
        <Text marginTop="$3" color="$color2" fontSize={isMobile ? '$3' : '$4'}>
          Cargando instalaciones...
        </Text>
      </YStack>
    )
  }

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      showsVerticalScrollIndicator={false}
    >
      <YStack flex={1} backgroundColor="$background" padding={isMobile ? '$3' : '$4'}>
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
          paddingTop="$2"
          gap="$3"
          flexWrap="wrap"
        >
          <YStack flex={1}>
            <Text
              fontSize={isMobile ? '$6' : '$7'}
              fontWeight="800"
              color="$primary"
            >
              🏢 Instalaciones
            </Text>
            <Text
              fontSize={isMobile ? '$2' : '$3'}
              color="$color2"
              marginTop="$1"
            >
              {instalaciones.length} instalación(es) registrada(s)
            </Text>
          </YStack>

          <Button
            onPress={handleCreateInstalacion}
            backgroundColor="$primary"
            borderRadius={12}
            size={isMobile ? '$4' : '$3'}
            pressStyle={{ opacity: 0.8 }}
          >
            <XStack alignItems="center" gap="$2">
              <Ionicons name="add-circle" size={isMobile ? 20 : 24} color="white" />
              <Text color="white" fontSize={isMobile ? '$2' : '$3'} fontWeight="600">
                Nuevo
              </Text>
            </XStack>
          </Button>
        </XStack>

        {/* Lista de instalaciones */}
        {instalaciones.length === 0 ? (
          <Card
            flex={1}
            backgroundColor="$background2"
            borderRadius={20}
            padding={isMobile ? '$5' : '$6'}
            marginTop="$4"
            borderColor="$primary"
            borderWidth={2}
            borderStyle="dashed"
          >
            <YStack alignItems="center" justifyContent="center" gap="$3">
              <YStack
                backgroundColor="$background3"
                width={isMobile ? 100 : 120}
                height={isMobile ? 100 : 120}
                borderRadius={60}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  name="business-outline"
                  size={isMobile ? 48 : 56}
                  color="$color4"
                />
              </YStack>

              <Text
                fontSize={isMobile ? '$5' : '$6'}
                fontWeight="700"
                color="$color3"
                marginTop="$2"
              >
                Sin instalaciones
              </Text>

              <Text
                fontSize={isMobile ? '$3' : '$4'}
                color="$color4"
                textAlign="center"
                lineHeight={isMobile ? 22 : 26}
              >
                No hay instalaciones registradas aún.{'\n'}¡Comienza registrando una!
              </Text>

              <Button
                onPress={handleCreateInstalacion}
                backgroundColor="$primary"
                borderRadius={12}
                paddingHorizontal={isMobile ? '$4' : '$5'}
                paddingVertical={isMobile ? '$3' : '$4'}
                marginTop="$3"
                pressStyle={{ opacity: 0.8 }}
              >
                <XStack alignItems="center" gap="$2">
                  <Ionicons
                    name="add-circle-outline"
                    size={isMobile ? 20 : 24}
                    color="white"
                  />
                  <Text
                    color="white"
                    fontSize={isMobile ? '$3' : '$4'}
                    fontWeight="600"
                  >
                    Registrar Instalación
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </Card>
        ) : (
          <YStack gap="$4" marginBottom="$5">
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
      </YStack>
    </ScrollView>
  )
}