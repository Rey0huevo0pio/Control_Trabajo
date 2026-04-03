import React from 'react'
import { Card as TamaguiCard, YStack, XStack, type CardProps } from 'tamagui'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled'

interface CustomCardProps extends CardProps {
  variant?: CardVariant
  children: React.ReactNode
  padding?: number | string
}

const variantStyles: Record<CardVariant, Partial<CardProps>> = {
  default: {
    backgroundColor: '$background',
    shadowColor: '$shadow',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    backgroundColor: '$background',
    shadowColor: '$shadow',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  outlined: {
    backgroundColor: '$background',
    borderColor: '$border',
    borderWidth: 1,
  },
  filled: {
    backgroundColor: '$background2',
  },
}

export function Card({
  variant = 'default',
  children,
  padding = '$4',
  borderRadius = 16,
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

// Card clickeable
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
      pressStyle={{ opacity: 0.9, scale: 0.98 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </TamaguiCard>
  )
}
