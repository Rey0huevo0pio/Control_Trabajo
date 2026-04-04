import React, { useState } from 'react'
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
import { RoleDefinition, UserPermission } from '../types'

const mockRoles: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    color: '$error',
    icon: 'shield',
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

export function RolePermissions() {
  const { isMobile } = useResponsive()
  const [roles, setRoles] = useState(mockRoles)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)

  return (
    <Card variant="outlined" padding="$4">
      <HStack justify="space-between" align="center" marginBottom="$4">
        <Text variant="h5" fontWeight="700" color="$color">
          Roles y Permisos
        </Text>
        <IconButton icon="add" onPress={() => {}} variant="ghost" size={20} />
      </HStack>

      <ScrollView>
        <YStack gap="$3">
          {roles.map((role) => (
            <Card
              key={role.id}
              variant="outlined"
              padding="$4"
            >
              <HStack
                gap="$3"
                onPress={() =>
                  setExpandedRole(expandedRole === role.id ? null : role.id)
                }
                cursor="pointer"
              >
                <YStack
                  backgroundColor={role.color}
                  width={56}
                  height={56}
                  borderRadius={16}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name={role.icon as any} size={26} color="white" />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text variant="body" fontWeight="700" color="$color">
                    {role.name}
                  </Text>
                  <Text variant="caption" color="$color2">
                    {role.description}
                  </Text>

                  <HStack gap="$2" marginTop="$2" flexWrap="wrap">
                    {Object.entries(role.permissions)
                      .filter(([_, value]) => value)
                      .slice(0, 3)
                      .map(([key]) => (
                        <YStack
                          key={key}
                          backgroundColor="$background"
                          paddingHorizontal="$2"
                          paddingVertical="$1"
                          borderRadius={6}
                        >
                          <Text variant="caption" color={role.color} fontWeight="600">
                            {key}
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

                <Ionicons
                  name={expandedRole === role.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="$color3"
                />
              </HStack>

              {/* Permisos detallados */}
              {expandedRole === role.id && (
                <YStack
                  borderTopWidth={1}
                  borderTopColor="$border"
                  paddingTop="$3"
                  marginTop="$3"
                  gap="$2"
                >
                  <Text variant="bodySmall" fontWeight="600" color="$color" marginBottom="$2">
                    Permisos detallados:
                  </Text>
                  {Object.entries(role.permissions).map(([permission, hasPermission]) => (
                    <HStack key={permission} gap="$2" align="center">
                      <Ionicons
                        name={hasPermission ? 'checkmark-circle' : 'close-circle'}
                        size={18}
                        color={hasPermission ? '$success' : '$error'}
                      />
                      <Text
                        variant="bodySmall"
                        color={hasPermission ? '$color' : '$color3'}
                      >
                        {permission.charAt(0).toUpperCase() + permission.slice(1)}
                      </Text>
                    </HStack>
                  ))}
                </YStack>
              )}
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </Card>
  )
}
