import React from 'react'
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

export default function CarpetaDetalleScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { isMobile } = useResponsive()
  const { carpetaId, archiveroId } = route.params

  // Datos de ejemplo
  const carpeta = {
    id: carpetaId,
    nombre: 'Documentos Legales',
    descripcion: 'Contratos y documentos legales',
    creador: 'Juan Pérez',
    visibilidad: 'privado' as 'privado' | 'publico',
    archivos: 12,
  }

  const subcarpetas = [
    { id: '1', nombre: 'Contratos 2026', archivos: 5, visibilidad: 'privado' as const },
    { id: '2', nombre: 'Acuerdos', archivos: 3, visibilidad: 'publico' as const },
  ]

  const archivos = [
    { id: '1', nombre: 'Contrato_Servicios.pdf', tipo: 'documento' as const, tamaño: '1.2 MB', visibilidad: 'publico' as const },
    { id: '2', nombre: 'NDA_Cliente.pdf', tipo: 'documento' as const, tamaño: '850 KB', visibilidad: 'privado' as const },
  ]

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
              {carpeta.nombre}
            </Text>
          </HStack>

          <HStack gap="$2" align="center">
            <YStack
              backgroundColor={carpeta.visibilidad === 'publico' ? '$success' : '$error'}
              paddingHorizontal="$3"
              paddingVertical="$1"
              borderRadius="$full"
            >
              <HStack gap="$1" align="center">
                <Ionicons 
                  name={carpeta.visibilidad === 'publico' ? 'eye' : 'lock-closed'} 
                  size={12} 
                  color="white" 
                />
                <Text variant="caption" color="white" fontWeight="600">
                  {carpeta.visibilidad}
                </Text>
              </HStack>
            </YStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
              {carpeta.archivos} archivos
            </Text>
          </HStack>
        </Stack>
      </Card>

      {/* Acciones */}
      <Card variant="filled" padding="$3">
        <HStack justify="space-around">
          <ActionButton icon="add" label="Nueva Carpeta" onPress={() => {}} />
          <ActionButton icon="cloud-upload" label="Subir" onPress={() => navigation.navigate('SubirArchivo', { archiveroId, carpetaId })} />
          <ActionButton icon="scan" label="Escanear" onPress={() => navigation.navigate('EscanearDocumento', { archiveroId, carpetaId })} />
          <ActionButton icon="settings" label="Opciones" onPress={() => navigation.navigate('ConfiguracionCarpeta', { carpetaId })} />
        </HStack>
      </Card>

      {/* Subcarpetas */}
      {subcarpetas.length > 0 && (
        <Stack gap="$3">
          <HStack justify="space-between" align="center">
            <Text variant="h5" fontWeight="700" color="$color">
              Carpetas ({subcarpetas.length})
            </Text>
            <IconButton
              icon="add"
              onPress={() => {}}
              variant="outline"
              size={20}
            />
          </HStack>

          {subcarpetas.map((subcarpeta) => (
            <Card
              key={subcarpeta.id}
              variant="outlined"
              padding="$4"
              onPress={() => navigation.navigate('CarpetaDetalle', { carpetaId: subcarpeta.id, archiveroId })}
            >
              <HStack gap="$3">
                <YStack
                  width={48}
                  height={48}
                  borderRadius={12}
                  backgroundColor="$warning"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name="folder" size={24} color="white" />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="body" fontWeight="600" color="$color">
                    {subcarpeta.nombre}
                  </Text>
                  <Text variant="bodySmall" color="$color3">
                    {subcarpeta.archivos} archivos
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward" size={20} color="$primary" />
              </HStack>
            </Card>
          ))}
        </Stack>
      )}

      {/* Archivos */}
      <Stack gap="$3">
        <HStack justify="space-between" align="center">
          <Text variant="h5" fontWeight="700" color="$color">
            Archivos ({archivos.length})
          </Text>
          <IconButton
            icon="cloud-upload"
            onPress={() => navigation.navigate('SubirArchivo', { archiveroId, carpetaId })}
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
                backgroundColor="$primary"
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name="document" size={22} color="white" />
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

function ActionButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Stack alignItems="center" gap="$2">
      <YStack
        width={50}
        height={50}
        borderRadius={12}
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$border"
        justifyContent="center"
        alignItems="center"
        onPress={onPress}
        pressStyle={{ opacity: 0.8, scale: 0.95 }}
      >
        <Ionicons name={icon as any} size={22} color="$color" />
      </YStack>
      <Text variant="caption" color="$color2" fontWeight="600">
        {label}
      </Text>
    </Stack>
  )
}
