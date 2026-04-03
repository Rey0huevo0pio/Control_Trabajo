import React from 'react'
import { YStack, XStack, ScrollView, type YStackProps, type XStackProps } from 'tamagui'
import { useResponsive } from '../useResponsive'

// Stack vertical
export function Stack({
  children,
  gap = '$3',
  ...props
}: YStackProps) {
  return (
    <YStack gap={gap} {...props}>
      {children}
    </YStack>
  )
}

// Stack horizontal
export function HStack({
  children,
  gap = '$3',
  align = 'center',
  justify,
  ...props
}: XStackProps & { align?: 'start' | 'center' | 'end' | 'stretch'; justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' }) {
  return (
    <XStack
      alignItems={align}
      justifyContent={justify}
      gap={gap}
      {...props}
    >
      {children}
    </XStack>
  )
}

// Layout principal de pantalla
interface ScreenLayoutProps {
  children: React.ReactNode
  padding?: number | string
  showHeader?: boolean
  headerTitle?: string
  scrollable?: boolean
}

export function ScreenLayout({
  children,
  padding,
  scrollable = true,
}: ScreenLayoutProps) {
  const { isMobile } = useResponsive()
  const paddingHorizontal = padding || (isMobile ? '$4' : '$6')

  const content = (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal={paddingHorizontal}
      paddingVertical="$4"
      gap="$4"
    >
      {children}
    </YStack>
  )

  if (scrollable) {
    return (
      <ScrollView
        flex={1}
        backgroundColor="$background"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    )
  }

  return content
}

// Sección dentro de una pantalla
interface ScreenSectionProps {
  title?: string
  children: React.ReactNode
  gap?: number | string
}

export function ScreenSection({ title, children, gap = '$3' }: ScreenSectionProps) {
  return (
    <YStack gap={gap}>
      {title && (
        <YStack>
          {/* Rendered inline to avoid circular dependency */}
        </YStack>
      )}
      {children}
    </YStack>
  )
}
