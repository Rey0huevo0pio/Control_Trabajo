import React from 'react'
import { YStack, ScrollView } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
} from '../../../../src/components/design-system'

type EmailFolder = 'inbox' | 'drafts' | 'deleted' | 'archives' | 'groups'

interface EmailSidebarProps {
  currentFolder: EmailFolder
  onFolderChange: (folder: EmailFolder) => void
  onClose: () => void
}

const menuItems = [
  {
    id: 'inbox' as EmailFolder,
    title: 'Bandeja de entrada',
    icon: 'mail-unread',
    badge: 3,
    color: '$info'
  },
  {
    id: 'drafts' as EmailFolder,
    title: 'Borradores',
    icon: 'create',
    badge: 1,
    color: '$warning'
  },
  {
    id: 'deleted' as EmailFolder,
    title: 'Elementos eliminados',
    icon: 'trash',
    badge: 0,
    color: '$error'
  },
  {
    id: 'archives' as EmailFolder,
    title: 'Archivos',
    icon: 'archive',
    badge: 0,
    color: '$success'
  },
  {
    id: 'groups' as EmailFolder,
    title: 'Grupos',
    icon: 'people',
    badge: 2,
    color: '$secondary'
  }
]

export function EmailSidebar({ currentFolder, onFolderChange, onClose }: EmailSidebarProps) {
  return (
    <Card
      variant="outlined"
      padding="$3"
      width={280}
      backgroundColor="$background"
    >
      <HStack justify="space-between" align="center" marginBottom="$3">
        <Text variant="h6" fontWeight="700" color="$color">
          Carpetas
        </Text>
        <IconButton
          icon="close"
          onPress={onClose}
          variant="ghost"
          size={20}
        />
      </HStack>

      <ScrollView>
        <YStack gap="$2">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              variant={currentFolder === item.id ? 'filled' : 'outlined'}
              backgroundColor={currentFolder === item.id ? '$background' : 'transparent'}
              borderColor={currentFolder === item.id ? item.color : '$border'}
              padding="$3"
              onPress={() => onFolderChange(item.id)}
              cursor="pointer"
            >
              <HStack gap="$3" align="center">
                <YStack
                  backgroundColor={item.color}
                  width={40}
                  height={40}
                  borderRadius={12}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons name={item.icon as any} size={20} color="white" />
                </YStack>

                <Stack flex={1} gap="$1">
                  <Text
                    variant="body"
                    fontWeight={currentFolder === item.id ? '700' : '500'}
                    color="$color"
                  >
                    {item.title}
                  </Text>
                </Stack>

                {item.badge > 0 && (
                  <YStack
                    backgroundColor={item.color}
                    minWidth={22}
                    height={22}
                    borderRadius="$full"
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal="$2"
                  >
                    <Text variant="caption" color="white" fontWeight="700" fontSize={11}>
                      {item.badge}
                    </Text>
                  </YStack>
                )}
              </HStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </Card>
  )
}
