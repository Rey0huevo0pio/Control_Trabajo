import React from 'react'
import { YStack, ScrollView } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
} from '../../../components/design-system'
import { useResponsive } from '../../../components/useResponsive'
import { Employee, UserRole } from '../types'

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  it: 'TI',
  rh: 'RRHH',
  supervisor: 'Supervisor',
  empleado: 'Empleado',
  guest: 'Invitado',
}

const roleColors: Record<UserRole, string> = {
  admin: '$error',
  it: '$primary',
  rh: '$warning',
  supervisor: '$success',
  empleado: '$info',
  guest: '$color3',
}

interface UserDetailProps {
  user: Employee
  onEdit: () => void
  onBack: () => void
}

export function UserDetail({ user, onEdit, onBack }: UserDetailProps) {
  const { isMobile } = useResponsive()

  return (
    <Card variant="outlined" padding="$4">
      {/* Header */}
      <HStack gap="$3" align="center" marginBottom="$4">
        <IconButton icon="arrow-back-outline" onPress={onBack} variant="ghost" size={24} />
        <Text variant="h5" fontWeight="700" color="$color" flex={1}>
          Detalle del Usuario
        </Text>
        <IconButton icon="create" onPress={onEdit} variant="outline" size={20} />
      </HStack>

      <ScrollView>
        <YStack gap="$4">
          {/* Avatar e info principal */}
          <YStack alignItems="center" gap="$3" paddingVertical="$4">
            <YStack
              backgroundColor={roleColors[user.rol]}
              width={96}
              height={96}
              borderRadius="$full"
              justifyContent="center"
              alignItems="center"
            >
              <Text variant="h1" color="white" fontWeight="700">
                {user.nombre.charAt(0)}
                {user.apellido.charAt(0)}
              </Text>
            </YStack>

            <Text variant="h4" fontWeight="700" color="$color">
              {user.nombre} {user.apellido}
            </Text>

            <HStack gap="$2" align="center">
              <YStack
                backgroundColor={roleColors[user.rol]}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$full"
              >
                <Text variant="caption" color="white" fontWeight="600">
                  {roleLabels[user.rol]}
                </Text>
              </YStack>

              <YStack
                backgroundColor={
                  user.estado === 'activo'
                    ? '$successMuted'
                    : user.estado === 'inactivo'
                    ? '$color3'
                    : '$errorMuted'
                }
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$full"
              >
                <Text
                  variant="caption"
                  color={
                    user.estado === 'activo'
                      ? '$success'
                      : user.estado === 'inactivo'
                      ? '$color3'
                      : '$error'
                  }
                  fontWeight="600"
                >
                  {user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                </Text>
              </YStack>
            </HStack>
          </YStack>

          {/* Información de contacto */}
          <Stack gap="$3">
            <Text variant="h6" fontWeight="600" color="$color">
              Información de Contacto
            </Text>

            <InfoRow icon="mail" label="Email" value={user.email} />
            {user.telefono && <InfoRow icon="call" label="Teléfono" value={user.telefono} />}
            <InfoRow icon="id-card" label="Control Usuario" value={user.Control_Usuario} />
          </Stack>

          {/* Información laboral */}
          <Stack gap="$3">
            <Text variant="h6" fontWeight="600" color="$color">
              Información Laboral
            </Text>

            <InfoRow icon="business" label="Departamento" value={user.departamento} />
            <InfoRow icon="briefcase" label="Puesto" value={user.puesto} />
            <InfoRow
              icon="calendar"
              label="Fecha de Ingreso"
              value={new Date(user.fecha_ingreso).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
            {user.ultimoAcceso && (
              <InfoRow icon="time" label="Último Acceso" value={user.ultimoAcceso} />
            )}
          </Stack>

          {/* Acciones */}
          <YStack gap="$2" marginTop="$4">
            <Text variant="h6" fontWeight="600" color="$color">
              Acciones
            </Text>

            <HStack gap="$2" flexWrap="wrap">
              <ActionButton icon="create" label="Editar" onPress={onEdit} />
              <ActionButton icon="mail" label="Enviar Email" onPress={() => {}} />
              <ActionButton icon="call" label="Llamar" onPress={() => {}} />
              <ActionButton icon="lock-closed" label="Reset Password" onPress={() => {}} />
              <ActionButton icon="ban" label="Suspender" onPress={() => {}} color="$warning" />
              <ActionButton icon="trash" label="Eliminar" onPress={() => {}} color="$error" />
            </HStack>
          </YStack>
        </YStack>
      </ScrollView>
    </Card>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <HStack gap="$3" align="center">
      <YStack
        backgroundColor="$background"
        width={40}
        height={40}
        borderRadius={8}
        justifyContent="center"
        alignItems="center"
      >
        <Ionicons name={icon as any} size={20} color="$color2" />
      </YStack>
      <Stack flex={1}>
        <Text variant="caption" color="$color3">
          {label}
        </Text>
        <Text variant="bodySmall" fontWeight="500" color="$color">
          {value}
        </Text>
      </Stack>
    </HStack>
  )
}

function ActionButton({
  icon,
  label,
  onPress,
  color,
}: {
  icon: string
  label: string
  onPress: () => void
  color?: string
}) {
  const { isMobile } = useResponsive()
  
  return (
    <Card
      variant="outlined"
      padding="$3"
      onPress={onPress}
      cursor="pointer"
      flex={1}
      minWidth={isMobile ? '48%' : '30%'}
    >
      <YStack alignItems="center" gap="$2">
        <Ionicons name={icon as any} size={24} color={color || '$primary'} />
        <Text variant="caption" color={color || '$primary'} fontWeight="600">
          {label}
        </Text>
      </YStack>
    </Card>
  )
}
