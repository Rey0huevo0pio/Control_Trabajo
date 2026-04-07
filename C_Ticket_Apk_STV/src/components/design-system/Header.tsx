import React from 'react'
import { YStack, XStack } from 'tamagui'
import { Text } from './Text'
import { IconButton } from './Button'
import { useResponsive } from '../useResponsive'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface HeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap
    onPress: () => void
  }
  avatar?: {
    icon: keyof typeof Ionicons.glyphMap
    size?: number
  }
  variant?: 'default' | 'primary' | 'large'
  onBack?: () => void
  useSafeArea?: boolean
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
  avatar,
  variant = 'default',
  onBack,
  useSafeArea = true,
}: HeaderProps) {
  const navigation = useNavigation<any>()
  const { isMobile } = useResponsive()
  const insets = useSafeAreaInsets()

  const isPrimary = variant === 'primary'
  const isLarge = variant === 'large'
  const textColor = isPrimary ? 'white' : '$color'
  const subtitleColor = isPrimary ? 'rgba(255,255,255,0.8)' : '$color2'
  const bgColor = isPrimary ? '$primary' : '$backgroundSecondary'
  
  // Safe area padding for notch devices
  const paddingTop = useSafeArea && isMobile ? insets.top + 12 : 12

  // Large header (iOS large title style)
  if (isLarge) {
    return (
      <YStack
        backgroundColor={bgColor}
        paddingHorizontal={isMobile ? '$5' : '$6'}
        paddingTop={paddingTop}
        paddingBottom="$4"
        gap="$2"
      >
        <XStack alignItems="center" justifyContent="space-between" marginBottom="$2">
          <XStack alignItems="center" gap="$2">
            {showBackButton && (
              <IconButton
                icon="chevron-back"
                onPress={onBack || (() => navigation.goBack())}
                variant="ghost"
                size={24}
              />
            )}
          </XStack>

          <XStack alignItems="center" gap="$2">
            {rightAction && (
              <IconButton
                icon={rightAction.icon}
                onPress={rightAction.onPress}
                variant={isPrimary ? 'ghost' : 'ghost'}
                size={24}
              />
            )}
            {avatar && (
              <YStack
                width={avatar.size || 40}
                height={avatar.size || 40}
                borderRadius="$full"
                backgroundColor={isPrimary ? 'rgba(255,255,255,0.2)' : '$primary'}
                justifyContent="center"
                alignItems="center"
              >
                <Ionicons
                  name={avatar.icon}
                  size={(avatar.size || 40) * 0.6}
                  color="white"
                />
              </YStack>
            )}
          </XStack>
        </XStack>

        <Text
          variant="h1"
          color={textColor}
          fontWeight="700"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="bodySmall"
            color={subtitleColor}
            marginTop="$1"
          >
            {subtitle}
          </Text>
        )}
      </YStack>
    )
  }

  // Standard iOS header - optimized for mobile with better text wrapping
  return (
    <YStack
      backgroundColor={bgColor}
      paddingHorizontal={isMobile ? '$5' : '$6'}
      paddingVertical="$4"
      paddingTop={paddingTop}
      paddingBottom="$3"
    >
      <XStack alignItems="center" justifyContent="space-between" gap="$3">
        <YStack flex={1} gap="$1" flexShrink={1}>
          <XStack alignItems="center" gap="$2" flexWrap="wrap">
            {showBackButton && (
              <IconButton
                icon="chevron-back"
                onPress={onBack || (() => navigation.goBack())}
                variant={isPrimary ? 'ghost' : 'ghost'}
                size={24}
              />
            )}
            <Text
              variant={isMobile ? 'title2' : 'title1'}
              color={textColor}
              fontWeight="700"
              numberOfLines={2}
            >
              {title}
            </Text>
          </XStack>
          {subtitle && (
            <Text
              variant="bodySmall"
              color={subtitleColor}
              marginLeft={showBackButton ? '$9' : '$0'}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </YStack>

        <XStack alignItems="center" gap="$2" flexShrink={0}>
          {rightAction && (
            <IconButton
              icon={rightAction.icon}
              onPress={rightAction.onPress}
              variant={isPrimary ? 'ghost' : 'ghost'}
              size={24}
            />
          )}
          {avatar && (
            <YStack
              width={avatar.size || 40}
              height={avatar.size || 40}
              borderRadius="$full"
              backgroundColor={isPrimary ? 'rgba(255,255,255,0.2)' : '$primary'}
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons
                name={avatar.icon}
                size={(avatar.size || 40) * 0.6}
                color="white"
              />
            </YStack>
          )}
        </XStack>
      </XStack>
    </YStack>
  )
}
