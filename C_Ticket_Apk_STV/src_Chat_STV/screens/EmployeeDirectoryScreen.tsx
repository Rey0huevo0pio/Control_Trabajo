import React, { useState } from 'react'
import { YStack, Input } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  IconButton,
} from '../../src/components/design-system'
import { useResponsive } from '../../src/components/useResponsive'

export default function EmployeeDirectoryScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [searchQuery, setSearchQuery] = useState('')

  // Datos de ejemplo
  const employees = [
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'Desarrollador Senior',
      departamento: 'Tecnología',
      enLinea: true,
    },
    {
      id: '2',
      nombre: 'María',
      apellido: 'García',
      rol: 'Diseñadora UX/UI',
      departamento: 'Diseño',
      enLinea: false,
    },
    {
      id: '3',
      nombre: 'Carlos',
      apellido: 'López',
      rol: 'Analista de Sistemas',
      departamento: 'Tecnología',
      enLinea: true,
    },
    {
      id: '4',
      nombre: 'Ana',
      apellido: 'Martínez',
      rol: 'Gerente de RRHH',
      departamento: 'Recursos Humanos',
      enLinea: false,
    },
  ]

  const departments = Array.from(new Set(employees.map(e => e.departamento)))

  return (
    <ScreenLayout>
      {/* Header */}
      <Card backgroundColor="$success" padding={isMobile ? '$4' : '$5'}>
        <Stack gap="$1">
          <HStack justify="space-between">
            <Stack gap="$1" flex={1}>
              <HStack gap="$2" align="center">
                <IconButton
                  icon="arrow-back"
                  onPress={() => navigation.goBack()}
                  variant="ghost"
                  size={24}
                />
                <Text variant="h4" color="white" fontWeight="700">
                  Directorio de Empleados
                </Text>
              </HStack>
              <Text variant="bodySmall" color="rgba(255,255,255,0.7)">
                {employees.length} empleados
              </Text>
            </Stack>
          </HStack>
        </Stack>
      </Card>

      {/* Buscador */}
      <Card variant="outlined" padding="$3">
        <HStack gap="$3" align="center">
          <Ionicons name="search" size={20} color="$color3" />
          <Input
            flex={1}
            placeholder="Buscar por nombre, rol o departamento..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            borderWidth={0}
            padding={0}
            fontSize={15}
          />
          {searchQuery && (
            <IconButton
              icon="close-circle"
              onPress={() => setSearchQuery('')}
              variant="ghost"
              size={20}
            />
          )}
        </HStack>
      </Card>

      {/* Departamentos */}
      <Stack gap="$3">
        {departments.map((dept) => {
          const deptEmployees = employees.filter(e => 
            e.departamento === dept &&
            (searchQuery === '' || 
              `${e.nombre} ${e.apellido}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.rol.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.departamento.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )

          if (deptEmployees.length === 0) return null

          return (
            <Stack key={dept} gap="$2">
              <Text variant="h6" fontWeight="700" color="$color" paddingHorizontal="$1">
                {dept}
              </Text>
              
              {deptEmployees.map((emp) => (
                <Card
                  key={emp.id}
                  variant="outlined"
                  padding="$4"
                  onPress={() => navigation.navigate('UserProfile', { userId: emp.id })}
                >
                  <HStack gap="$3">
                    <YStack position="relative">
                      <YStack
                        width={50}
                        height={50}
                        borderRadius="$full"
                        backgroundColor="$success"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text color="white" fontWeight="700" fontSize={18}>
                          {emp.nombre.charAt(0)}{emp.apellido.charAt(0)}
                        </Text>
                      </YStack>
                      {emp.enLinea && (
                        <YStack
                          position="absolute"
                          bottom={0}
                          right={0}
                          width={14}
                          height={14}
                          borderRadius="$full"
                          backgroundColor="$success"
                          borderWidth={2}
                          borderColor="$background"
                        />
                      )}
                    </YStack>

                    <Stack flex={1} gap="$1">
                      <Text variant="h6" fontWeight="600" color="$color">
                        {emp.nombre} {emp.apellido}
                      </Text>
                      <Text variant="bodySmall" color="$color2">
                        {emp.rol}
                      </Text>
                    </Stack>

                    <HStack gap="$2">
                      <IconButton
                        icon="chatbubble"
                        onPress={() => navigation.navigate('ChatConversation', {
                          chatId: emp.id,
                          tipo: 'private',
                          nombre: `${emp.nombre} ${emp.apellido}`,
                        })}
                        variant="outline"
                        size={20}
                      />
                    </HStack>
                  </HStack>
                </Card>
              ))}
            </Stack>
          )
        })}
      </Stack>
    </ScreenLayout>
  )
}
