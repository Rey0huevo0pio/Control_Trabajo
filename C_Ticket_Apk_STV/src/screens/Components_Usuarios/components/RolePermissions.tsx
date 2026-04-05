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
    <YStack gap={isMobile ? 16 : 20}>
      {/* Header */}
      <Card variant="grouped" padding={isMobile ? 16 : 20} borderRadius={16}>
        <XStack justifyContent="space-between" alignItems="center">
          <Stack gap={isMobile ? 4 : 6} flex={1}>
            <Text variant={isMobile ? "title3" : "title2"} fontWeight="700" color="$color">
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
        <YStack gap={isMobile ? 16 : 20}>
          {roles.map((role) => (
            <Card
              key={role.id}
              variant="grouped"
              padding={0}
              borderRadius={16}
              overflow="hidden"
            >
              <YStack backgroundColor="$backgroundSecondary">
                {/* Role Header (clickable to expand/collapse) */}
                <XStack
                  gap={isMobile ? 12 : 16}
                  alignItems="center"
                  padding={isMobile ? 16 : 20}
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
                    width={isMobile ? 52 : 56}
                    height={isMobile ? 52 : 56}
                    borderRadius={12}
                    justifyContent="center"
                    alignItems="center"
                    shadowColor={role.color}
                    shadowOpacity={0.2}
                    shadowRadius={4}
                    shadowOffset={{ width: 0, height: 2 }}
                  >
                    <Ionicons name={role.icon as any} size={isMobile ? 24 : 28} color="white" />
                  </YStack>

                  {/* Role Info */}
                  <Stack flex={1} gap={isMobile ? 4 : 6}>
                    <Text variant={isMobile ? "bodySmall" : "body"} fontWeight="600" color="$color">
                      {role.name}
                    </Text>
                    <Text variant="caption" color="$color2">
                      {role.description}
                    </Text>

                    {/* Permission badges */}
                    <HStack gap={6} marginTop={6} flexWrap="wrap">
                      {Object.entries(role.permissions)
                        .filter(([_, value]) => value)
                        .slice(0, 3)
                        .map(([key]) => (
                          <YStack
                            key={key}
                            backgroundColor="$backgroundTertiary"
                            paddingHorizontal={8}
                            paddingVertical={4}
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
                      padding={isMobile ? 16 : 20} 
                      paddingBottom={12}
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
                        gap={isMobile ? 12 : 16}
                        alignItems="center"
                        padding={isMobile ? 16 : 20}
                        paddingTop={12}
                        borderBottomWidth={index < Object.entries(role.permissions).length - 1 ? 0.5 : 0}
                        borderBottomColor="$borderSubtle"
                        backgroundColor="$backgroundSecondary"
                      >
                        <Ionicons
                          name={hasPermission ? 'checkmark-circle' : 'close-circle-outline'}
                          size={isMobile ? 20 : 24}
                          color={hasPermission ? '$success' : '$color4'}
                        />
                        <Stack flex={1}>
                          <Text 
                            variant={isMobile ? "bodySmall" : "body"}
                            fontWeight={hasPermission ? '600' : '400'}
                            color={hasPermission ? '$color' : '$color3'}
                          >
                            {permissionLabels[permission as keyof UserPermission]}
                          </Text>
                        </Stack>
                        <YStack
                          backgroundColor={hasPermission ? '$successMuted' : '$backgroundTertiary'}
                          paddingHorizontal={10}
                          paddingVertical={4}
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
