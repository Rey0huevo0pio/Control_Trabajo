import React, { useState } from 'react'
import { YStack, Input } from 'tamagui'
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

export default function CrearArchiveroScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [visibilidad, setVisibilidad] = useState<'publico' | 'privado'>('privado')

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
              Crear Archivero
            </Text>
          </HStack>
          <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
            Nuevo espacio de trabajo
          </Text>
        </Stack>
      </Card>

      {/* Formulario */}
      <Stack gap="$4">
        <Card variant="outlined" padding="$4">
          <Stack gap="$3">
            <Text variant="h6" fontWeight="700" color="$color">
              Información Básica
            </Text>

            <Stack gap="$2">
              <Text variant="label" color="$color">
                Nombre del Archivero *
              </Text>
              <Input
                placeholder="Ej: Documentos Proyecto Alpha"
                value={nombre}
                onChangeText={setNombre}
                borderWidth={1}
                borderColor="$border"
                borderRadius={12}
                padding="$3"
                fontSize={15}
              />
            </Stack>

            <Stack gap="$2">
              <Text variant="label" color="$color">
                Descripción
              </Text>
              <Input
                placeholder="Describe el propósito de este archivero"
                value={descripcion}
                onChangeText={setDescripcion}
                borderWidth={1}
                borderColor="$border"
                borderRadius={12}
                padding="$3"
                fontSize={15}
                multiline
                minHeight={80}
              />
            </Stack>
          </Stack>
        </Card>

        {/* Visibilidad */}
        <Card variant="outlined" padding="$4">
          <Stack gap="$3">
            <HStack gap="$2" align="center">
              <Ionicons name="lock-closed" size={20} color="$color" />
              <Text variant="h6" fontWeight="700" color="$color">
                Visibilidad
              </Text>
            </HStack>

            <HStack gap="$3">
              <Card
                variant={visibilidad === 'publico' ? 'default' : 'outlined'}
                backgroundColor={visibilidad === 'publico' ? '$successMuted' : undefined}
                borderColor={visibilidad === 'publico' ? '$success' : undefined}
                padding="$4"
                flex={1}
                onPress={() => setVisibilidad('publico')}
              >
                <Stack alignItems="center" gap="$2">
                  <Ionicons name="earth" size={32} color="$success" />
                  <Text variant="body" fontWeight="700" color="$color">
                    Público
                  </Text>
                  <Text variant="caption" color="$color3" textAlign="center">
                    Cualquier usuario puede ver y descargar archivos
                  </Text>
                </Stack>
              </Card>

              <Card
                variant={visibilidad === 'privado' ? 'default' : 'outlined'}
                backgroundColor={visibilidad === 'privado' ? '$errorMuted' : undefined}
                borderColor={visibilidad === 'privado' ? '$error' : undefined}
                padding="$4"
                flex={1}
                onPress={() => setVisibilidad('privado')}
              >
                <Stack alignItems="center" gap="$2">
                  <Ionicons name="lock-closed" size={32} color="$error" />
                  <Text variant="body" fontWeight="700" color="$color">
                    Privado
                  </Text>
                  <Text variant="caption" color="$color3" textAlign="center">
                    Solo miembros agregados pueden acceder
                  </Text>
                </Stack>
              </Card>
            </HStack>
          </Stack>
        </Card>

        {/* Info adicional */}
        <Card variant="filled" padding="$4">
          <Stack gap="$2">
            <HStack gap="$2" align="center">
              <Ionicons name="information-circle" size={20} color="$primary" />
              <Text variant="body" fontWeight="600" color="$color">
                ¿Qué significa cada opción?
              </Text>
            </HStack>
            <Text variant="bodySmall" color="$color2">
              • <Text fontWeight="700">Público:</Text> Todos los empleados pueden ver el archivero y sus contenidos
            </Text>
            <Text variant="bodySmall" color="$color2">
              • <Text fontWeight="700">Privado:</Text> Solo tú y los miembros que agregues tendrán acceso
            </Text>
            <Text variant="bodySmall" color="$color2">
              • Puedes cambiar la visibilidad en cualquier momento
            </Text>
          </Stack>
        </Card>
      </Stack>

      {/* Botones */}
      <YStack marginTop="$4" gap="$3">
        <Button
          title="Crear Archivero"
          icon={"folder-open" as any}
          onPress={() => {
            console.log('Creando archivero:', { nombre, descripcion, visibilidad })
          }}
          disabled={!nombre}
          variant="primary"
          size="lg"
          fullWidth
        />
        <Button
          title="Cancelar"
          variant="ghost"
          size="lg"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      </YStack>
    </ScreenLayout>
  )
}
