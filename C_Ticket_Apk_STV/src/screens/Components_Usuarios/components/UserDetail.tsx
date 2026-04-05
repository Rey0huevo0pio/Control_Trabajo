import React from 'react'
import { YStack, ScrollView, XStack } from 'tamagui'
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
    <YStack gap={isMobile ? 16 : 20}>
      {/* iOS-style Profile Header */}
      <Card variant="grouped" padding={isMobile ? 20 : 24} borderRadius={20} overflow="hidden">
        <YStack alignItems="center" gap={isMobile ? 16 : 20} paddingTop={4}>
          {/* Back and Edit buttons */}
          <XStack width="100%" justifyContent="space-between" alignItems="center">
            <IconButton 
              icon="chevron-back" 
              onPress={onBack} 
              variant="ghost" 
              size={24} 
            />
            <Text variant={isMobile ? "title3" : "title2"} fontWeight="600" color="$color">
              Perfil del Usuario
            </Text>
            <IconButton 
              icon="create" 
              onPress={onEdit} 
              variant="ghost" 
              size={24} 
            />
          </XStack>

          {/* Large Avatar with shadow */}
          <YStack
            backgroundColor={roleColors[user.rol]}
            width={isMobile ? 100 : 120}
            height={isMobile ? 100 : 120}
            borderRadius="$full"
            justifyContent="center"
            alignItems="center"
            shadowColor="$color"
            shadowOpacity={0.15}
            shadowRadius={8}
            shadowOffset={{ width: 0, height: 4 }}
          >
            <Text variant={isMobile ? "h2" : "h1"} color="white" fontWeight="700">
              {user.nombre.charAt(0)}
              {user.apellido.charAt(0)}
            </Text>
          </YStack>

          {/* Name */}
          <Text variant={isMobile ? "h3" : "h2"} fontWeight="700" color="$color" textAlign="center">
            {user.nombre} {user.apellido}
          </Text>

          {/* Role and Status badges */}
          <HStack gap={8} alignItems="center" flexWrap="wrap" justifyContent="center">
            <YStack
              backgroundColor={roleColors[user.rol]}
              paddingHorizontal={12}
              paddingVertical={6}
              borderRadius="$full"
            >
              <Text variant="labelSmall" color="white" fontWeight="600">
                {roleLabels[user.rol]}
              </Text>
            </YStack>

            <YStack
              backgroundColor={
                user.estado === 'activo'
                  ? '$successMuted'
                  : user.estado === 'inactivo'
                  ? '$backgroundTertiary'
                  : '$errorMuted'
              }
              paddingHorizontal={12}
              paddingVertical={6}
              borderRadius="$full"
            >
              <Text
                variant="labelSmall"
                color={
                  user.estado === 'activo'
                    ? '$success'
                    : user.estado === 'inactivo'
                    ? '$color3'
                    : '$error'
                }
                fontWeight="600"
              >
                {user.estado === 'activo' ? '● Activo' : user.estado === 'inactivo' ? '● Inactivo' : '● Suspendido'}
              </Text>
            </YStack>
          </HStack>

          {/* Department */}
          <Text variant="bodySmall" color="$color2" textAlign="center">
            {user.departamento} • {user.puesto}
          </Text>
        </YStack>
      </Card>

      {/* iOS-style Grouped Information Sections */
      /* Información de contacto */}
      <Card variant="grouped" padding={0} borderRadius={16} overflow="hidden">
        <YStack backgroundColor="$backgroundSecondary">
          <SectionHeader icon="call" title="Información de Contacto" />
          
          <InfoRow 
            icon="mail-outline" 
            label="Email" 
            value={user.email} 
            isLast={!user.telefono}
          />
          {user.telefono && (
            <InfoRow 
              icon="call-outline" 
              label="Teléfono" 
              value={user.telefono} 
              isLast 
            />
          )}
          <InfoRow 
            icon="id-card-outline" 
            label="Control Usuario" 
            value={user.Control_Usuario} 
            isLast 
          />
        </YStack>
      </Card>

      {/* Información laboral */}
      <Card variant="grouped" padding={0} borderRadius={16} overflow="hidden">
        <YStack backgroundColor="$backgroundSecondary">
          <SectionHeader icon="briefcase" title="Información Laboral" />
          
          <InfoRow 
            icon="business-outline" 
            label="Departamento" 
            value={user.departamento} 
          />
          <InfoRow 
            icon="briefcase-outline" 
            label="Puesto" 
            value={user.puesto} 
          />
          <InfoRow
            icon="calendar-outline"
            label="Fecha de Ingreso"
            value={new Date(user.fecha_ingreso).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
          {user.ultimoAcceso && (
            <InfoRow 
              icon="time-outline" 
              label="Último Acceso" 
              value={user.ultimoAcceso} 
              isLast 
            />
          )}
        </YStack>
      </Card>

      {/* iOS-style Action Buttons Grid */}
      <Card variant="grouped" padding={isMobile ? 16 : 20} borderRadius={16}>
        <SectionHeader icon="sparkles" title="Acciones" marginBottom={12} />
        
        <YStack gap={isMobile ? 12 : 16}>
          {/* Primary actions */}
          <XStack gap={isMobile ? 12 : 16}>
            <ActionButton 
              icon="create" 
              label="Editar" 
              onPress={onEdit}
              color="$primary"
            />
            <ActionButton 
              icon="mail-outline" 
              label="Enviar Email" 
              onPress={() => {}}
              color="$primary"
            />
          </XStack>
          
          <XStack gap={isMobile ? 12 : 16}>
            <ActionButton 
              icon="call-outline" 
              label="Llamar" 
              onPress={() => {}}
              color="$success"
            />
            <ActionButton 
              icon="lock-closed-outline" 
              label="Reset Password" 
              onPress={() => {}}
              color="$warning"
            />
          </XStack>

          {/* Dangerous actions */}
          <XStack gap={isMobile ? 12 : 16}>
            <ActionButton 
              icon="ban-outline" 
              label="Suspender" 
              onPress={() => {}}
              color="$warning"
            />
            <ActionButton 
              icon="trash-outline" 
              label="Eliminar" 
              onPress={() => {}}
              color="$error"
            />
          </XStack>
        </YStack>
      </Card>
    </YStack>
  )
}

