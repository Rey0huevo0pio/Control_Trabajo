import React, { useState } from 'react'
import { YStack, XStack } from 'tamagui'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  ScreenLayout,
  Stack,
  HStack,
  IconButton,
} from '../../../components/design-system'
import { useResponsive } from '../../../components/useResponsive'
import { UserList } from '../components/UserList'
import { RolePermissions } from '../components/RolePermissions'
import { UserForm } from '../components/UserForm'
import { UserDetail } from '../components/UserDetail'
import { Employee, UserRole } from '../types'

type UserView = 'list' | 'roles' | 'create' | 'edit' | 'detail'

export default function UserManagementScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [currentView, setCurrentView] = useState<UserView>('list')
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null)

  const handleBack = () => {
    navigation.goBack()
  }

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return (
          <UserList
            onUserSelect={(user) => {
              setSelectedUser(user)
              setCurrentView('detail')
            }}
            onEdit={(user) => {
              setSelectedUser(user)
              setCurrentView('edit')
            }}
            onCreate={() => setCurrentView('create')}
          />
        )
      case 'roles':
        return <RolePermissions />
      case 'create':
        return (
          <UserForm
            mode="create"
            onSave={() => setCurrentView('list')}
            onCancel={() => setCurrentView('list')}
          />
        )
      case 'edit':
        return (
          <UserForm
            mode="edit"
            user={selectedUser}
            onSave={() => setCurrentView('list')}
            onCancel={() => setCurrentView('list')}
          />
        )
      case 'detail':
        return (
          <UserDetail
            user={selectedUser!}
            onEdit={() => setCurrentView('edit')}
            onBack={() => setCurrentView('list')}
          />
        )
      default:
        return <UserList onUserSelect={() => {}} onEdit={() => {}} onCreate={() => {}} />
    }
  }

  return (
    <ScreenLayout>
      {/* Header */}
      <Card
        backgroundColor="$secondary"
        padding={isMobile ? '$5' : '$6'}
        overflow="hidden"
        position="relative"
      >
        <YStack position="absolute" right={-30} top={-40} opacity={0.1}>
          <Ionicons name="people" size={200} color="white" />
        </YStack>

        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <HStack gap="$2" align="center">
              <IconButton
                icon="arrow-back-outline"
                onPress={handleBack}
                variant="ghost"
                size={24}
              />
              <Text variant="h3" color="white" fontWeight="800">
                Gestión de Usuarios
              </Text>
              <YStack
                backgroundColor="rgba(255,255,255,0.3)"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$full"
              >
                <Text variant="caption" color="white" fontWeight="700">
                  ADMIN
                </Text>
              </YStack>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Administra usuarios, roles y permisos
            </Text>
          </Stack>

          <HStack gap="$2">
            <IconButton
              icon="refresh"
              onPress={() => {}}
              variant="ghost"
              size={24}
            />
            <IconButton
              icon="ellipsis-vertical"
              onPress={() => {}}
              variant="ghost"
              size={24}
            />
          </HStack>
        </HStack>
      </Card>

      {/* Tabs de navegación */}
      <Card variant="outlined" padding="$3">
        <HStack gap="$2">
          <TabButton
            icon="people"
            label="Usuarios"
            active={currentView === 'list' || currentView === 'detail' || currentView === 'create' || currentView === 'edit'}
            onPress={() => setCurrentView('list')}
          />
          <TabButton
            icon="shield-checkmark"
            label="Roles y Permisos"
            active={currentView === 'roles'}
            onPress={() => setCurrentView('roles')}
          />
        </HStack>
      </Card>

      {/* Contenido */}
      <Stack flex={1}>{renderView()}</Stack>
    </ScreenLayout>
  )
}

function TabButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <XStack
      flex={1}
      backgroundColor={active ? '$secondary' : 'transparent'}
      borderWidth={1}
      borderColor={active ? '$secondary' : '$border'}
      paddingHorizontal="$4"
      paddingVertical="$3"
      borderRadius={8}
      gap="$2"
      justifyContent="center"
      alignItems="center"
      onPress={onPress}
      cursor="pointer"
    >
      <Ionicons name={icon as any} size={18} color={active ? 'white' : '$color2'} />
      <Text
        variant="bodySmall"
        fontWeight="600"
        color={active ? 'white' : '$color2'}
      >
        {label}
      </Text>
    </XStack>
  )
}
