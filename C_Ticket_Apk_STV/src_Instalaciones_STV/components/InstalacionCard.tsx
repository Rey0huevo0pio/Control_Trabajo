import React from 'react'
import { View, Image } from 'react-native'
import { YStack, XStack, Text, Card, Button } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import { useResponsive } from '../../src/components/useResponsive'
import type { Instalacion } from '@/types'

interface Props {
  instalacion: Instalacion
  onPress?: () => void
  onCreateArea?: () => void
  showCreateArea?: boolean
}

export function InstalacionCard({
  instalacion,
  onPress,
  onCreateArea,
  showCreateArea = false,
}: Props) {
  const { isMobile } = useResponsive()

  return (
    <Card
      backgroundColor="$background"
      borderRadius="$lg"
      padding={0}
      overflow="hidden"
      borderColor="$borderColor"
      borderWidth={1}
      shadowColor="$shadowColor"
      shadowOpacity={0.08}
      shadowRadius={8}
      onPress={onPress}
      pressStyle={{ opacity: 0.9, scale: 0.98 }}
    >
      <YStack>
        {/* Foto de la instalación */}
        <YStack position="relative" height={isMobile ? 140 : 160} backgroundColor="$background3">
          {instalacion.foto ? (
            <Image
              source={{ uri: instalacion.foto }}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          ) : (
            <YStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              backgroundColor="$background2"
            >
              <YStack
                width={64}
                height={64}
                borderRadius="$full"
                backgroundColor="$background3"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="business-outline" size={32} color="$color4" />
              </YStack>
            </YStack>
          )}
          {/* Badge de activo/inactivo */}
          <XStack
            position="absolute"
            top="$3"
            right="$3"
            backgroundColor={instalacion.activa ? '$success' : '$color4'}
            paddingHorizontal="$3"
            paddingVertical="$1.5"
            borderRadius="$full"
            shadowColor="$shadowColor"
            shadowOpacity={0.2}
            shadowRadius={4}
          >
            <XStack alignItems="center" gap="$1.5">
              <Ionicons 
                name={instalacion.activa ? "checkmark-circle" : "close-circle"} 
                size={14} 
                color="white" 
              />
              <Text color="white" fontSize="$2" fontWeight="700">
                {instalacion.activa ? 'Activa' : 'Inactiva'}
              </Text>
            </XStack>
          </XStack>
        </YStack>

        {/* Contenido de la tarjeta */}
        <YStack padding="$4" gap="$3">
          <Text fontSize={isMobile ? '$5' : '$6'} fontWeight="700" color="$color" numberOfLines={2}>
            {instalacion.nombre_instalacion}
          </Text>

          <YStack gap="$2">
            <XStack gap="$2" alignItems="center">
              <YStack
                width={32}
                height={32}
                borderRadius="$md"
                backgroundColor="$background2"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="location" size={16} color="$primary" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize="$2" color="$color2" fontWeight="600" numberOfLines={1}>
                  Ubicación
                </Text>
                <Text fontSize="$3" color="$color" numberOfLines={1}>
                  {instalacion.ubicacion?.direccion || 'Sin ubicación'}
                </Text>
              </YStack>
            </XStack>

            <XStack gap="$2" alignItems="center">
              <YStack
                width={32}
                height={32}
                borderRadius="$md"
                backgroundColor="$background2"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="person" size={16} color="$primary" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize="$2" color="$color2" fontWeight="600" numberOfLines={1}>
                  Responsable
                </Text>
                <Text fontSize="$3" color="$color" numberOfLines={1}>
                  {instalacion.responsable || 'Sin responsable'}
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {instalacion.descripcion && (
            <YStack 
              backgroundColor="$background2" 
              padding="$3" 
              borderRadius="$md"
            >
              <Text fontSize="$3" color="$color2" numberOfLines={2} lineHeight={20}>
                {instalacion.descripcion}
              </Text>
            </YStack>
          )}

          <XStack gap="$2" alignItems="center" paddingTop="$2" borderTopWidth={1} borderTopColor="$background3">
            <Ionicons name="person-circle" size={16} color="$color3" />
            <Text fontSize="$2" color="$color3" fontWeight="500">
              {instalacion.nombre_registrador}
            </Text>
          </XStack>
        </YStack>

        {/* Botón de crear área */}
        {showCreateArea && (
          <YStack padding="$4" paddingTop={0}>
            <Button
              onPress={onCreateArea}
              backgroundColor="$primaryMuted"
              borderRadius="$md"
              borderWidth={1}
              borderColor="$primary"
              height={44}
              pressStyle={{ backgroundColor: '$primary', scale: 0.98 }}
            >
              <XStack alignItems="center" gap="$2">
                <Ionicons name="add-circle-outline" size={20} color="$primary" />
                <Text color="$primary" fontSize="$3" fontWeight="700">
                  Crear Área
                </Text>
              </XStack>
            </Button>
          </YStack>
        )}
      </YStack>
    </Card>
  )
}