import React, { useState } from 'react'
import { YStack, Input } from 'tamagui'
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

export default function ChatSearchScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [searchQuery, setSearchQuery] = useState('')

  const recentSearches = [
    'Juan Pérez',
    'Equipo de Desarrollo',
    'Política de vacaciones',
  ]

  const searchResults = searchQuery.length > 0 ? [
    { type: 'user', name: 'Juan Pérez', subtitle: 'Desarrollador Senior' },
    { type: 'group', name: 'Equipo de Desarrollo', subtitle: '12 miembros' },
    { type: 'news', name: 'Nueva Política de Vacaciones', subtitle: 'Noticia' },
  ] : []

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$primary" padding={isMobile ? '$4' : '$5'}>
        <Stack gap="$3">
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
                  Buscar
                </Text>
              </HStack>
            </Stack>
          </HStack>

          {/* Input de búsqueda */}
          <Card variant="default" backgroundColor="rgba(255,255,255,0.15)" padding="$3">
            <HStack gap="$3" align="center">
              <Ionicons name="search" size={20} color="white" />
              <Input
                flex={1}
                placeholder="Buscar en mensajes, empleados, noticias..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                borderWidth={0}
                padding={0}
                fontSize={15}
                color="white"
                placeholderTextColor="$color4"
              />
              {searchQuery && (
                <IconButton
                  icon="close-circle"
                  onPress={() => setSearchQuery('')}
                  variant="ghost"
                  size={20}
                />
              )}
            </HStack>
          </Card>
        </Stack>
      </Card>

      {/* Resultados o Búsquedas Recientes */}
      {searchQuery.length > 0 ? (
        <Stack gap="$2">
          <Text variant="h6" fontWeight="700" color="$color" paddingHorizontal="$1">
            Resultados ({searchResults.length})
          </Text>

          {searchResults.map((result, index) => (
            <Card
              key={index}
              variant="outlined"
              padding="$4"
              onPress={() => {}}
            >
              <HStack gap="$3">
                <YStack
                  width={44}
                  height={44}
                  borderRadius="$full"
                  backgroundColor="$primary"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons
                    name={result.type === 'user' ? 'person' : result.type === 'group' ? 'people' : 'newspaper'}
                    size={22}
                    color="white"
                  />
                </YStack>

                <Stack flex={1} justifyContent="center" gap="$1">
                  <Text variant="body" fontWeight="600" color="$color">
                    {result.name}
                  </Text>
                  <Text variant="bodySmall" color="$color2">
                    {result.subtitle}
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward" size={20} color="$primary" />
              </HStack>
            </Card>
          ))}
        </Stack>
      ) : (
        <Stack gap="$3">
          <Text variant="h6" fontWeight="700" color="$color" paddingHorizontal="$1">
            Búsquedas Recientes
          </Text>

          {recentSearches.map((search, index) => (
            <Card
              key={index}
              variant="outlined"
              padding="$3"
              onPress={() => setSearchQuery(search)}
            >
              <HStack gap="$3" align="center">
                <Ionicons name="time" size={20} color="$color3" />
                <Text variant="body" color="$color" flex={1}>
                  {search}
                </Text>
                <IconButton
                  icon="close"
                  onPress={() => {}}
                  variant="ghost"
                  size={20}
                />
              </HStack>
            </Card>
          ))}
        </Stack>
      )}
    </ScreenLayout>
  )
}
