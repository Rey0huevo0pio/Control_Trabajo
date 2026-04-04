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

interface ArchivedEmail {
  id: string
  from: string
  subject: string
  preview: string
  archivedDate: string
  category: string
  avatar: string
}

const mockArchived: ArchivedEmail[] = [
  {
    id: '1',
    from: 'dirección@empresa.com',
    subject: 'Informe anual 2025 - Resultados financieros',
    preview: 'Estimados accionistas, les presentamos los resultados del año fiscal...',
    archivedDate: '15 Mar 2025',
    category: 'Finanzas',
    avatar: 'DF'
  },
  {
    id: '2',
    from: 'proyectos@empresa.com',
    subject: 'Cierre de proyecto Alpha - Documentación final',
    preview: 'Adjuntamos toda la documentación del proyecto completado...',
    archivedDate: '10 Mar 2025',
    category: 'Proyectos',
    avatar: 'PA'
  },
  {
    id: '3',
    from: 'rrhh@empresa.com',
    subject: 'Políticas internas - Actualización 2025',
    preview: 'Les compartimos las políticas actualizadas para este año...',
    archivedDate: '5 Mar 2025',
    category: 'RRHH',
    avatar: 'PI'
  },
  {
    id: '4',
    from: 'compliance@empresa.com',
    subject: 'Certificación ISO - Auditoría completada',
    preview: 'Nos complace informar que hemos completado exitosamente...',
    archivedDate: '28 Feb 2025',
    category: 'Compliance',
    avatar: 'CI'
  }
]

export function ArchivesView() {
  const { isMobile } = useResponsive()
  const [archivedEmails, setArchivedEmails] = useState(mockArchived)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(archivedEmails.map(e => e.category)))]

  const filteredEmails = filterCategory === 'all'
    ? archivedEmails
    : archivedEmails.filter(e => e.category === filterCategory)

  return (
    <Card variant="outlined" padding="$4">
      <HStack justify="space-between" align="center" marginBottom="$4">
        <Text variant="h5" fontWeight="700" color="$color">
          Archivos
        </Text>
        <HStack gap="$2">
          <IconButton icon="filter" onPress={() => {}} variant="ghost" size={20} />
          <IconButton icon="search" onPress={() => {}} variant="ghost" size={20} />
        </HStack>
      </HStack>

      {/* Filtros de categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} marginBottom="$4">
        <HStack gap="$2">
          {categories.map((category) => (
            <Card
              key={category}
              variant={filterCategory === category ? 'filled' : 'outlined'}
              backgroundColor={filterCategory === category ? '$success20' : 'transparent'}
              borderColor={filterCategory === category ? '$success' : '$border'}
              paddingVertical="$2"
              paddingHorizontal="$3"
              onPress={() => setFilterCategory(category)}
              cursor="pointer"
            >
              <Text
                variant="caption"
                fontWeight="600"
                color={filterCategory === category ? '$success' : '$color2'}
              >
                {category === 'all' ? 'Todos' : category}
              </Text>
            </Card>
          ))}
        </HStack>
      </ScrollView>

      {filteredEmails.length === 0 ? (
        <YStack alignItems="center" paddingVertical="$8" gap="$3">
          <Ionicons name="archive-outline" size={64} color="$color4" />
          <Text variant="body" color="$color3">
            No hay archivos en esta categoría
          </Text>
        </YStack>
      ) : (
        <ScrollView>
          <YStack gap="$3">
            {filteredEmails.map((email) => (
              <Card
                key={email.id}
                variant="outlined"
                padding="$4"
                cursor="pointer"
              >
                <HStack gap="$3">
                  <YStack
                    backgroundColor="$success"
                    width={48}
                    height={48}
                    borderRadius="$full"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text variant="body" color="white" fontWeight="700">
                      {email.avatar}
                    </Text>
                  </YStack>

                  <Stack flex={1} gap="$2">
                    <HStack justify="space-between" align="center">
                      <Text variant="body" fontWeight="600" color="$color" flex={1}>
                        {email.from}
                      </Text>
                      <Text variant="caption" color="$color3">
                        {email.archivedDate}
                      </Text>
                    </HStack>

                    <Text variant="bodySmall" fontWeight="600" color="$color">
                      {email.subject}
                    </Text>

                    <Text variant="caption" color="$color3" numberOfLines={2}>
                      {email.preview}
                    </Text>

                    <HStack gap="$2" marginTop="$2">
                      <YStack
                        backgroundColor="$success10"
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$1"
                      >
                        <Text variant="caption" color="$success" fontWeight="600">
                          {email.category}
                        </Text>
                      </YStack>
                      <IconButton icon="archive" onPress={() => {}} variant="ghost" size={18} />
                      <IconButton icon="download" onPress={() => {}} variant="ghost" size={18} />
                    </HStack>
                  </Stack>
                </HStack>
              </Card>
            ))}
          </YStack>
        </ScrollView>
      )}
    </Card>
  )
}
