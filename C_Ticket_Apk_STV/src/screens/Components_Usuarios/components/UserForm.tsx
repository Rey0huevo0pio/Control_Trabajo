import React, { useState } from 'react'
import { YStack, ScrollView, Input } from 'tamagui'
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

interface UserFormProps {
  mode: 'create' | 'edit'
  user?: Employee | null
  onSave: () => void
  onCancel: () => void
}

export function UserForm({ mode, user, onSave, onCancel }: UserFormProps) {
  const { isMobile } = useResponsive()

  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    departamento: user?.departamento || '',
    puesto: user?.puesto || '',
    rol: user?.rol || 'empleado',
    ...(mode === 'create' ? { password: '' } : {}),
  })

  const roles: { id: UserRole; label: string; icon: string }[] = [
    { id: 'admin', label: 'Administrador', icon: 'shield' },
    { id: 'it', label: 'TI', icon: 'hardware-chip' },
    { id: 'rh', label: 'RRHH', icon: 'people' },
    { id: 'supervisor', label: 'Supervisor', icon: 'eye' },
    { id: 'empleado', label: 'Empleado', icon: 'person' },
    { id: 'guest', label: 'Invitado', icon: 'person-outline' },
  ]

  const handleSave = () => {
    // TODO: Implementar lógica de guardado
    onSave()
  }

  return (
    <Card variant="outlined" padding="$4">
      <HStack justify="space-between" align="center" marginBottom="$4">
        <Text variant="h5" fontWeight="700" color="$color">
          {mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
        </Text>
        <IconButton icon="close" onPress={onCancel} variant="ghost" size={20} />
      </HStack>

      <ScrollView>
        <YStack gap="$4">
          {/* Información personal */}
          <Stack gap="$3">
            <Text variant="h6" fontWeight="600" color="$color">
              Información Personal
            </Text>

            <FormField label="Nombre">
              <Input
                placeholder="Nombre del usuario"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              />
            </FormField>

            <FormField label="Apellido">
              <Input
                placeholder="Apellido del usuario"
                value={formData.apellido}
                onChangeText={(text) => setFormData({ ...formData, apellido: text })}
              />
            </FormField>

            <FormField label="Email">
              <Input
                placeholder="correo@empresa.com"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </FormField>

            <FormField label="Teléfono">
              <Input
                placeholder="+52 55 1234 5678"
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                keyboardType="phone-pad"
              />
            </FormField>
          </Stack>

          {/* Información laboral */}
          <Stack gap="$3">
            <Text variant="h6" fontWeight="600" color="$color">
              Información Laboral
            </Text>

            <FormField label="Departamento">
              <Input
                placeholder="Departamento o área"
                value={formData.departamento}
                onChangeText={(text) => setFormData({ ...formData, departamento: text })}
              />
            </FormField>

            <FormField label="Puesto">
              <Input
                placeholder="Cargo o posición"
                value={formData.puesto}
                onChangeText={(text) => setFormData({ ...formData, puesto: text })}
              />
            </FormField>
          </Stack>

          {/* Rol */}
          <Stack gap="$3">
            <Text variant="h6" fontWeight="600" color="$color">
              Rol y Permisos
            </Text>

            <YStack gap="$2">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  variant={(formData as any).rol === role.id ? 'filled' : 'outlined'}
                  padding="$3"
                  onPress={() => setFormData({ ...formData, rol: role.id })}
                  cursor="pointer"
                >
                  <HStack gap="$3" align="center">
                    <Ionicons name={role.icon as any} size={24} color="$primary" />
                    <Stack flex={1}>
                      <Text variant="body" fontWeight="600" color="$color">
                        {role.label}
                      </Text>
                    </Stack>
                    {(formData as any).rol === role.id && (
                      <Ionicons name="checkmark-circle" size={24} color="$primary" />
                    )}
                  </HStack>
                </Card>
              ))}
            </YStack>
          </Stack>

          {/* Password (solo crear) */}
          {mode === 'create' && (
            <Stack gap="$3">
              <Text variant="h6" fontWeight="600" color="$color">
                Contraseña
              </Text>

              <FormField label="Contraseña temporal">
                <Input
                  placeholder="••••••••"
                  value={(formData as CreateUserDto).password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text } as CreateUserDto)
                  }
                  secureTextEntry
                />
              </FormField>
            </Stack>
          )}

          {/* Botones */}
          <HStack gap="$3" marginTop="$4">
            <Button
              flex={1}
              onPress={onCancel}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              flex={1}
              onPress={handleSave}
              variant="primary"
            >
              {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
            </Button>
          </HStack>
        </YStack>
      </ScrollView>
    </Card>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2">
      <Text variant="bodySmall" fontWeight="600" color="$color2">
        {label}
      </Text>
      {children}
    </YStack>
  )
}
