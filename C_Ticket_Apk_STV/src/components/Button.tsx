import React from 'react'
import { YStack, XStack, Text, Card, Button as TamaguiButton, Spinner } from 'tamagui'
import { Ionicons } from '@expo/vector-icons'

interface ButtonProps {
  title?: string
  icon?: keyof typeof Ionicons.glyphMap
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'error' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}

export function Button({ 
  title, 
  icon, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false 
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '$color5'
    switch (variant) {
      case 'primary': return '$primary'
      case 'secondary': return '$secondary'
      case 'error': return '$error'
      case 'outline': return 'transparent'
      default: return '$primary'
    }
  }

  const getBorderColor = () => {
    if (variant === 'outline') return '$primary'
    return 'transparent'
  }

  const getTextColor = () => {
    if (variant === 'outline') return '$primary'
    return 'white'
  }

  const getSize = () => {
    switch (size) {
      case 'small': return { padding: '$2', fontSize: 13 }
      case 'medium': return { padding: '$3', fontSize: 15 }
      case 'large': return { padding: '$4', fontSize: 17 }
    }
  }

  const sizeConfig = getSize()
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24

  return (
    <TamaguiButton
      onPress={onPress}
      backgroundColor={getBackgroundColor()}
      borderRadius={12}
      borderColor={getBorderColor()}
      borderWidth={variant === 'outline' ? 2 : 0}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ opacity: 0.8 }}
      paddingHorizontal={sizeConfig.padding}
      paddingVertical={sizeConfig.padding}
    >
      {loading ? (
        <Spinner size="small" color={getTextColor()} />
      ) : (
        <XStack alignItems="center" gap="$2">
          {icon && (
            <Ionicons name={icon} size={iconSize} color={variant === 'outline' ? '$primary' : 'white'} />
          )}
          {title && (
            <Text color={getTextColor()} fontSize={sizeConfig.fontSize} fontWeight="600">
              {title}
            </Text>
          )}
        </XStack>
      )}
    </TamaguiButton>
  )
}

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'error' | 'ghost'
  size?: number
  disabled?: boolean
}

export function IconButton({ 
  icon, 
  onPress, 
  variant = 'primary',
  size = 24,
  disabled = false 
}: IconButtonProps) {
  const getColors = () => {
    switch (variant) {
      case 'primary': return { bg: '$primary', icon: 'white' }
      case 'secondary': return { bg: '$secondary', icon: 'white' }
      case 'error': return { bg: '$error', icon: 'white' }
      case 'ghost': return { bg: 'transparent', icon: '$color' }
    }
  }

  const colors = getColors()
  const buttonSize = size + 16

  return (
    <TamaguiButton
      onPress={onPress}
      backgroundColor={colors.bg}
      borderRadius={12}
      width={buttonSize}
      height={buttonSize}
      padding={0}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ opacity: 0.8 }}
    >
      <Ionicons name={icon} size={size} color={colors.icon} />
    </TamaguiButton>
  )
}
