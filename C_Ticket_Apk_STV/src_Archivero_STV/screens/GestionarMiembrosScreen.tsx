import React, { useState } from 'react'
import { YStack } from 'tamagui'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  IconButton,
  Button,
} from '../../src/components/design-system'
import { useResponsive } from '../../src/components/useResponsive'

export default function GestionarMiembrosScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { isMobile } = useResponsive()
  const { archiveroId } = route.params
  
  const [visibilidadArchivero, setVisibilidadArchivero] = useState<'publico' | 'privado'>('publico')

  // Datos de ejemplo
  const miembros = [
    { id: '1', nombre: 'Juan Pérez', rol: 'dueño' as const, avatar: 'JP', fecha: 'Hace 2 semanas' },
    { id: '2', nombre: 'María García', rol: 'editor' as const, avatar: 'MG', fecha: 'Hace 1 semana' },
    { id: '3', nombre: 'Carlos López', rol: 'visor' as const, avatar: 'CL', fecha: 'Hace 3 días' },
    { id: '4', nombre: 'Ana Martínez', rol: 'editor' as const, avatar: 'AM', fecha: 'Hace 2 días' },
  ]

  const usuariosDisponibles = [
    { id: '5', nombre: 'Pedro Sánchez', rol: 'Analista', avatar: 'PS' },
    { id: '6', nombre: 'Laura Díaz', rol: 'Diseñadora', avatar: 'LD' },
  ]

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'dueño': return '$primary'
      case 'editor': return '$success'
      case 'visor': return '$warning'
      default: return '$color3'
    }
  }

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$primary" padding={isMobile ? '$4' : '$5'}>
        <Stack gap="$2">
          <HStack gap="$2" align="center">
            <IconButton
              icon="arrow-back"
              onPress={() => navigation.goBack()}
              variant="ghost"
              size={24}
            />
            <Text variant="h4" color="white" fontWeight="700">
              Gestionar Miembros
            </Text>
          </HStack>
          <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
            {miembros.length} miembros
          </Text>
        </Stack>
      </Card>

      {/* Visibilidad del Archivero */}
      <Card variant="outlined" padding="$4">
        <Stack gap="$3">
          <HStack gap="$2" align="center">
            <Ionicons name="eye" size={20} color="$color" />
            <Text variant="h6" fontWeight="700" color="$color">
              Visibilidad del Archivero
            </Text>
          </HStack>

          <HStack gap="$3">
            <Card
              variant={visibilidadArchivero === 'publico' ? 'default' : 'outlined'}
              backgroundColor={visibilidadArchivero === 'publico' ? '$successMuted' : undefined}
              borderColor={visibilidadArchivero === 'publico' ? '$success' : undefined}
              padding="$3"
              flex={1}
              onPress={() => setVisibilidadArchivero('publico')}
            >
              <Stack alignItems="center" gap="$2">
                <Ionicons name="earth" size={28} color="$success" />
                <Text variant="bodySmall" fontWeight="700" color="$color">
                  Público
                </Text>
                <Text variant="caption" color="$color3" textAlign="center">
                  Todos pueden ver
                </Text>
              </Stack>
            </Card>

            <Card
              variant={visibilidadArchivero === 'privado' ? 'default' : 'outlined'}
              backgroundColor={visibilidadArchivero === 'privado' ? '$errorMuted' : undefined}
              borderColor={visibilidadArchivero === 'privado' ? '$error' : undefined}
              padding="$3"
              flex={1}
              onPress={() => setVisibilidadArchivero('privado')}
            >
              <Stack alignItems="center" gap="$2">
                <Ionicons name="lock-closed" size={28} color="$error" />
                <Text variant="bodySmall" fontWeight="700" color="$color">
                  Privado
                </Text>
                <Text variant="caption" color="$color3" textAlign="center">
                  Solo miembros
                </Text>
              </Stack>
            </Card>
          </HStack>
        </Stack>
      </Card>

      {/* Lista de miembros actuales */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color">
          Miembros Actuales
        </Text>

        {miembros.map((miembro) => (
          <Card key={miembro.id} variant="outlined" padding="$4">
            <HStack gap="$3">
              <YStack
                width={50}
                height={50}
                borderRadius="$full"
                backgroundColor={getRolColor(miembro.rol)}
                justifyContent="center"
                alignItems="center"
              >
                <Text color="white" fontWeight="700" fontSize={16}>
                  {miembro.avatar}
                </Text>
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="body" fontWeight="600" color="$color">
                  {miembro.nombre}
                </Text>
                <HStack gap="$2" align="center">
                  <YStack
                    backgroundColor={getRolColor(miembro.rol)}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$full"
                  >
                    <Text variant="caption" color="white" fontWeight="600" textTransform="uppercase">
                      {miembro.rol}
                    </Text>
                  </YStack>
                  <Text variant="caption" color="$color3">
                    {miembro.fecha}
                  </Text>
                </HStack>
              </Stack>

              {miembro.rol !== 'dueño' && (
                <IconButton
                  icon="ellipsis-horizontal"
                  onPress={() => {}}
                  variant="ghost"
                  size={20}
                />
              )}
            </HStack>
          </Card>
        ))}
      </Stack>

      {/* Agregar miembros */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color">
          Agregar Miembros
        </Text>

        {usuariosDisponibles.map((usuario) => (
          <Card key={usuario.id} variant="outlined" padding="$4">
            <HStack gap="$3" align="center">
              <YStack
                width={44}
                height={44}
                borderRadius="$full"
                backgroundColor="$secondary"
                justifyContent="center"
                alignItems="center"
              >
                <Text color="white" fontWeight="700" fontSize={14}>
                  {usuario.avatar}
                </Text>
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="body" fontWeight="600" color="$color">
                  {usuario.nombre}
                </Text>
                <Text variant="bodySmall" color="$color2">
                  {usuario.rol}
                </Text>
              </Stack>

              <Button
                title="Agregar"
                icon={"person-add" as any}
                variant="primary"
                size="sm"
                onPress={() => {}}
              />
            </HStack>
          </Card>
        ))}
      </Stack>
    </ScreenLayout>
  )
}
