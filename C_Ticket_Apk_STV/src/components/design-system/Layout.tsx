import React from 'react'
import { YStack, XStack, ScrollView, type YStackProps, type XStackProps } from 'tamagui'
import { useResponsive } from '../useResponsive'

// iOS-style vertical stack with accessible spacing
export function Stack({
  children,
  gap = '$4',
  ...props
}: YStackProps) {
  return (
    <YStack gap={gap} {...props}>
      {children}
    </YStack>
  )
}

// iOS-style horizontal stack with accessible spacing
export function HStack({
  children,
  gap = '$4',
  align = 'center',
  justify,
  ...props
}: XStackProps & { align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'; justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' }) {
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

// iOS-style screen layout with safe areas and accessible spacing
interface ScreenLayoutProps {
  children: React.ReactNode
  padding?: number | string
  showHeader?: boolean
  headerTitle?: string
  scrollable?: boolean
  backgroundColor?: string
}

export function ScreenLayout({
  children,
  padding,
  scrollable = true,
  backgroundColor = '$background',
}: ScreenLayoutProps) {
  const { isMobile } = useResponsive()
  // Generous padding for accessibility
  const paddingHorizontal = padding || (isMobile ? '$5' : '$8')

  const content = (
    <YStack
      flex={1}
      backgroundColor={backgroundColor}
      paddingHorizontal={paddingHorizontal}
      paddingVertical="$5"
      gap="$5"
    >
      {children}
    </YStack>
  )

  if (scrollable) {
    return (
      <ScrollView
        flex={1}
        backgroundColor={backgroundColor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {content}
      </ScrollView>
    )
  }

  return content
}

// iOS-style screen section with clear visual hierarchy
interface ScreenSectionProps {
  title?: string
  children: React.ReactNode
  gap?: number | string
  padding?: number | string
}

export function ScreenSection({ title, children, gap = '$4', padding }: ScreenSectionProps) {
  return (
    <YStack gap={gap} padding={padding}>
      {title && (
        <YStack paddingHorizontal="$1" marginBottom="$2">
          {/* Title rendered inline */}
        </YStack>
      )}
      {children}
    </YStack>
  )
}
