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

export default function ArchiveroHomeScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [searchQuery, setSearchQuery] = useState('')

  // Datos de ejemplo
  const archiveros = [
    {
      id: '1',
      nombre: 'Documentos Proyecto Alpha',
      descripcion: 'Archivos del proyecto principal',
      creador: 'Juan Pérez',
      visibilidad: 'publico' as const,
      archivos: 24,
      carpetas: 5,
      espacioUsado: '1.2 GB',
      fecha: 'Hace 2 días',
    },
    {
      id: '2',
      nombre: 'Recursos Humanos 2026',
      descripcion: 'Documentos confidenciales de RRHH',
      creador: 'María García',
      visibilidad: 'privado' as const,
      archivos: 45,
      carpetas: 12,
      espacioUsado: '3.5 GB',
      fecha: 'Hace 1 semana',
    },
    {
      id: '3',
      nombre: 'Manuales y Procedimientos',
      descripcion: 'Documentación general de la empresa',
      creador: 'Carlos López',
      visibilidad: 'publico' as const,
      archivos: 18,
      carpetas: 4,
      espacioUsado: '850 MB',
      fecha: 'Hace 3 días',
    },
  ]

  const mainActions = [
    {
      icon: 'add-circle' as const,
      label: 'Crear Archivero',
      color: '$primary',
      action: () => navigation.navigate('CrearArchivero')
    },
    {
      icon: 'cloud-upload' as const,
      label: 'Subir Archivo',
      color: '$success',
      action: () => navigation.navigate('SubirArchivo')
    },
    {
      icon: 'scan' as const,
      label: 'Escanear',
      color: '$warning',
      action: () => navigation.navigate('EscanearDocumento')
    },
  ]

  return (
    <ScreenLayout>
      {/* Header Premium */}
      <Card
        backgroundColor="$secondary"
        padding={isMobile ? '$5' : '$6'}
        overflow="hidden"
        position="relative"
      >
        <YStack position="absolute" right={-30} top={-40} opacity={0.1}>
          <Ionicons name="folder" size={200} color="white" />
        </YStack>

        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <HStack gap="$2" align="center">
              <Text variant="h3" color="white" fontWeight="800">
                Archivero STV
              </Text>
              <YStack
                backgroundColor="rgba(255,255,255,0.3)"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$full"
              >
                <Text variant="caption" color="white" fontWeight="700">
                  DRIVE
                </Text>
              </YStack>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Gestión documental empresarial
            </Text>
          </Stack>

          <HStack gap="$2">
            <IconButton
              icon="search"
              onPress={() => {}}
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
            placeholder="Buscar archiveros, carpetas, archivos..."
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

      {/* Acciones principales */}
      <Card variant="filled" padding="$4">
        <Text variant="h6" fontWeight="700" color="$color" marginBottom="$3">
          Acciones Rápidas
        </Text>
        <HStack justify="space-around">
          {mainActions.map((action) => (
            <Stack key={action.label} alignItems="center" gap="$2">
              <YStack
                width={60}
                height={60}
                borderRadius={16}
                backgroundColor={action.color}
                justifyContent="center"
                alignItems="center"
                onPress={action.action}
                pressStyle={{ opacity: 0.8, scale: 0.95 }}
              >
                <Ionicons name={action.icon} size={28} color="white" />
              </YStack>
              <Text variant="caption" color="$color2" textAlign="center" fontWeight="600">
                {action.label}
              </Text>
            </Stack>
          ))}
        </HStack>
      </Card>

      {/* Estadísticas */}
      <Card variant="outlined" padding="$4">
        <HStack justify="space-around">
          <Stack alignItems="center" gap="$1">
            <Text variant="h4" fontWeight="800" color="$primary">
              {archiveros.length}
            </Text>
            <Text variant="caption" color="$color2">
              Archiveros
            </Text>
          </Stack>
          <YStack width={1} backgroundColor="$border" />
          <Stack alignItems="center" gap="$1">
            <Text variant="h4" fontWeight="800" color="$success">
              87
            </Text>
            <Text variant="caption" color="$color2">
              Carpetas
            </Text>
          </Stack>
          <YStack width={1} backgroundColor="$border" />
          <Stack alignItems="center" gap="$1">
            <Text variant="h4" fontWeight="800" color="$warning">
              342
            </Text>
            <Text variant="caption" color="$color2">
              Archivos
            </Text>
          </Stack>
        </HStack>
      </Card>

      {/* Lista de archiveros */}
      <Stack gap="$3">
        <HStack justify="space-between" align="center">
          <Text variant="h5" fontWeight="700" color="$color">
            Mis Archiveros
          </Text>
          <IconButton
            icon="filter"
            onPress={() => {}}
            variant="ghost"
            size={20}
          />
        </HStack>

        <YStack gap="$3">
          {archiveros.map((archivero) => (
            <Card
              key={archivero.id}
              variant="outlined"
              padding={isMobile ? '$4' : '$5'}
              onPress={() => navigation.navigate('ArchiveroDetalle', { 
                archiveroId: archivero.id 
              })}
            >
              <HStack gap="$3">
                <YStack
                  width={isMobile ? 56 : 64}
                  height={isMobile ? 56 : 64}
                  borderRadius={16}
                  backgroundColor="$secondary"
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                >
                  <Ionicons name="folder" size={isMobile ? 28 : 32} color="white" />
                  <YStack
                    position="absolute"
                    top={-6}
                    right={-6}
                    backgroundColor={archivero.visibilidad === 'publico' ? '$success' : '$error'}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$full"
                  >
                    <Ionicons 
                      name={archivero.visibilidad === 'publico' ? 'eye' : 'eye-off'} 
                      size={12} 
                      color="white" 
                    />
                  </YStack>
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="h6" fontWeight="700" color="$color">
                    {archivero.nombre}
                  </Text>
                  <Text variant="bodySmall" color="$color2">
                    {archivero.descripcion}
                  </Text>
                  <HStack gap="$3">
                    <Text variant="caption" color="$color3">
                      {archivero.archivos} archivos
                    </Text>
                    <Text variant="caption" color="$color3">
                      {archivero.carpetas} carpetas
                    </Text>
                    <Text variant="caption" color="$color3">
                      {archivero.espacioUsado}
                    </Text>
                  </HStack>
                </Stack>

                <Ionicons name="chevron-forward" size={24} color="$secondary" />
              </HStack>
            </Card>
          ))}
        </YStack>
      </Stack>

      {/* Características */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color" paddingHorizontal="$1">
          Características
        </Text>

        <HStack gap="$3" flexWrap="wrap">
          <FeatureChip icon="lock-closed" label="Cifrado" color="$success" />
          <FeatureChip icon="people" label="Colaborativo" color="$primary" />
          <FeatureChip icon="cloud-download" label="Descargas" color="$secondary" />
          <FeatureChip icon="scan" label="Escaneo" color="$warning" />
          <FeatureChip icon="shield-checkmark" label="Seguro" color="$success" />
          <FeatureChip icon="time" label="Versiones" color="$primary" />
        </HStack>
      </Stack>

      {/* Footer */}
      <YStack alignItems="center" paddingVertical="$4" gap="$1">
        <Text variant="caption" color="$color4">
          Archivero STV v1.0 - Gestión Documental
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
}

function FeatureChip({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <YStack
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$border"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$full"
    >
      <HStack gap="$2" align="center">
        <Ionicons name={icon as any} size={14} color={color} />
        <Text variant="caption" color="$color2" fontWeight="600">
          {label}
        </Text>
      </HStack>
    </YStack>
  )
}
