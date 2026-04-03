import React from 'react'
import { View, Image } from 'react-native'
import { YStack, XStack, Text, Card, Button } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
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
  return (
    <Card
      backgroundColor="$background"
      borderRadius={16}
      padding={0}
      overflow="hidden"
      borderColor="$borderColor"
      borderWidth={1}
      shadowColor="$shadowColor"
      shadowOpacity={0.08}
      shadowRadius={6}
      onPress={onPress}
      pressStyle={{ opacity: 0.9 }}
    >
      <YStack>
        {/* Foto de la instalación */}
        <YStack position="relative" height={140} backgroundColor="$background3">
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
              <Ionicons name="business-outline" size={48} color="$color4" />
            </YStack>
          )}
          {/* Badge de activo/inactivo */}
          <XStack
            position="absolute"
            top="$2"
            right="$2"
            backgroundColor={instalacion.activa ? '$success' : '$color4'}
            paddingHorizontal="$3"
            paddingVertical="$1"
            borderRadius={10}
          >
            <Text color="white" fontSize="$2" fontWeight="600">
              {instalacion.activa ? 'Activa' : 'Inactiva'}
            </Text>
          </XStack>
        </YStack>

        {/* Contenido de la tarjeta */}
        <YStack padding="$4" gap="$2">
          <Text fontSize="$5" fontWeight="700" color="$color" numberOfLines={2}>
            {instalacion.nombre_instalacion}
          </Text>

          <XStack gap="$2" alignItems="center">
            <Ionicons name="location-outline" size={16} color="$color2" />
            <Text fontSize="$3" color="$color2" flex={1} numberOfLines={1}>
              {instalacion.ubicacion?.direccion || 'Sin ubicación'}
            </Text>
          </XStack>

          <XStack gap="$2" alignItems="center">
            <Ionicons name="shield-outline" size={16} color="$color2" />
            <Text fontSize="$3" color="$color2" flex={1} numberOfLines={1}>
              {instalacion.responsable || 'Sin responsable'}
            </Text>
          </XStack>

          {instalacion.descripcion && (
            <Text fontSize="$3" color="$color3" numberOfLines={2} marginTop="$1">
              {instalacion.descripcion}
            </Text>
          )}

          <XStack gap="$1" alignItems="center" paddingTop="$3" borderTopWidth={1} borderTopColor="$background3">
            <Ionicons name="person-circle-outline" size={14} color="$color4" />
            <Text fontSize="$1" color="$color4">
              {instalacion.nombre_registrador}
            </Text>
          </XStack>
        </YStack>

        {/* Botón de crear área */}
        {showCreateArea && (
          <YStack padding="$4" paddingTop={0}>
            <Button
              onPress={onCreateArea}
              backgroundColor="$background2"
              borderRadius={10}
              borderWidth={1}
              borderColor="$primary"
              borderStyle="dashed"
              pressStyle={{ opacity: 0.8 }}
            >
              <XStack alignItems="center" gap="$2">
                <Ionicons name="add-circle-outline" size={18} color="$primary" />
                <Text color="$primary" fontSize="$3" fontWeight="600">
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