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

export default function EscanearDocumentoScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { isMobile } = useResponsive()
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<'camara' | 'galeria' | null>(null)

  const archiveroId = route.params?.archiveroId
  const carpetaId = route.params?.carpetaId

  const opciones = [
    {
      id: 'camara' as const,
      icono: 'camera' as const,
      titulo: 'Tomar Foto',
      descripcion: 'Captura una imagen con la cámara',
      color: '$primary',
    },
    {
      id: 'galeria' as const,
      icono: 'images' as const,
      titulo: 'Escanear Archivo',
      descripcion: 'Selecciona o escanea un documento existente',
      color: '$secondary',
    },
  ]

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$warning" padding={isMobile ? '$4' : '$5'}>
        <Stack gap="$2">
          <HStack gap="$2" align="center">
            <IconButton
              icon="arrow-back"
              onPress={() => navigation.goBack()}
              variant="ghost"
              size={24}
            />
            <Text variant="h4" color="white" fontWeight="700">
              Escanear Documento
            </Text>
          </HStack>
          <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
            Selecciona el método de captura
          </Text>
        </Stack>
      </Card>

      {/* Opciones de escaneo */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color">
          Método de Captura
        </Text>

        {opciones.map((opcion) => (
          <Card
            key={opcion.id}
            variant={metodoSeleccionado === opcion.id ? 'default' : 'outlined'}
            borderColor={metodoSeleccionado === opcion.id ? opcion.color : undefined}
            backgroundColor={metodoSeleccionado === opcion.id ? `${opcion.color}10` : undefined}
            padding="$5"
            onPress={() => setMetodoSeleccionado(opcion.id)}
          >
            <HStack gap="$4">
              <YStack
                width={70}
                height={70}
                borderRadius={18}
                backgroundColor={opcion.color}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons name={opcion.icono} size={32} color="white" />
              </YStack>

              <Stack flex={1} gap="$2">
                <Text variant="h6" fontWeight="700" color="$color">
                  {opcion.titulo}
                </Text>
                <Text variant="bodySmall" color="$color2">
                  {opcion.descripcion}
                </Text>
              </Stack>

              <YStack
                width={28}
                height={28}
                borderRadius="$full"
                borderWidth={2}
                borderColor={metodoSeleccionado === opcion.id ? opcion.color : '$border'}
                backgroundColor={metodoSeleccionado === opcion.id ? opcion.color : 'transparent'}
                justifyContent="center"
                alignItems="center"
              >
                {metodoSeleccionado === opcion.id && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </YStack>
            </HStack>
          </Card>
        ))}
      </Stack>

      {/* Características */}
      <Stack gap="$3">
        <Text variant="h5" fontWeight="700" color="$color">
          Características de Escaneo
        </Text>

        <Card variant="filled" padding="$4">
          <Stack gap="$3">
            <FeatureItem 
              icon="document-text" 
              titulo="OCR Integrado" 
              descripcion="Reconocimiento de texto automático" 
            />
            <FeatureItem 
              icon="crop" 
              titulo="Auto-recorte" 
              descripcion="Detecta bordes del documento" 
            />
            <FeatureItem 
              icon="contrast" 
              titulo="Mejora de imagen" 
              descripcion="Optimiza calidad automáticamente" 
            />
            <FeatureItem 
              icon="layers" 
              titulo="Multi-página" 
              descripcion="Escanea varios documentos" 
            />
          </Stack>
        </Card>
      </Stack>

      {/* Botón continuar */}
      <YStack marginTop="$4">
        <Button
          title="Continuar"
          icon={"arrow-forward" as any}
          onPress={() => {
            // Aquí iría la lógica de escaneo
            console.log('Escaneando con:', metodoSeleccionado)
          }}
          disabled={!metodoSeleccionado}
          variant="primary"
          size="lg"
          fullWidth
        />
      </YStack>
    </ScreenLayout>
  )
}

function FeatureItem({ icon, titulo, descripcion }: { icon: string; titulo: string; descripcion: string }) {
  return (
    <HStack gap="$3" align="center">
      <YStack
        width={40}
        height={40}
        borderRadius={10}
        backgroundColor="$primary"
        justifyContent="center"
        alignItems="center"
      >
        <Ionicons name={icon as any} size={20} color="white" />
      </YStack>
      <Stack gap="$1">
        <Text variant="body" fontWeight="600" color="$color">
          {titulo}
        </Text>
        <Text variant="bodySmall" color="$color2">
          {descripcion}
        </Text>
      </Stack>
    </HStack>
  )
}
