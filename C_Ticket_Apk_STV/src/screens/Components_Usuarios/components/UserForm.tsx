import React, { useState } from 'react'
import { YStack, ScrollView, Input, XStack } from 'tamagui'
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

  const roles: { id: UserRole; label: string; description: string; icon: string }[] = [
    { id: 'admin', label: 'Administrador', description: 'Acceso completo al sistema', icon: 'shield-checkmark' },
    { id: 'it', label: 'TI', description: 'Soporte técnico y sistemas', icon: 'hardware-chip' },
    { id: 'rh', label: 'RRHH', description: 'Gestión de recursos humanos', icon: 'people' },
    { id: 'supervisor', label: 'Supervisor', description: 'Supervisión de operaciones', icon: 'eye' },
    { id: 'empleado', label: 'Empleado', description: 'Acceso estándar', icon: 'person' },
    { id: 'guest', label: 'Invitado', description: 'Acceso limitado de solo lectura', icon: 'person-outline' },
  ]

  const handleSave = () => {
    // TODO: Implementar lógica de guardado
    onSave()
  }

  return (
    <YStack gap="$5">
      {/* Form Header */}
      <Card variant="grouped" padding="$4" borderRadius="$lg">
        <XStack justifyContent="space-between" alignItems="center">
          <Text variant="title2" fontWeight="700" color="$color">
            {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
          </Text>
          <IconButton icon="close" onPress={onCancel} variant="ghost" size={24} />
        </XStack>
      </Card>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$5">
          {/* iOS-style Grouped Form Sections */
          /* Información personal */}
          <Card variant="grouped" padding={0} borderRadius="$lg" overflow="hidden">
            <YStack backgroundColor="$backgroundSecondary">
              <SectionHeader icon="person" title="Información Personal" />
              
              <YStack padding="$4" paddingTop="$3">
                <FormField label="Nombre" icon="person-outline">
                  <Input
                    placeholder="Nombre del usuario"
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                    backgroundColor="$backgroundTertiary"
                    borderRadius="$md"
                    borderWidth={0}
                    height={52}
                    fontSize={17}
                    paddingHorizontal="$4"
                    placeholderTextColor="$color3"
                  />
                </FormField>
              </YStack>

              <YStack padding="$4" paddingTop={0}>
                <FormField label="Apellido" icon="person-outline">
                  <Input
                    placeholder="Apellido del usuario"
                    value={formData.apellido}
                    onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                    backgroundColor="$backgroundTertiary"
                    borderRadius="$md"
                    borderWidth={0}
                    height={52}
                    fontSize={17}
                    paddingHorizontal="$4"
                    placeholderTextColor="$color3"
                  />
                </FormField>
              </YStack>

              <YStack padding="$4" paddingTop={0}>
                <FormField label="Email" icon="mail-outline">
                  <Input
                    placeholder="correo@empresa.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    backgroundColor="$backgroundTertiary"
                    borderRadius="$md"
                    borderWidth={0}
                    height={52}
                    fontSize={17}
                    paddingHorizontal="$4"
                    placeholderTextColor="$color3"
                  />
                </FormField>
              </YStack>

              <YStack padding="$4" paddingTop={0}>
                <FormField label="Teléfono" icon="call-outline">
                  <Input
                    placeholder="+52 55 1234 5678"
                    value={formData.telefono}
                    onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                    keyboardType="phone-pad"
                    backgroundColor="$backgroundTertiary"
                    borderRadius="$md"
                    borderWidth={0}
                    height={52}
                    fontSize={17}
                    paddingHorizontal="$4"
                    placeholderTextColor="$color3"
                  />
                </FormField>
              </YStack>
            </YStack>
          </Card>

          {/* Información laboral */}
          <Card variant="grouped" padding={0} borderRadius="$lg" overflow="hidden">
            <YStack backgroundColor="$backgroundSecondary">
              <SectionHeader icon="briefcase" title="Información Laboral" />
              
              <YStack padding="$4" paddingTop="$3">
                <FormField label="Departamento" icon="business-outline">
                  <Input
                    placeholder="Departamento o área"
                    value={formData.departamento}
                    onChangeText={(text) => setFormData({ ...formData, departamento: text })}
                    backgroundColor="$backgroundTertiary"
                    borderRadius="$md"
                    borderWidth={0}
                    height={52}
                    fontSize={17}
                    paddingHorizontal="$4"
                    placeholderTextColor="$color3"
                  />
                </FormField>
              </YStack>

              <YStack padding="$4" paddingTop={0}>
                <FormField label="Puesto" icon="id-card-outline">
                  <Input
                    placeholder="Cargo o posición"
                    value={formData.puesto}
                    onChangeText={(text) => setFormData({ ...formData, puesto: text })}
                    backgroundColor="$backgroundTertiary"
                    borderRadius="$md"
                    borderWidth={0}
                    height={52}
                    fontSize={17}
                    paddingHorizontal="$4"
                    placeholderTextColor="$color3"
                  />
                </FormField>
              </YStack>
            </YStack>
          </Card>

          {/* Rol - iOS-style selection cards */}
          <Card variant="grouped" padding="$4" borderRadius={20}>
            <SectionHeader icon="shield-checkmark" title="Rol y Permisos" marginBottom={12} />
            
            <YStack gap="$3">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  variant={(formData as any).rol === role.id ? 'filled' : 'outlined'}
                  backgroundColor={(formData as any).rol === role.id ? '$primaryMuted' : '$backgroundSecondary'}
                  borderColor={(formData as any).rol === role.id ? '$primary' : '$border'}
                  borderWidth={(formData as any).rol === role.id ? 1.5 : 0.5}
                  padding="$4"
                  onPress={() => setFormData({ ...formData, rol: role.id })}
                  cursor="pointer"
                  pressStyle={{ opacity: 0.7 }}
                >
                  <XStack gap="$3" alignItems="center">
                    <YStack
                      backgroundColor={(formData as any).rol === role.id ? '$primary' : '$backgroundTertiary'}
                      width={48}
                      height={48}
                      borderRadius="$md"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Ionicons 
                        name={role.icon as any} 
                        size={24} 
                        color={(formData as any).rol === role.id ? 'white' : '$color2'} 
                      />
                    </YStack>
                    <Stack flex={1} gap="$1">
                      <Text variant="body" fontWeight="600" color="$color">
                        {role.label}
                      </Text>
                      <Text variant="caption" color="$color3">
                        {role.description}
                      </Text>
                    </Stack>
                    {(formData as any).rol === role.id && (
                      <Ionicons name="checkmark-circle" size={28} color="$primary" />
                    )}
                  </XStack>
                </Card>
              ))}
            </YStack>
          </Card>

          {/* Password (solo crear) */}
          {mode === 'create' && (
            <Card variant="grouped" padding={0} borderRadius="$lg" overflow="hidden">
              <YStack backgroundColor="$backgroundSecondary">
                <SectionHeader icon="lock-closed" title="Contraseña" />
                
                <YStack padding="$4" paddingTop="$3">
                  <FormField label="Contraseña temporal" icon="lock-closed-outline">
                    <Input
                      placeholder="••••••••"
                      value={(formData as CreateUserDto).password}
                      onChangeText={(text) =>
                        setFormData({ ...formData, password: text } as CreateUserDto)
                      }
                      secureTextEntry
                      backgroundColor="$backgroundTertiary"
                      borderRadius="$md"
                      borderWidth={0}
                      height={52}
                      fontSize={17}
                      paddingHorizontal="$4"
                      placeholderTextColor="$color3"
                    />
                  </FormField>
                  <Text variant="caption" color="$color3" marginTop="$2" marginLeft="$1">
                    Se solicitará al usuario cambiar esta contraseña en el primer inicio de sesión
                  </Text>
                </YStack>
              </YStack>
            </Card>
          )}

          {/* iOS-style Action Buttons */}
          <YStack gap="$3" paddingVertical="$4">
            <Button
              onPress={handleSave}
              variant="primary"
              size="lg"
              fullWidth
            >
              {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
            </Button>
            <Button
              onPress={onCancel}
              variant="outline"
              size="lg"
              fullWidth
            >
              Cancelar
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
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

// iOS-style form field with label
function FormField({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2">
      <XStack gap="$2" alignItems="center" paddingHorizontal="$1">
        {icon && <Ionicons name={icon as any} size={16} color="$color2" />}
        <Text variant="labelSmall" fontWeight="600" color="$color2">
          {label}
        </Text>
      </XStack>
      {children}
    </YStack>
  )
}
