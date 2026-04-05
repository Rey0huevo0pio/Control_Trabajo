import React, { useState } from 'react'
import { YStack, ScrollView, Input, XStack } from 'tamagui'
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

const mockUsers: Employee[] = [
  {
    _id: '1',
    Control_Usuario: 'EMP001',
    nombre: 'Carlos',
    apellido: 'Ramírez',
    email: 'carlos.ramirez@empresa.com',
    telefono: '+52 55 1234 5678',
    departamento: 'TI',
    puesto: 'Desarrollador Senior',
    rol: 'it',
    estado: 'activo',
    fecha_ingreso: '2023-01-15',
    fecha_creacion: '2023-01-15',
    ultimoAcceso: 'Hace 2 horas',
  },
  {
    _id: '2',
    Control_Usuario: 'EMP002',
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@empresa.com',
    departamento: 'RRHH',
    puesto: 'Coordinadora de RRHH',
    rol: 'rh',
    estado: 'activo',
    fecha_ingreso: '2022-06-20',
    fecha_creacion: '2022-06-20',
    ultimoAcceso: 'Hace 1 día',
  },
  {
    _id: '3',
    Control_Usuario: 'EMP003',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@empresa.com',
    departamento: 'Operaciones',
    puesto: 'Supervisor de Planta',
    rol: 'supervisor',
    estado: 'activo',
    fecha_ingreso: '2021-03-10',
    fecha_creacion: '2021-03-10',
    ultimoAcceso: 'Hace 30 minutos',
  },
  {
    _id: '4',
    Control_Usuario: 'EMP004',
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@empresa.com',
    departamento: 'Administración',
    puesto: 'Administrador',
    rol: 'admin',
    estado: 'activo',
    fecha_ingreso: '2020-01-05',
    fecha_creacion: '2020-01-05',
    ultimoAcceso: 'En línea',
  },
]

const roleColors: Record<UserRole, string> = {
  admin: '$error',
  it: '$primary',
  rh: '$warning',
  supervisor: '$success',
  empleado: '$info',
  guest: '$color3',
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  it: 'TI',
  rh: 'RRHH',
  supervisor: 'Supervisor',
  empleado: 'Empleado',
  guest: 'Invitado',
}

interface UserListProps {
  onUserSelect: (user: Employee) => void
  onEdit: (user: Employee) => void
  onCreate: () => void
}

