import React, { useState } from 'react'
import { YStack, ScrollView, Input, XStack, Spinner } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
  Button,
} from '../../../components/design-system'
import { useResponsive } from '../../../components/useResponsive'
import { Employee, UserRole, CreateUserDto, UpdateUserDto } from '../types'
import { userService } from '../../../services/userService'
import { UserRole as ServiceUserRole } from '../../../types'

interface UserFormProps {
  mode: 'create' | 'edit'
  user?: Employee | null
  onSave: () => void
  onCancel: () => void
}

export function UserForm({ mode, user, onSave, onCancel }: UserFormProps) {
  const { isMobile } = useResponsive()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<any>({
    Control_Usuario: user?.Control_Usuario || '',
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    departamento: user?.departamento || '',
    puesto: user?.puesto || '',
    rol: user?.rol || 'vigilante',
    ...(mode === 'create' ? { password: '' } : {}),
  })

  const roles: { id: UserRole; label: string; description: string; icon: string }[] = [
    { id: 'admin', label: 'Administrador', description: 'Acceso completo', icon: 'shield-checkmark' },
    { id: 'it', label: 'TI', description: 'Soporte técnico', icon: 'hardware-chip' },
    { id: 'rh', label: 'RRHH', description: 'Recursos humanos', icon: 'people' },
    { id: 'supervisor', label: 'Supervisor', description: 'Supervisión', icon: 'eye' },
    { id: 'vigilante', label: 'Vigilante', description: 'Acceso básico', icon: 'person' },
  ]

  const handleSave = async () => {
    setError(null)

    if (mode === 'create' && !formData.Control_Usuario) {
      setError('El código es obligatorio')
      return
    }
    if (!formData.nombre || !formData.apellido) {
      setError('Nombre y apellido son obligatorios')
      return
    }
    if (mode === 'create' && !formData.password) {
      setError('La contraseña es obligatoria')
      return
    }

    try {
      setLoading(true)
      if (mode === 'create') {
        await userService.createUser(formData as any)
      } else if (user) {
        await userService.updateUser(user.id, formData as any)
      }
      onSave()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack gap="$4">
      {/* Header */}
      <Card variant="outlined" padding="$4" borderRadius={16}>
        <HStack justify="space-between">
          <Text variant="h5" fontWeight="700" color="$color">
            {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
          </Text>
          <IconButton icon="close" onPress={onCancel} variant="ghost" size={24} />
        </HStack>
      </Card>

      {error && (
        <Card backgroundColor="$errorMuted" borderColor="$error" borderWidth={1} padding="$3">
          <Text variant="bodySmall" color="$error" fontWeight="600">
            ⚠️ {error}
          </Text>
        </Card>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4">
          {/* Código (solo crear) */}
          {mode === 'create' && (
            <FormField label="Código de Usuario" icon="id-card-outline">
              <Input
                placeholder="Ej: USR001"
                value={formData.Control_Usuario}
                onChangeText={(text) => setFormData({ ...formData, Control_Usuario: text.toUpperCase() })}
                autoCapitalize="characters"
                borderWidth={1}
                borderColor="$border"
                borderRadius={12}
                height={50}
                paddingHorizontal="$3"
              />
            </FormField>
          )}

          {/* Nombre y Apellido */}
          <HStack gap="$3">
            <Stack flex={1}>
              <FormField label="Nombre" icon="person-outline">
                <Input
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  borderWidth={1}
                  borderColor="$border"
                  borderRadius={12}
                  height={50}
                  paddingHorizontal="$3"
                />
              </FormField>
            </Stack>
            <Stack flex={1}>
              <FormField label="Apellido" icon="person-outline">
                <Input
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                  borderWidth={1}
                  borderColor="$border"
                  borderRadius={12}
                  height={50}
                  paddingHorizontal="$3"
                />
              </FormField>
            </Stack>
          </HStack>

          {/* Email y Teléfono */}
          <FormField label="Email" icon="mail-outline">
            <Input
              placeholder="correo@empresa.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              height={50}
              paddingHorizontal="$3"
            />
          </FormField>

          <FormField label="Teléfono" icon="call-outline">
            <Input
              placeholder="+52 55 1234 5678"
              value={formData.telefono}
              onChangeText={(text) => setFormData({ ...formData, telefono: text })}
              keyboardType="phone-pad"
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              height={50}
              paddingHorizontal="$3"
            />
          </FormField>

          {/* Departamento y Puesto */}
          <FormField label="Departamento" icon="business-outline">
            <Input
              placeholder="Departamento o área"
              value={formData.departamento}
              onChangeText={(text) => setFormData({ ...formData, departamento: text })}
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              height={50}
              paddingHorizontal="$3"
            />
          </FormField>

          <FormField label="Puesto" icon="briefcase-outline">
            <Input
              placeholder="Cargo o posición"
              value={formData.puesto}
              onChangeText={(text) => setFormData({ ...formData, puesto: text })}
              borderWidth={1}
              borderColor="$border"
              borderRadius={12}
              height={50}
              paddingHorizontal="$3"
            />
          </FormField>

          {/* Contraseña (solo crear) */}
          {mode === 'create' && (
            <FormField label="Contraseña" icon="lock-closed-outline">
              <Input
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
                borderWidth={1}
                borderColor="$border"
                borderRadius={12}
                height={50}
                paddingHorizontal="$3"
              />
            </FormField>
          )}

          {/* Rol */}
          <Stack gap="$3">
            <Text variant="label" color="$color" fontWeight="600">
              Rol del Usuario
            </Text>
            {roles.map((role) => (
              <Card
                key={role.id}
                variant={formData.rol === role.id ? 'default' : 'outlined'}
                backgroundColor={formData.rol === role.id ? '$primaryMuted' : '$background'}
                borderColor={formData.rol === role.id ? '$primary' : '$border'}
                borderWidth={1}
                padding="$3"
                onPress={() => setFormData({ ...formData, rol: role.id })}
              >
                <HStack gap="$3">
                  <YStack
                    width={48}
                    height={48}
                    borderRadius={12}
                    backgroundColor={formData.rol === role.id ? '$primary' : '$background2'}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Ionicons name={role.icon as any} size={24} color={formData.rol === role.id ? 'white' : '$color2'} />
                  </YStack>
                  <Stack flex={1} gap="$1">
                    <Text variant="body" fontWeight="600" color="$color">
                      {role.label}
                    </Text>
                    <Text variant="bodySmall" color="$color2">
                      {role.description}
                    </Text>
                  </Stack>
                  {formData.rol === role.id && (
                    <Ionicons name="checkmark-circle" size={28} color="$primary" />
                  )}
                </HStack>
              </Card>
            ))}
          </Stack>

          {/* Botones */}
          <YStack gap="$3" paddingVertical="$4">
            <Button
              title={loading ? 'Guardando...' : (mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios')}
              icon={loading ? undefined : (mode === 'create' ? 'person' : 'create') as any}
              onPress={handleSave}
              disabled={loading}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="Cancelar"
              icon={"close" as any}
              onPress={onCancel}
              variant="outline"
              size="lg"
              fullWidth
            />
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}

function FormField({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <Stack gap="$2">
      <HStack gap="$2" align="center">
        {icon && <Ionicons name={icon as any} size={16} color="$color2" />}
        <Text variant="label" color="$color2">
          {label}
        </Text>
      </HStack>
      {children}
    </Stack>
  )
}
