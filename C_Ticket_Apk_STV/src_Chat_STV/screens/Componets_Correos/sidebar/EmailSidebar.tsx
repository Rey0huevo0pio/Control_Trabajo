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

type EmailViewType = 'inbox' | 'compose'

interface EmailSidebarProps {
  currentView: EmailViewType
  onViewChange: (view: EmailViewType) => void
  onClose: () => void
}

const menuItems = [
  {
    id: 'inbox' as EmailViewType,
    title: 'Bandeja de Entrada',
    icon: 'mail',
    color: '$primary'
  },
  {
    id: 'compose' as EmailViewType,
    title: 'Redactar Correo',
    icon: 'create',
    color: '$success'
  }
]

export function EmailSidebar({ currentView, onViewChange, onClose }: EmailSidebarProps) {
  return (
    <Card
      variant="outlined"
      padding="$3"
      width={280}
      backgroundColor="$background"
    >
      <HStack justify="space-between" align="center" marginBottom="$3">
        <Text variant="h6" fontWeight="700" color="$color">
          Correo
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
              variant={currentView === item.id ? 'filled' : 'outlined'}
              backgroundColor={currentView === item.id ? item.color + '20' : 'transparent'}
              borderColor={currentView === item.id ? item.color : '$border'}
              padding="$3"
              onPress={() => onViewChange(item.id)}
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

                <Stack flex={1}>
                  <Text
                    variant="body"
                    fontWeight={currentView === item.id ? '700' : '500'}
                    color="$color"
                  >
                    {item.title}
                  </Text>
                </Stack>
              </HStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </Card>
  )
}
