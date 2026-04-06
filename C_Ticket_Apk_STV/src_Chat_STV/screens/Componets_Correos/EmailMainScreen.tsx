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
  Button,
} from '../../../src/components/design-system'
import { useResponsive } from '../../../src/components/useResponsive'
import { EmailSidebar } from './sidebar/EmailSidebar'
import { EmailInboxView, ComposeEmailView } from './views'

type EmailView = 'inbox' | 'compose'

export default function EmailMainScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [currentView, setCurrentView] = useState<EmailView>('inbox')
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <EmailInboxView />
      case 'compose':
        return (
          <ComposeEmailView
            onBack={() => setCurrentView('inbox')}
            onSuccess={() => setCurrentView('inbox')}
          />
        )
      default:
        return <EmailInboxView />
    }
  }

  return (
    <ScreenLayout>
      {/* Header de Correo */}
      <Card
        backgroundColor="$primary"
        padding={isMobile ? '$5' : '$6'}
        overflow="hidden"
        position="relative"
      >
        <YStack position="absolute" right={-30} top={-40} opacity={0.1}>
          <Ionicons name="mail" size={200} color="white" />
        </YStack>

        <HStack justify="space-between">
          <Stack gap="$1" flex={1}>
            <HStack gap="$2" align="center">
              <IconButton
                icon="menu"
                onPress={() => setSidebarOpen(!sidebarOpen)}
                variant="ghost"
                size={24}
              />
              <Text variant="h3" color="white" fontWeight="800">
                Correo STV
              </Text>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Bandeja de entrada empresarial
            </Text>
          </Stack>

          <HStack gap="$2">
            <IconButton
              icon="create"
              onPress={() => setCurrentView('compose')}
              variant="ghost"
              size={24}
            />
            <IconButton
              icon="refresh"
              onPress={() => setCurrentView('inbox')}
              variant="ghost"
              size={24}
            />
          </HStack>
        </HStack>
      </Card>

      {/* Contenido Principal */}
      <HStack flex={1} gap="$3">
        {/* Sidebar */}
        {(sidebarOpen || !isMobile) && (
          <EmailSidebar
            currentView={currentView}
            onViewChange={(view) => {
              setCurrentView(view)
              if (isMobile) setSidebarOpen(false)
            }}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Vista seleccionada */}
        <Stack flex={1}>{renderView()}</Stack>
      </HStack>
    </ScreenLayout>
  )
}
