import React, { useState } from 'react'
import { YStack, ScrollView } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  Card,
  Stack,
  HStack,
  IconButton,
} from '../../../../src/components/design-system'
import { useResponsive } from '../../../../src/components/useResponsive'

interface Group {
  id: string
  name: string
  description: string
  members: number
  unreadEmails: number
  lastEmail: string
  lastEmailDate: string
  avatar: string
  color: string
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Equipo de Desarrollo',
    description: 'Comunicaciones del equipo de desarrollo de software',
    members: 12,
    unreadEmails: 5,
    lastEmail: 'Re: Actualización del sprint',
    lastEmailDate: '11:30 AM',
    avatar: 'ED',
    color: '$primary'
  },
  {
    id: '2',
    name: 'Comité de Calidad',
    description: 'Discusiones sobre estándares de calidad y procesos',
    members: 8,
    unreadEmails: 2,
    lastEmail: 'Revisión de métricas Q1',
    lastEmailDate: 'Ayer',
    avatar: 'CQ',
    color: '$secondary'
  },
  {
    id: '3',
    name: 'Coordinación de Proyectos',
    description: 'Coordinación entre departamentos para proyectos',
    members: 15,
    unreadEmails: 0,
    lastEmail: 'Planificación trimestre Q2',
    lastEmailDate: 'Lun',
    avatar: 'CP',
    color: '$success'
  }
]

export function GroupsView() {
  const { isMobile } = useResponsive()
  const [groups, setGroups] = useState(mockGroups)

  return (
    <Card variant="outlined" padding="$4">
      <HStack justify="space-between" align="center" marginBottom="$4">
        <Text variant="h5" fontWeight="700" color="$color">
          Grupos
        </Text>
        <HStack gap="$2">
          <IconButton icon="add" onPress={() => {}} variant="ghost" size={20} />
          <IconButton icon="people" onPress={() => {}} variant="ghost" size={20} />
        </HStack>
      </HStack>

      <ScrollView>
        <YStack gap="$3">
          {groups.map((group) => (
            <Card
              key={group.id}
              variant="outlined"
              padding="$4"
              cursor="pointer"
            >
              <HStack gap="$3">
                <YStack
                  backgroundColor={group.color}
                  width={56}
                  height={56}
                  borderRadius={16}
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                >
                  <Ionicons name="people" size={26} color="white" />
                  {group.unreadEmails > 0 && (
                    <YStack
                      position="absolute"
                      top={-6}
                      right={-6}
                      backgroundColor="$error"
                      minWidth={22}
                      height={22}
                      borderRadius="$full"
                      justifyContent="center"
                      alignItems="center"
                      paddingHorizontal="$2"
                    >
                      <Text variant="caption" color="white" fontWeight="700" fontSize={11}>
                        {group.unreadEmails}
                      </Text>
                    </YStack>
                  )}
                </YStack>

                <Stack flex={1} gap="$2">
                  <HStack justify="space-between" align="center">
                    <Text variant="body" fontWeight="700" color="$color" flex={1}>
                      {group.name}
                    </Text>
                    <Text variant="caption" color="$color3">
                      {group.lastEmailDate}
                    </Text>
                  </HStack>

                  <Text variant="caption" color="$color2">
                    {group.description}
                  </Text>

                  <HStack justify="space-between" align="center" marginTop="$1">
                    <HStack gap="$2" align="center">
                      <Ionicons name="person" size={14} color="$color3" />
                      <Text variant="caption" color="$color3">
                        {group.members} miembros
                      </Text>
                    </HStack>

                    {group.unreadEmails > 0 && (
                      <YStack
                        backgroundColor="$secondary10"
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$1"
                      >
                        <Text variant="caption" color="$secondary" fontWeight="600">
                          {group.unreadEmails} nuevos
                        </Text>
                      </YStack>
                    )}
                  </HStack>

                  <Text variant="caption" color="$color3" numberOfLines={1} marginTop="$1">
                    Último: {group.lastEmail}
                  </Text>
                </Stack>

                <Ionicons name="chevron-forward" size={20} color="$color3" />
              </HStack>
            </Card>
          ))}
        </YStack>
      </ScrollView>
    </Card>
  )
}
