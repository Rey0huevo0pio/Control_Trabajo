import React from 'react'
import { YStack, XStack, ScrollView, type YStackProps, type XStackProps } from 'tamagui'
import { useResponsive } from '../useResponsive'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAvoidingView, Platform } from 'react-native'

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
  useSafeArea?: boolean
  avoidKeyboard?: boolean
}

export function ScreenLayout({
  children,
  padding,
  scrollable = true,
  backgroundColor = '$background',
  useSafeArea = true,
  avoidKeyboard = true,
}: ScreenLayoutProps) {
  const { isMobile, padding: paddingConfig } = useResponsive()
  const insets = useSafeAreaInsets()
  
  // Generous padding for accessibility with safe area support
  const paddingHorizontal = padding || paddingConfig.screenHorizontal
  const paddingTop = useSafeArea 
    ? (isMobile ? insets.top + 12 : 16) // Below status bar on mobile
    : paddingConfig.section

  const content = (
    <YStack
      flex={1}
      backgroundColor={backgroundColor}
      paddingHorizontal={paddingHorizontal}
      paddingTop={paddingTop}
      paddingBottom={useSafeArea ? insets.bottom + 16 : 16}
      gap="$5"
    >
      {children}
    </YStack>
  )

  const wrappedContent = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={isMobile ? 0 : 0}
    >
      {content}
    </KeyboardAvoidingView>
  ) : content

  if (scrollable) {
    return (
      <ScrollView
        flex={1}
        backgroundColor={backgroundColor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: useSafeArea ? insets.bottom + 24 : 40,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {wrappedContent}
      </ScrollView>
    )
  }

  return wrappedContent
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
