import React, { useState } from 'react'
import { YStack, XStack, Avatar, Input } from 'tamagui'
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

export default function ChatHomeScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [searchQuery, setSearchQuery] = useState('')

  const mainOptions = [
    {
      id: 'private',
      title: 'Mensajería Privada',
      description: 'Chats individuales',
      icon: 'chatbubbles' as const,
      color: '$primary',
      gradient: '$primary',
      badge: 0,
      screen: 'PrivateChats'
    },
    {
      id: 'group',
      title: 'Mensajería Grupal',
      description: 'Chats en grupo',
      icon: 'people' as const,
      color: '$secondary',
      badge: 0,
      screen: 'GroupChats'
    },
    {
      id: 'employees',
      title: 'Directorio de Empleados',
      description: 'Todos los empleados',
      icon: 'contacts' as const,
      color: '$success',
      screen: 'EmployeeDirectory'
    },
    {
      id: 'news',
      title: 'Noticias y Carteles',
      description: 'Información general',
      icon: 'newspaper' as const,
      color: '$warning',
      badge: 2,
      screen: 'NewsBoard'
    }
  ]

  const quickActions = [
    { icon: 'add', label: 'Nuevo Chat', action: () => {} },
    { icon: 'create', label: 'Crear Grupo', action: () => {} },
    { icon: 'search', label: 'Buscar', action: () => navigation.navigate('ChatSearch') },
  ]

  return (
    <ScreenLayout>
      {/* Header Premium */}
      <Card
        backgroundColor="$primary"
        padding={isMobile ? '$5' : '$6'}
        overflow="hidden"
        position="relative"
      >
        <YStack position="absolute" right={-30} top={-40} opacity={0.1}>
          <Ionicons name="chatbubbles" size={200} color="white" />
        </YStack>

        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <HStack gap="$2" align="center">
              <Text variant="h3" color="white" fontWeight="800">
                Chat STV
              </Text>
              <YStack
                backgroundColor="rgba(255,255,255,0.3)"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$full"
              >
                <Text variant="caption" color="white" fontWeight="700">
                  PRO
                </Text>
              </YStack>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Mensajería empresarial superior
            </Text>
          </Stack>

          <HStack gap="$2">
            <IconButton
              icon="search"
              onPress={() => navigation.navigate('ChatSearch')}
              variant="ghost"
              size={24}
            />
            <IconButton
              icon="ellipsis-vertical"
              onPress={() => {}}
              variant="ghost"
              size={24}
            />
          </HStack>
        </HStack>
      </Card>

      {/* Buscador */}
      <Card variant="outlined" padding="$3">
        <HStack gap="$3" align="center">
          <Ionicons name="search" size={20} color="$color3" />
          <Input
            flex={1}
            placeholder="Buscar conversaciones, empleados, noticias..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            borderWidth={0}
            padding={0}
            fontSize={15}
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

      {/* Acciones rápidas */}
      <Card variant="filled" padding="$4">
        <HStack justify="space-around">
          {quickActions.map((action) => (
            <Stack key={action.label} alignItems="center" gap="$2">
              <IconButton
                icon={action.icon as any}
                onPress={action.action}
                variant="outline"
                size={22}
              />
              <Text variant="caption" color="$color2" textAlign="center">
                {action.label}
              </Text>
            </Stack>
          ))}
        </HStack>
      </Card>

      {/* Opciones principales */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1">
          Secciones
        </Text>

        <YStack gap="$3">
          {mainOptions.map((option) => (
            <Card
              key={option.id}
              variant="outlined"
              padding={isMobile ? '$4' : '$5'}
              onPress={() => handleNavigate(option.screen)}
            >
              <HStack gap="$3">
                <YStack
                  backgroundColor={option.color}
                  width={isMobile ? 56 : 64}
                  height={isMobile ? 56 : 64}
                  borderRadius={16}
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                >
                  <Ionicons
                    name={option.icon as any}
                    size={isMobile ? 26 : 30}
                    color="white"
                  />
                  {option.badge && option.badge > 0 && (
                    <YStack
                      position="absolute"
                      top={-6}
                      right={-6}
                      backgroundColor="$error"
                      minWidth={22}
                      height={22}
                      borderRadius="$full"
                      justifyContent="center"
                      alignItems="center"
                      paddingHorizontal="$2"
                    >
                      <Text variant="caption" color="white" fontWeight="700" fontSize={11}>
                        {option.badge}
                      </Text>
                    </YStack>
                  )}
                </YStack>

                <Stack flex={1} gap="$1" justifyContent="center">
                  <HStack gap="$2" align="center">
                    <Text variant="h6" fontWeight="700" color="$color">
                      {option.title}
                    </Text>
                  </HStack>
                  <Text variant="bodySmall" color="$color2">
                    {option.description}
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward" size={24} color="$primary" />
              </HStack>
            </Card>
          ))}
        </YStack>
      </Stack>

      {/* Características Premium */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1">
          Características
        </Text>

        <HStack gap="$3" flexWrap="wrap">
          <FeatureChip icon="shield-checkmark" label="Cifrado E2E" color="$success" />
          <FeatureChip icon="cloud-upload" label="Archivos" color="$primary" />
          <FeatureChip icon="videocam" label="Videollamadas" color="$secondary" />
          <FeatureChip icon="mic" label="Notas de Voz" color="$warning" />
          <FeatureChip icon="pin" label="Fijar Mensajes" color="$primary" />
          <FeatureChip icon="star" label="Reacciones" color="$warning" />
        </HStack>
      </Stack>

      {/* Footer */}
      <YStack alignItems="center" paddingVertical="$4" gap="$1">
        <Text variant="caption" color="$color4">
          Chat STV v1.0 - Superior Messaging
        </Text>
        <HStack gap="$1">
          <Ionicons name="star" size={12} color="$warning" />
          <Ionicons name="star" size={12} color="$warning" />
          <Ionicons name="star" size={12} color="$warning" />
          <Ionicons name="star" size={12} color="$warning" />
          <Ionicons name="star" size={12} color="$warning" />
        </HStack>
      </YStack>
    </ScreenLayout>
  )

  function handleNavigate(screen: string) {
    navigation.navigate(screen)
  }
}

function FeatureChip({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <XStack
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$border"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$full"
      gap="$2"
      alignItems="center"
    >
      <Ionicons name={icon as any} size={14} color={color} />
      <Text variant="caption" color="$color2" fontWeight="600">
        {label}
      </Text>
    </XStack>
  )
}
