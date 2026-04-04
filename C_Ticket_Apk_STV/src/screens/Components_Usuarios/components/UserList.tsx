import React, { useState } from 'react'
import { YStack, ScrollView, Input } from 'tamagui'
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
    <Card variant="outlined" padding="$4">
      {/* Buscador y acciones */}
      <HStack gap="$3" marginBottom="$4">
        <Input
          flex={1}
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <IconButton
          icon="add"
          onPress={onCreate}
          variant="primary"
          size={24}
        />
      </HStack>

      {/* Filtros de rol */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} marginBottom="$4">
        <HStack gap="$2">
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
        </HStack>
      </ScrollView>

      {/* Lista de usuarios */}
      <ScrollView>
        <YStack gap="$3">
          {filteredUsers.map((user) => (
            <Card
              key={user._id}
              variant="outlined"
              padding="$4"
              onPress={() => onUserSelect(user)}
              cursor="pointer"
            >
              <HStack gap="$3">
                {/* Avatar */}
                <YStack
                  backgroundColor={roleColors[user.rol]}
                  width={56}
                  height={56}
                  borderRadius="$full"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text variant="h6" color="white" fontWeight="700">
                    {user.nombre.charAt(0)}
                    {user.apellido.charAt(0)}
                  </Text>
                </YStack>

                {/* Info */}
                <Stack flex={1} gap="$1">
                  <HStack justify="space-between" align="center">
                    <Text variant="body" fontWeight="700" color="$color">
                      {user.nombre} {user.apellido}
                    </Text>
                    <YStack
                      backgroundColor={
                        user.estado === 'activo'
                          ? '$successMuted'
                          : user.estado === 'inactivo'
                          ? '$color3'
                          : '$errorMuted'
                      }
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius={6}
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
                        {user.estado}
                      </Text>
                    </YStack>
                  </HStack>

                  <Text variant="caption" color="$color2">
                    {user.email}
                  </Text>

                  <HStack gap="$2" align="center" marginTop="$1">
                    <YStack
                      backgroundColor={roleColors[user.rol]}
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius={6}
                    >
                      <Text variant="caption" color="white" fontWeight="600">
                        {roleLabels[user.rol]}
                      </Text>
                    </YStack>
                    <Text variant="caption" color="$color3">
                      • {user.departamento}
                    </Text>
                    <Text variant="caption" color="$color3">
                      • {user.Control_Usuario}
                    </Text>
                  </HStack>

                  <Text variant="caption" color="$color4" marginTop="$1">
                    Último acceso: {user.ultimoAcceso || 'Nunca'}
                  </Text>
                </Stack>

                {/* Acciones */}
                <HStack gap="$1">
                  <IconButton
                    icon="create"
                    onPress={() => onEdit(user)}
                    variant="ghost"
                    size={20}
                  />
                  <Ionicons name="chevron-forward" size={20} color="$color3" />
                </HStack>
              </HStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>

      {/* Resumen */}
      <YStack
        borderTopWidth={1}
        borderTopColor="$border"
        paddingTop="$3"
        marginTop="$3"
      >
        <Text variant="caption" color="$color3">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </Text>
      </YStack>
    </Card>
  )
}

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
      backgroundColor={active ? '$primaryMuted' : 'transparent'}
      borderColor={active ? color || '$primary' : '$border'}
      paddingVertical="$2"
      paddingHorizontal="$3"
      onPress={onPress}
      cursor="pointer"
    >
      <Text
        variant="caption"
        fontWeight="600"
        color={active ? color || '$primary' : '$color2'}
      >
        {label}
      </Text>
    </Card>
  )
}
