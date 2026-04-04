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
} from '../../../src/components/design-system'
import { useResponsive } from '../../../src/components/useResponsive'
import { EmailSidebar } from './sidebar/EmailSidebar'
import { InboxView } from './views/InboxView'
import { DraftsView } from './views/DraftsView'
import { DeletedView } from './views/DeletedView'
import { ArchivesView } from './views/ArchivesView'
import { GroupsView } from './views/GroupsView'

type EmailFolder = 'inbox' | 'drafts' | 'deleted' | 'archives' | 'groups'

export default function EmailMainScreen() {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>('inbox')
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  const renderFolderContent = () => {
    switch (currentFolder) {
      case 'inbox':
        return <InboxView />
      case 'drafts':
        return <DraftsView />
      case 'deleted':
        return <DeletedView />
      case 'archives':
        return <ArchivesView />
      case 'groups':
        return <GroupsView />
      default:
        return <InboxView />
    }
  }

  return (
    <ScreenLayout>
      {/* Header de Correo */}
      <Card
        backgroundColor="$info"
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
              <YStack
                backgroundColor="rgba(255,255,255,0.3)"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$full"
              >
                <Text variant="caption" color="white" fontWeight="700">
                  OUTLOOK
                </Text>
              </YStack>
            </HStack>
            <Text variant="bodySmall" color="rgba(255,255,255,0.8)">
              Bandeja de entrada empresarial
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

      {/* Contenido Principal */}
      <HStack flex={1} gap="$3">
        {/* Sidebar */}
        {(sidebarOpen || !isMobile) && (
          <EmailSidebar
            currentFolder={currentFolder}
            onFolderChange={(folder) => {
              setCurrentFolder(folder)
              if (isMobile) setSidebarOpen(false)
            }}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido de la carpeta seleccionada */}
        <Stack flex={1}>{renderFolderContent()}</Stack>
      </HStack>
    </ScreenLayout>
  )
}