export function UserList({ onUserSelect, onEdit, onCreate }: UserListProps) {
  const { isMobile } = useResponsive()
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRol, setFilterRol] = useState<UserRole | 'all'>('all')

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Control_Usuario.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRol = filterRol === 'all' || user.rol === filterRol

    return matchesSearch && matchesRol
  })

  return (
    <YStack gap={isMobile ? 16 : 20}>
      {/* iOS-style Search Bar */}
      <Card variant="grouped" padding={isMobile ? 12 : 16} borderRadius={16}>
        <XStack gap={isMobile ? 12 : 16} alignItems="center">
          <YStack
            flex={1}
            backgroundColor="$backgroundTertiary"
            borderRadius={12}
            paddingHorizontal={16}
            paddingVertical={isMobile ? 12 : 14}
            justifyContent="center"
          >
            <Input
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="transparent"
              borderWidth={0}
              padding={0}
              height="auto"
              fontSize={17}
              placeholderTextColor="$color3"
            />
          </YStack>
          <IconButton
            icon="add"
            onPress={onCreate}
            variant="primary"
            size={24}
          />
        </XStack>
      </Card>

      {/* iOS-style Filter Chips - Horizontal scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: isMobile ? 4 : 8, gap: 8 }}
        style={{ marginLeft: -4, marginRight: -4 }}
      >
        <FilterChip
          label="Todos"
          active={filterRol === 'all'}
          onPress={() => setFilterRol('all')}
        />
        {(Object.keys(roleLabels) as UserRole[]).map((rol) => (
          <FilterChip
            key={rol}
            label={roleLabels[rol]}
            active={filterRol === rol}
            onPress={() => setFilterRol(rol)}
            color={roleColors[rol]}
          />
        ))}
      </ScrollView>

      {/* iOS-style Grouped User List */}
      <Card variant="grouped" padding={0} borderRadius={16} overflow="hidden">
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack>
            {filteredUsers.map((user, index) => (
              <YStack
                key={user._id}
                onPress={() => onUserSelect(user)}
                cursor="pointer"
                backgroundColor="$backgroundSecondary"
                borderBottomWidth={index < filteredUsers.length - 1 ? 0.5 : 0}
                borderBottomColor="$borderSubtle"
                padding={isMobile ? 16 : 20}
              >
                <HStack gap={isMobile ? 12 : 16} alignItems="center">
                  {/* Large Avatar */}
                  <YStack
                    backgroundColor={roleColors[user.rol]}
                    width={isMobile ? 56 : 60}
                    height={isMobile ? 56 : 60}
                    borderRadius="$full"
                    justifyContent="center"
                    alignItems="center"
                    shadowColor="$color"
                    shadowOpacity={0.1}
                    shadowRadius={4}
                    shadowOffset={{ width: 0, height: 2 }}
                  >
                    <Text variant={isMobile ? "h6" : "h5"} color="white" fontWeight="700">
                      {user.nombre.charAt(0)}
                      {user.apellido.charAt(0)}
                    </Text>
                  </YStack>

                  {/* User Info */}
                  <Stack flex={1} gap={isMobile ? 6 : 8}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text variant={isMobile ? "bodySmall" : "body"} fontWeight="600" color="$color" flex={1} flexShrink={1}>
                        {user.nombre} {user.apellido}
                      </Text>
                      <YStack
                        backgroundColor={
                          user.estado === 'activo'
                            ? '$successMuted'
                            : user.estado === 'inactivo'
                            ? '$backgroundTertiary'
                            : '$errorMuted'
                        }
                        paddingHorizontal={10}
                        paddingVertical={4}
                        borderRadius="$full"
                        marginLeft={8}
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
                          {user.estado === 'activo' ? 'Activo' : user.estado === 'inactivo' ? 'Inactivo' : 'Suspendido'}
                        </Text>
                      </YStack>
                    </HStack>

                    <Text variant="caption" color="$color2" flexShrink={1}>
                      {user.email}
                    </Text>

                    <HStack gap={8} alignItems="center" flexWrap="wrap">
                      <YStack
                        backgroundColor={roleColors[user.rol]}
                        paddingHorizontal={10}
                        paddingVertical={4}
                        borderRadius="$full"
                      >
                        <Text variant="caption" color="white" fontWeight="600">
                          {roleLabels[user.rol]}
                        </Text>
                      </YStack>
                      <Text variant="caption" color="$color3">
                        {user.departamento}
                      </Text>
                      <Text variant="caption" color="$color3">
                        {user.Control_Usuario}
                      </Text>
                    </HStack>

                    <Text variant="caption" color="$color4">
                      Último acceso: {user.ultimoAcceso || 'Nunca'}
                    </Text>
                  </Stack>

                  {/* Edit button and chevron */}
                  <HStack gap={4} alignItems="center">
                    <IconButton
                      icon="create"
                      onPress={() => onEdit(user)}
                      variant="ghost"
                      size={20}
                    />
                    <Ionicons name="chevron-forward" size={20} color="$color3" />
                  </HStack>
                </HStack>
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      </Card>

      {/* Summary */}
      <YStack alignItems="center" paddingVertical={12}>
        <Text variant="caption" color="$color3">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </Text>
      </YStack>
    </YStack>
  )
}

// iOS-style filter chip
function FilterChip({
  label,
  active,
  onPress,
  color,
}: {
  label: string
  active: boolean
  onPress: () => void
  color?: string
}) {
  return (
    <Card
      variant={active ? 'filled' : 'outlined'}
      backgroundColor={active ? (color === '$primary' ? '$primaryMuted' : color === '$success' ? '$successMuted' : color === '$warning' ? '$warningMuted' : '$backgroundTertiary') : 'transparent'}
      borderColor={active ? color || '$primary' : '$border'}
      borderWidth={active ? 0 : 0.5}
      paddingHorizontal="$4"
      paddingVertical="$3"
      borderRadius="$full"
      onPress={onPress}
      cursor="pointer"
    >
      <Text
        variant="labelSmall"
        fontWeight="600"
        color={active ? color || '$primary' : '$color2'}
      >
        {label}
      </Text>
    </Card>
  )
}
