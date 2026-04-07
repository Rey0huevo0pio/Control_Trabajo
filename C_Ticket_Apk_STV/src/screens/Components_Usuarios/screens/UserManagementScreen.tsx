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
  const { isMobile, padding, safeSpacing } = useResponsive()
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

  const showTabs = currentView === 'list' || currentView === 'roles'

  return (
    <ScreenLayout padding={0}>
      {/* iOS-style Large Header */}
      <Card
        backgroundColor="$backgroundSecondary"
        padding={0}
        overflow="hidden"
        marginBottom={showTabs ? 0 : 0}
        borderRadius={0}
      >
        <YStack
          backgroundColor="$secondary"
          paddingHorizontal={isMobile ? 20 : 28}
          paddingTop={isMobile ? safeSpacing.top + 12 : 64}
          paddingBottom={isMobile ? 24 : 28}
          gap={isMobile ? 12 : 16}
        >
          <XStack alignItems="center" justifyContent="space-between" marginBottom={4}>
            <XStack alignItems="center" gap={8}>
              <IconButton
                icon="chevron-back"
                onPress={handleBack}
                variant="ghost"
                size={24}
              />
            </XStack>

            <XStack alignItems="center" gap={8}>
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
            </XStack>
          </XStack>

          <Text variant={isMobile ? "h2" : "h1"} color="white" fontWeight="700">
            Gestión de Usuarios
          </Text>
          <Text variant="body" color="rgba(255,255,255,0.85)" lineHeight={22}>
            Administra usuarios, roles y permisos del sistema
          </Text>

          {/* Admin badge */}
          <YStack
            backgroundColor="rgba(255,255,255,0.25)"
            alignSelf="flex-start"
            paddingHorizontal={12}
            paddingVertical={6}
            borderRadius={20}
            marginTop={4}
          >
            <Text variant="labelSmall" color="white" fontWeight="700" letterSpacing={0.5}>
              ADMINISTRADOR
            </Text>
          </YStack>
        </YStack>
      </Card>

      {/* iOS-style Segmented Control (Tabs) */}
      {showTabs && (
        <YStack 
          backgroundColor="$background" 
          paddingHorizontal={isMobile ? 16 : 24}
          paddingVertical={16}
        >
          <Card
            variant="filled"
            padding={8}
          >
            <XStack gap={8}>
              <TabButton
                icon="people"
                label="Usuarios"
                active={currentView !== 'roles'}
                onPress={() => setCurrentView('list')}
              />
              <TabButton
                icon="shield-checkmark"
                label="Roles y Permisos"
                active={currentView === 'roles'}
                onPress={() => setCurrentView('roles')}
              />
            </XStack>
          </Card>
        </YStack>
      )}

      {/* Contenido */}
      <YStack 
        flex={1} 
        paddingHorizontal={padding.screen}
        paddingVertical={showTabs ? 8 : 16}
      >
        {renderView()}
      </YStack>
    </ScreenLayout>
  )
}

// iOS-style segmented control tab button
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
      paddingHorizontal="$4"
      paddingVertical="$3"
      borderRadius="$md"
      gap="$2"
      justifyContent="center"
      alignItems="center"
      onPress={onPress}
      cursor="pointer"
    >
      <Ionicons name={icon as any} size={18} color={active ? 'white' : '$color2'} />
      <Text
        variant="labelSmall"
        fontWeight="600"
        color={active ? 'white' : '$color2'}
      >
        {label}
      </Text>
    </XStack>
  )
}