// iOS-style section header
function SectionHeader({ icon, title, marginBottom = 0 }: { icon: string; title: string; marginBottom?: number }) {
  return (
    <XStack 
      gap="$2" 
      alignItems="center" 
      padding="$4"
      paddingBottom="$3"
      backgroundColor="$backgroundTertiary"
      marginBottom={marginBottom}
    >
      <Ionicons name={icon as any} size={20} color="$primary" />
      <Text variant="label" fontWeight="600" color="$color">
        {title}
      </Text>
    </XStack>
  )
}

// iOS-style info row (like Settings app)
function InfoRow({ 
  icon, 
  label, 
  value, 
  isLast = false 
}: { 
  icon: string; 
  label: string; 
  value: string;
  isLast?: boolean;
}) {
  return (
    <XStack 
      gap="$3" 
      alignItems="center" 
      padding="$4"
      paddingTop="$3"
      backgroundColor="$backgroundSecondary"
      borderBottomWidth={isLast ? 0 : 0.5}
      borderBottomColor="$borderSubtle"
    >
      <YStack
        backgroundColor="$backgroundTertiary"
        width={44}
        height={44}
        borderRadius="$md"
        justifyContent="center"
        alignItems="center"
      >
        <Ionicons name={icon as any} size={22} color="$primary" />
      </YStack>
      <Stack flex={1}>
        <Text variant="caption" color="$color3">
          {label}
        </Text>
        <Text variant="body" fontWeight="500" color="$color">
          {value}
        </Text>
      </Stack>
    </XStack>
  )
}

// iOS-style action button
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
  return (
    <Card
      variant="outlined"
      padding="$4"
      onPress={onPress}
      cursor="pointer"
      flex={1}
      borderColor="$border"
      borderWidth={0.5}
      backgroundColor="$backgroundSecondary"
      pressStyle={{ opacity: 0.7, backgroundColor: '$backgroundTertiary' }}
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
