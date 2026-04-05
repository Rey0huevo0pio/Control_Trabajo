import React from 'react'
import { Card as TamaguiCard, YStack, XStack, type CardProps } from 'tamagui'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled' | 'grouped'

interface CustomCardProps extends CardProps {
  variant?: CardVariant
  children: React.ReactNode
  padding?: number | string
}

// iOS-style card variants
const variantStyles: Record<CardVariant, Partial<CardProps>> = {
  default: {
    backgroundColor: '$backgroundSecondary',
    shadowColor: '$color',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  elevated: {
    backgroundColor: '$backgroundSecondary',
    shadowColor: '$color',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  outlined: {
    backgroundColor: '$backgroundSecondary',
    borderColor: '$border',
    borderWidth: 0.5,
  },
  filled: {
    backgroundColor: '$backgroundTertiary',
  },
  // iOS Settings-style grouped card
  grouped: {
    backgroundColor: '$backgroundSecondary',
    borderColor: '$borderSubtle',
    borderWidth: 0.5,
  },
}

export function Card({
  variant = 'default',
  children,
  padding = '$4',
  borderRadius = '$lg',
  ...props
}: CustomCardProps) {
  const styles = variantStyles[variant]

  return (
    <TamaguiCard
      borderRadius={borderRadius}
      padding={padding}
      {...styles}
      {...props}
    >
      {children}
    </TamaguiCard>
  )
}

// iOS-style pressable card with subtle feedback
interface PressableCardProps extends CustomCardProps {
  onPress: () => void
  disabled?: boolean
}

export function PressableCard({
  onPress,
  disabled = false,
  children,
  ...props
}: PressableCardProps) {
  return (
    <TamaguiCard
      onPress={onPress}
      pressStyle={{ 
        opacity: 0.7, 
        scale: 0.98,
        backgroundColor: '$backgroundTertiary',
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </TamaguiCard>
  )
}
