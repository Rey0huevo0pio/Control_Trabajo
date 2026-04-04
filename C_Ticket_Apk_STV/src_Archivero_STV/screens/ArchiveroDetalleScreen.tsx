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
} from '../../src/components/design-system'
import { useResponsive } from '../../src/components/useResponsive'

export default function ArchiveroDetalleScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { isMobile } = useResponsive()
  const { archiveroId } = route.params

  // Datos de ejemplo
  const archivero = {
    id: archiveroId,
    nombre: 'Documentos Proyecto Alpha',
    descripcion: 'Archivos del proyecto principal',
    creador: 'Juan Pérez',
    visibilidad: 'publico' as const,
    miembros: 8,
  }

  const acciones = [
    { icon: 'folder-open', label: 'Crear Carpeta', color: '$primary', action: () => navigation.navigate('CrearCarpeta', { archiveroId }) },
    { icon: 'cloud-upload', label: 'Subir Archivo', color: '$success', action: () => navigation.navigate('SubirArchivo', { archiveroId }) },
    { icon: 'scan', label: 'Escanear', color: '$warning', action: () => navigation.navigate('EscanearDocumento', { archiveroId }) },
    { icon: 'people', label: 'Miembros', color: '$secondary', action: () => navigation.navigate('GestionarMiembros', { archiveroId }) },
  ]

  const carpetas = [
    { id: '1', nombre: 'Documentos Legales', archivos: 12, visibilidad: 'privado' as const, fecha: 'Hace 2 días' },
    { id: '2', nombre: 'Planos y Diseños', archivos: 8, visibilidad: 'publico' as const, fecha: 'Hace 1 semana' },
    { id: '3', nombre: 'Informes Mensuales', archivos: 24, visibilidad: 'publico' as const, fecha: 'Hace 3 días' },
  ]

  const archivos = [
    { id: '1', nombre: 'Contrato_2026.pdf', tipo: 'documento' as const, tamaño: '2.4 MB', visibilidad: 'privado' as const },
    { id: '2', nombre: 'Foto_instalacion.jpg', tipo: 'imagen' as const, tamaño: '1.8 MB', visibilidad: 'publico' as const },
    { id: '3', nombre: 'Video_reunion.mp4', tipo: 'video' as const, tamaño: '156 MB', visibilidad: 'privado' as const },
  ]

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$secondary" padding={isMobile ? '$4' : '$5'}>
        <Stack gap="$2">
          <HStack justify="space-between">
            <HStack gap="$2" align="center">
              <IconButton
                icon="arrow-back"
                onPress={() => navigation.goBack()}
                variant="ghost"
                size={24}
              />
              <Text variant="h4" color="white" fontWeight="700">
                {archivero.nombre}
              </Text>
            </HStack>
            <HStack gap="$2">
              <IconButton
                icon="settings"
                onPress={() => navigation.navigate('ConfiguracionArchivero', { archiveroId })}
                variant="ghost"
                size={24}
              />
            </HStack>
          </HStack>

          <HStack gap="$2" align="center">
            <YStack
              backgroundColor={archivero.visibilidad === 'publico' ? '$success' : '$error'}
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius="$full"
            >
              <HStack gap="$1" align="center">
                <Ionicons 
                  name={archivero.visibilidad === 'publico' ? 'eye' : 'eye-off'} 
                  size={12} 
                  color="white" 
                />
                <Text variant="caption" color="white" fontWeight="600" textTransform="uppercase">
                  {archivero.visibilidad}
                </Text>
              </HStack>
            </YStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
              Creado por {archivero.creador} • {archivero.miembros} miembros
            </Text>
          </HStack>
        </Stack>
      </Card>

      {/* Acciones */}
      <Card variant="filled" padding="$4">
        <HStack justify="space-around">
          {acciones.map((accion) => (
            <Stack key={accion.label} alignItems="center" gap="$2">
              <YStack
                width={56}
                height={56}
                borderRadius={14}
                backgroundColor={accion.color}
                justifyContent="center"
                alignItems="center"
                onPress={accion.action}
                pressStyle={{ opacity: 0.8, scale: 0.95 }}
              >
                <Ionicons name={accion.icon as any} size={24} color="white" />
              </YStack>
              <Text variant="caption" color="$color2" textAlign="center" fontWeight="600">
                {accion.label}
              </Text>
            </Stack>
          ))}
        </HStack>
      </Card>

      {/* Tabs visuales */}
      <Card variant="outlined" padding="$3">
        <HStack gap="$2">
          <TabChip icon="folder" label="Carpetas" active />
          <TabChip icon="document" label="Archivos" />
          <TabChip icon="image" label="Imágenes" />
          <TabChip icon="videocam" label="Videos" />
        </HStack>
      </Card>

      {/* Carpetas */}
      <Stack gap="$3">
        <HStack justify="space-between" align="center">
          <Text variant="h5" fontWeight="700" color="$color">
            Carpetas ({carpetas.length})
          </Text>
          <IconButton
            icon="add"
            onPress={() => navigation.navigate('CrearCarpeta', { archiveroId })}
            variant="outline"
            size={20}
          />
        </HStack>

        {carpetas.map((carpeta) => (
          <Card
            key={carpeta.id}
            variant="outlined"
            padding="$4"
            onPress={() => navigation.navigate('CarpetaDetalle', { 
              carpetaId: carpeta.id,
              archiveroId 
            })}
          >
            <HStack gap="$3">
              <YStack
                width={50}
                height={50}
                borderRadius={12}
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                <Ionicons name="folder" size={24} color="white" />
                <YStack
                  position="absolute"
                  top={-4}
                  right={-4}
                >
                  <Ionicons 
                    name={carpeta.visibilidad === 'publico' ? 'eye' : 'lock-closed'} 
                    size={14} 
                    color={carpeta.visibilidad === 'publico' ? '$success' : '$error'} 
                  />
                </YStack>
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="body" fontWeight="600" color="$color">
                  {carpeta.nombre}
                </Text>
                <HStack gap="$2">
                  <Text variant="caption" color="$color3">
                    {carpeta.archivos} archivos
                  </Text>
                  <Text variant="caption" color="$color3">
                    {carpeta.fecha}
                  </Text>
                </HStack>
              </Stack>

              <Ionicons name="chevron-forward" size={20} color="$primary" />
            </HStack>
          </Card>
        ))}
      </Stack>

      {/* Archivos recientes */}
      <Stack gap="$3">
        <HStack justify="space-between" align="center">
          <Text variant="h5" fontWeight="700" color="$color">
            Archivos Recientes
          </Text>
          <IconButton
            icon="add"
            onPress={() => navigation.navigate('SubirArchivo', { archiveroId })}
            variant="outline"
            size={20}
          />
        </HStack>

        {archivos.map((archivo) => (
          <Card
            key={archivo.id}
            variant="outlined"
            padding="$3"
            onPress={() => navigation.navigate('ArchivoDetalle', { archivoId: archivo.id })}
          >
            <HStack gap="$3" align="center">
              <YStack
                width={44}
                height={44}
                borderRadius={10}
                backgroundColor={
                  archivo.tipo === 'imagen' ? '$success' :
                  archivo.tipo === 'video' ? '$warning' : '$primary'
                }
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons 
                  name={
                    archivo.tipo === 'imagen' ? 'image' :
                    archivo.tipo === 'video' ? 'videocam' : 'document'
                  } 
                  size={22} 
                  color="white" 
                />
              </YStack>

              <Stack flex={1} gap="$1">
                <Text variant="bodySmall" fontWeight="600" color="$color">
                  {archivo.nombre}
                </Text>
                <HStack gap="$2">
                  <Text variant="caption" color="$color3">
                    {archivo.tamaño}
                  </Text>
                  <YStack
                    backgroundColor={archivo.visibilidad === 'publico' ? '$successMuted' : '$errorMuted'}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$full"
                  >
                    <Text 
                      variant="caption" 
                      color={archivo.visibilidad === 'publico' ? '$success' : '$error'}
                      fontWeight="600"
                      fontSize={10}
                    >
                      {archivo.visibilidad === 'publico' ? '🌐 Público' : '🔒 Privado'}
                    </Text>
                  </YStack>
                </HStack>
              </Stack>

              <Ionicons name="ellipsis-vertical" size={18} color="$color3" />
            </HStack>
          </Card>
        ))}
      </Stack>
    </ScreenLayout>
  )
}

function TabChip({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <YStack
      flex={1}
      backgroundColor={active ? '$primary' : '$background2'}
      paddingVertical="$2"
      borderRadius="$full"
      alignItems="center"
      pressStyle={{ opacity: 0.8 }}
    >
      <Ionicons 
        name={icon as any} 
        size={18} 
        color={active ? 'white' : '$color3'} 
      />
      <Text 
        variant="caption" 
        color={active ? 'white' : '$color3'}
        fontWeight={active ? '700' : '500'}
        marginTop="$1"
      >
        {label}
      </Text>
    </YStack>
  )
}
