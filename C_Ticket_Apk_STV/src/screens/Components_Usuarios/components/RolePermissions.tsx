import React, { useState } from 'react'
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
import { RoleDefinition, UserPermission } from '../types'

const mockRoles: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    color: '$error',
    icon: 'shield-checkmark',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      approve: true,
    },
  },
  {
    id: 'it',
    name: 'TI',
    description: 'Soporte técnico y sistemas',
    color: '$primary',
    icon: 'hardware-chip',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      approve: false,
    },
  },
  {
    id: 'rh',
    name: 'RRHH',
    description: 'Recursos Humanos',
    color: '$warning',
    icon: 'people',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      approve: true,
    },
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Supervisión de operaciones',
    color: '$success',
    icon: 'eye',
    permissions: {
      create: false,
      read: true,
      update: true,
      delete: false,
      export: false,
      approve: true,
    },
  },
  {
    id: 'empleado',
    name: 'Empleado',
    description: 'Empleado estándar',
    color: '$info',
    icon: 'person',
    permissions: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
      approve: false,
    },
  },
  {
    id: 'guest',
    name: 'Invitado',
    description: 'Acceso limitado',
    color: '$color3',
    icon: 'person-outline',
    permissions: {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      approve: false,
    },
  },
]

const permissionLabels: Record<keyof UserPermission, string> = {
  create: 'Crear',
  read: 'Leer',
  update: 'Actualizar',
  delete: 'Eliminar',
  export: 'Exportar',
  approve: 'Aprobar',
}

export function RolePermissions() {
  const { isMobile } = useResponsive()
  const [roles, setRoles] = useState(mockRoles)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)

  return (
    <YStack gap="$4">
      {/* Header */}
      <Card variant="grouped" padding="$4" borderRadius="$lg">
        <XStack justifyContent="space-between" alignItems="center">
          <Stack gap="$1">
            <Text variant="title2" fontWeight="700" color="$color">
              Roles y Permisos
            </Text>
            <Text variant="bodySmall" color="$color2">
              Configura los permisos de cada rol en el sistema
            </Text>
          </Stack>
          <IconButton icon="add" onPress={() => {}} variant="primary" size={24} />
        </XStack>
      </Card>

      {/* iOS Settings-style Role Cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          {roles.map((role) => (
            <Card
              key={role.id}
              variant="grouped"
              padding={0}
              borderRadius="$lg"
              overflow="hidden"
            >
              <YStack backgroundColor="$backgroundSecondary">
                {/* Role Header (clickable to expand/collapse) */}
                <XStack
                  gap="$4"
                  alignItems="center"
                  padding="$4"
                  onPress={() =>
                    setExpandedRole(expandedRole === role.id ? null : role.id)
                  }
                  cursor="pointer"
                  pressStyle={{ opacity: 0.7 }}
                  backgroundColor="$backgroundSecondary"
                >
                  {/* Role Icon */}
                  <YStack
                    backgroundColor={role.color}
                    width={56}
                    height={56}
                    borderRadius="$md"
                    justifyContent="center"
                    alignItems="center"
                    shadowColor={role.color}
                    shadowOpacity={0.2}
                    shadowRadius={4}
                    shadowOffset={{ width: 0, height: 2 }}
                  >
                    <Ionicons name={role.icon as any} size={28} color="white" />
                  </YStack>

                  {/* Role Info */}
                  <Stack flex={1} gap="$1">
                    <Text variant="body" fontWeight="600" color="$color">
                      {role.name}
                    </Text>
                    <Text variant="bodySmall" color="$color2">
                      {role.description}
                    </Text>

                    {/* Permission badges */}
                    <HStack gap="$2" marginTop="$2" flexWrap="wrap">
                      {Object.entries(role.permissions)
                        .filter(([_, value]) => value)
                        .slice(0, 3)
                        .map(([key]) => (
                          <YStack
                            key={key}
                            backgroundColor="$backgroundTertiary"
                            paddingHorizontal="$3"
                            paddingVertical="$1"
                            borderRadius="$full"
                          >
                            <Text variant="caption" color={role.color} fontWeight="600">
                              {permissionLabels[key as keyof UserPermission]}
                            </Text>
                          </YStack>
                        ))}
                      {Object.values(role.permissions).filter(Boolean).length > 3 && (
                        <Text variant="caption" color="$color3">
                          +{Object.values(role.permissions).filter(Boolean).length - 3} más
                        </Text>
                      )}
                    </HStack>
                  </Stack>

                  {/* Expand/Collapse indicator */}
                  <Ionicons
                    name={expandedRole === role.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="$color3"
                  />
                </XStack>

                {/* Expanded permissions detail */}
                {expandedRole === role.id && (
                  <YStack
                    borderTopWidth={0.5}
                    borderTopColor="$borderSubtle"
                    backgroundColor="$backgroundTertiary"
                  >
                    <XStack 
                      padding="$4" 
                      paddingBottom="$3"
                      borderBottomWidth={0.5}
                      borderBottomColor="$borderSubtle"
                    >
                      <Text variant="label" fontWeight="600" color="$color">
                        Permisos detallados
                      </Text>
                    </XStack>
                    
                    {Object.entries(role.permissions).map(([permission, hasPermission], index) => (
                      <XStack
                        key={permission}
                        gap="$3"
                        alignItems="center"
                        padding="$4"
                        paddingTop="$3"
                        borderBottomWidth={index < Object.entries(role.permissions).length - 1 ? 0.5 : 0}
                        borderBottomColor="$borderSubtle"
                        backgroundColor="$backgroundSecondary"
                      >
                        <Ionicons
                          name={hasPermission ? 'checkmark-circle' : 'close-circle-outline'}
                          size={24}
                          color={hasPermission ? '$success' : '$color4'}
                        />
                        <Stack flex={1}>
                          <Text 
                            variant="body" 
                            fontWeight={hasPermission ? '600' : '400'}
                            color={hasPermission ? '$color' : '$color3'}
                          >
                            {permissionLabels[permission as keyof UserPermission]}
                          </Text>
                        </Stack>
                        <YStack
                          backgroundColor={hasPermission ? '$successMuted' : '$backgroundTertiary'}
                          paddingHorizontal="$3"
                          paddingVertical="$2"
                          borderRadius="$full"
                        >
                          <Text
                            variant="caption"
                            color={hasPermission ? '$success' : '$color3'}
                            fontWeight="600"
                          >
                            {hasPermission ? 'Concedido' : 'Denegado'}
                          </Text>
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>
                )}
              </YStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  )
}
