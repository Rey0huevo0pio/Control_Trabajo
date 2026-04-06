import React, { useState, useEffect } from 'react'
import { YStack, ScrollView, Input, XStack, Spinner } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
} from '../../../components/design-system'
import { useResponsive } from '../../../components/useResponsive'
import { Employee, UserRole, UserFilter } from '../types'
import { userService } from '../../../services/userService'

// ==========================================
// COLORES Y ETIQUETAS POR ROL
// ==========================================
const roleColors: Record<UserRole, string> = {
  admin: '$error',
  it: '$primary',
  rh: '$warning',
  supervisor: '$success',
  vigilante: '$info',
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  it: 'TI',
  rh: 'RRHH',
  supervisor: 'Supervisor',
  vigilante: 'Vigilante',
}

interface UserListProps {
  onUserSelect: (user: Employee) => void
  onEdit: (user: Employee) => void
  onCreate: () => void
  onRefresh?: () => void
}

export function UserList({ onUserSelect, onEdit, onCreate, onRefresh }: UserListProps) {
  const { isMobile } = useResponsive()
  const [users, setUsers] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRol, setFilterRol] = useState<UserRole | 'all'>('all')
  const [filterActivo, setFilterActivo] = useState<boolean | null>(null)

  // ==========================================
  // CARGAR USUARIOS DESDE EL BACKEND
  // ==========================================
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Debug: Verificar token
      const { getAuthToken } = await import('../../../services/api')
      const currentToken = getAuthToken()
      console.log('🔑 Token actual en UserList:', currentToken ? '✅ Token presente' : '❌ NO hay token')
      
      const filters: any = {}
      if (searchQuery) filters.search = searchQuery
      if (filterRol !== 'all') filters.rol = filterRol
      if (filterActivo !== null) filters.activo = filterActivo

      const data = await userService.getUsers(filters)
      console.log('✅ Usuarios cargados:', data.length)
      setUsers(data)
    } catch (err: any) {
      console.error('❌ Error cargando usuarios:', err.message)
      
      if (err.response?.status === 401) {
        setError('No autorizado. Por favor, cierra sesión y vuelve a iniciar.')
      } else {
        setError(err.response?.data?.message || 'Error al cargar usuarios')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Recargar cuando cambian los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers()
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, filterRol, filterActivo])

  // Función para refrescar manualmente
  const handleRefresh = async () => {
    await loadUsers()
    onRefresh?.()
  }

  // ==========================================
  // TOGGLE ESTADO DEL USUARIO
  // ==========================================
  const handleToggleActive = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await userService.toggleUserActive(userId)
      await loadUsers() // Recargar lista
    } catch (err: any) {
      console.error('Error cambiando estado:', err)
      alert('Error al cambiar estado del usuario')
    }
  }

  // ==========================================
  // ELIMINAR USUARIO
  // ==========================================
  const handleDelete = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmDelete = confirm('¿Estás seguro de eliminar este usuario?')
    if (!confirmDelete) return

    try {
      await userService.deleteUser(userId)
      await loadUsers() // Recargar lista
    } catch (err: any) {
      console.error('Error eliminando usuario:', err)
      alert('Error al eliminar usuario')
    }
  }

  // ==========================================
  // RENDER
  // ==========================================
  if (loading && users.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5">
        <Spinner size="large" color="$primary" />
        <Text variant="body" color="$color2" marginTop="$3">
          Cargando usuarios...
        </Text>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$5" gap="$3">
        <Ionicons name="alert-circle" size={48} color="$error" />
        <Text variant="body" color="$error" textAlign="center">
          {error}
        </Text>
        <IconButton
          icon="refresh"
          onPress={loadUsers}
          variant="primary"
          size={24}
        />
      </YStack>
    )
  }

  return (
    <YStack gap={isMobile ? 16 : 20}>
      {/* Search Bar */}
      <Card variant="outlined" padding={isMobile ? 12 : 16} borderRadius={16}>
        <XStack gap={isMobile ? 12 : 16} alignItems="center">
          <YStack
            flex={1}
            backgroundColor="$background2"
            borderRadius={12}
            paddingHorizontal={16}
            paddingVertical={isMobile ? 12 : 14}
          >
            <Input
              placeholder="Buscar por nombre, email o código..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              backgroundColor="transparent"
              borderWidth={0}
              padding={0}
              fontSize={16}
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

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: isMobile ? 4 : 8, gap: 8 }}
      >
        <FilterChip
          label={`Todos (${users.length})`}
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

      {/* Lista de Usuarios */}
      <Card variant="outlined" padding={0} borderRadius={16} overflow="hidden">
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack>
            {users.length === 0 ? (
              <YStack padding="$5" alignItems="center" gap="$3">
                <Ionicons name="people" size={48} color="$color3" />
                <Text variant="body" color="$color2" textAlign="center">
                  No se encontraron usuarios
                </Text>
              </YStack>
            ) : (
              users.map((user, index) => (
                <YStack
                  key={user.id}
                  onPress={() => onUserSelect(user)}
                  cursor="pointer"
                  backgroundColor="$background"
                  borderBottomWidth={index < users.length - 1 ? 1 : 0}
                  borderBottomColor="$border"
                  padding={isMobile ? 16 : 20}
                >
                  <HStack gap={isMobile ? 12 : 16} alignItems="center">
                    {/* Avatar */}
                    <YStack
                      backgroundColor={roleColors[user.rol]}
                      width={isMobile ? 56 : 60}
                      height={isMobile ? 56 : 60}
                      borderRadius="$full"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text variant={isMobile ? 'h6' : 'h5'} color="white" fontWeight="700">
                        {user.nombre.charAt(0)}
                        {user.apellido.charAt(0)}
                      </Text>
                    </YStack>

                    {/* Info */}
                    <Stack flex={1} gap={isMobile ? 6 : 8}>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text variant={isMobile ? 'bodySmall' : 'body'} fontWeight="600" color="$color" flex={1}>
                          {user.nombre} {user.apellido}
                        </Text>
                        <YStack
                          backgroundColor={user.activo ? '$successMuted' : '$errorMuted'}
                          paddingHorizontal={10}
                          paddingVertical={4}
                          borderRadius="$full"
                          marginLeft={8}
                          onPress={() => handleToggleActive(user.id, {} as React.MouseEvent)}
                        >
                          <Text
                            variant="caption"
                            color={user.activo ? '$success' : '$error'}
                            fontWeight="600"
                          >
                            {user.activo ? 'Activo' : 'Inactivo'}
                          </Text>
                        </YStack>
                      </HStack>

                      <Text variant="caption" color="$color2">
                        {user.email || user.Control_Usuario}
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
                        {user.departamento && (
                          <Text variant="caption" color="$color3">
                            {user.departamento}
                          </Text>
                        )}
                        <Text variant="caption" color="$color3">
                          {user.Control_Usuario}
                        </Text>
                      </HStack>

                      <Text variant="caption" color="$color3">
                        Último acceso: {user.ultimoAcceso ? new Date(user.ultimoAcceso).toLocaleString() : 'Nunca'}
                      </Text>
                    </Stack>

                    {/* Acciones */}
                    <HStack gap={4} alignItems="center">
                      <IconButton
                        icon="create"
                        onPress={() => onEdit(user)}
                        variant="ghost"
                        size={20}
                      />
                      <IconButton
                        icon="trash"
                        onPress={() => handleDelete(user.id, {} as React.MouseEvent)}
                        variant="ghost"
                        size={20}
                      />
                      <Ionicons name="chevron-forward" size={20} color="$color3" />
                    </HStack>
                  </HStack>
                </YStack>
              ))
            )}
          </YStack>
        </ScrollView>
      </Card>

      {/* Resumen */}
      <YStack alignItems="center" paddingVertical={12}>
        <Text variant="caption" color="$color2">
          {users.length} usuario{users.length !== 1 ? 's' : ''} encontrado{users.length !== 1 ? 's' : ''}
        </Text>
      </YStack>
    </YStack>
  )
}

// ==========================================
// FILTER CHIP
// ==========================================
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
      variant={active ? 'default' : 'outlined'}
      backgroundColor={active ? `${color}20` : 'transparent'}
      borderColor={active ? color : '$border'}
      borderWidth={1}
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$full"
      onPress={onPress}
      cursor="pointer"
    >
      <Text
        variant="caption"
        fontWeight="600"
        color={active ? color : '$color2'}
      >
        {label}
      </Text>
    </Card>
  )
}
