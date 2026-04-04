import React from 'react'
import { YStack } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  IconButton,
} from '../../src/components/design-system'
import { useResponsive } from '../../src/components/useResponsive'

export default function NewsBoardScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()

  // Datos de ejemplo
  const news = [
    {
      id: '1',
      titulo: 'Nueva Política de Vacaciones 2026',
      contenido: 'Se ha actualizado la política de vacaciones para todos los empleados. Revisar los nuevos beneficios...',
      autor: 'RRHH',
      fecha: 'Hace 2 horas',
      categoria: 'RRHH',
      prioridad: 'alta',
      imagen: undefined,
    },
    {
      id: '2',
      titulo: 'Mantenimiento de Sistemas este Sábado',
      contenido: 'El equipo de TI realizará mantenimiento programado en los sistemas de 8am a 12pm...',
      autor: 'TI',
      fecha: 'Hace 5 horas',
      categoria: 'Tecnología',
      prioridad: 'media',
      imagen: undefined,
    },
    {
      id: '3',
      titulo: '¡Bienvenido Nuevo Miembro al Equipo!',
      contenido: 'Nos complace anunciar que Carlos Rodríguez se une al equipo de desarrollo...',
      autor: 'Gerencia',
      fecha: 'Ayer',
      categoria: 'Anuncios',
      prioridad: 'baja',
      imagen: undefined,
    },
  ]

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return '$error'
      case 'alta': return '$warning'
      case 'media': return '$primary'
      default: return '$color3'
    }
  }

  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'warning'
      case 'alta': return 'information-circle'
      case 'media': return 'megaphone'
      default: return 'newspaper'
    }
  }

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$warning" padding={isMobile ? '$4' : '$5'}>
        <Stack gap="$1">
          <HStack justify="space-between">
            <Stack gap="$1" flex={1}>
              <HStack gap="$2" align="center">
                <IconButton
                  icon="arrow-back"
                  onPress={() => navigation.goBack()}
                  variant="ghost"
                  size={24}
                />
                <Text variant="h4" color="white" fontWeight="700">
                  Noticias y Carteles
                </Text>
              </HStack>
              <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
                Información general para empleados
              </Text>
            </Stack>

            <IconButton
              icon="filter"
              onPress={() => {}}
              variant="ghost"
              size={24}
            />
          </HStack>
        </Stack>
      </Card>

      {/* Lista de noticias */}
      <Stack gap="$3">
        {news.map((item) => (
          <Card
            key={item.id}
            variant="outlined"
            onPress={() => navigation.navigate('NewsDetail', { noticiaId: item.id })}
          >
            <YStack gap="$3">
              {/* Badge de prioridad */}
              <HStack gap="$2" align="center">
                <YStack
                  backgroundColor={getPriorityColor(item.prioridad)}
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius="$full"
                >
                  <HStack gap="$1" align="center">
                    <Ionicons 
                      name={getPriorityIcon(item.prioridad) as any} 
                      size={12} 
                      color="white" 
                    />
                    <Text variant="caption" color="white" fontWeight="600" textTransform="uppercase">
                      {item.prioridad}
                    </Text>
                  </HStack>
                </YStack>
                <YStack
                  backgroundColor="$background2"
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius="$full"
                >
                  <Text variant="caption" color="$color2">
                    {item.categoria}
                  </Text>
                </YStack>
              </HStack>

              {/* Contenido */}
              <Stack gap="$2">
                <Text variant="h6" fontWeight="700" color="$color">
                  {item.titulo}
                </Text>
                <Text variant="bodySmall" color="$color2" lineHeight={22}>
                  {item.contenido}
                </Text>
              </Stack>

              {/* Footer */}
              <HStack justify="space-between" align="center">
                <HStack gap="$2" align="center">
                  <YStack
                    width={28}
                    height={28}
                    borderRadius="$full"
                    backgroundColor="$primary"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text color="white" fontWeight="700" fontSize={11}>
                      {item.autor.charAt(0)}
                    </Text>
                  </YStack>
                  <Text variant="caption" color="$color3">
                    {item.autor}
                  </Text>
                </HStack>
                <Text variant="caption" color="$color3">
                  {item.fecha}
                </Text>
              </HStack>
            </YStack>
          </Card>
        ))}
      </Stack>
    </ScreenLayout>
  )
}
