/**
 * ============================================================================
 * 🃏 CARD - Professional Card Component (Google/Microsoft Style)
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Cards modernos con sombras y elevaciones profesionales
 * - Múltiples variantes: default, elevated, outlined, filled, grouped
 * - Animaciones suaves al presionar
 * - Bordes redondeados estilo iOS/Android moderno
 *
 * ============================================================================
 */
import React from 'react'
import { TouchableOpacity, Animated, StyleSheet, ViewStyle, Platform } from 'react-native'
import { Card as TamaguiCard, YStack, XStack, type CardProps } from 'tamagui'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled' | 'grouped' | 'gradient'

interface CustomCardProps extends CardProps {
  variant?: CardVariant
  children: React.ReactNode
  padding?: number | string
  onPress?: () => void
  disabled?: boolean
  gradientColors?: string[]
}

// iOS/Android-style card variants
const variantStyles: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    borderWidth: 1,
  },
  filled: {
    backgroundColor: '#F9F9F9',
  },
  // iOS Settings-style grouped card
  grouped: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    borderWidth: 0.5,
  },
  gradient: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
}

export function Card({
  variant = 'default',
  children,
  padding = 16,
  borderRadius = 16,
  onPress,
  disabled = false,
  gradientColors,
  ...props
}: CustomCardProps) {
  const styles = variantStyles[variant]

  // If onPress is provided, make it a touchable card
  if (onPress) {
    return (
      <PressableCardInner
        onPress={onPress}
        disabled={disabled}
        padding={padding}
        borderRadius={borderRadius}
        variant={variant}
        {...props}
      >
        {children}
      </PressableCardInner>
    )
  }

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

/**
 * Pressable Card with Animation
 */
function PressableCardInner({
  onPress,
  disabled = false,
  children,
  padding = 16,
  borderRadius = 16,
  variant = 'default',
  ...props
}: CustomCardProps & { onPress: () => void }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current
  const opacityAnim = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    if (disabled) return
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const styles = variantStyles[variant]

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          {
            borderRadius,
            padding,
            backgroundColor: '#FFFFFF',
            ...styles,
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        {...props}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  )
}

/**
 * Modern Card with Gradient Background
 */
export function GradientCard({
  children,
  gradientColors = ['#007AFF', '#5856D6'],
  padding = 20,
  borderRadius = 20,
  onPress,
  disabled = false,
  ...props
}: CustomCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    if (disabled || !onPress) return
    
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start()
  }

  const CardContent = (
    <Animated.View
      style={[
        {
          borderRadius,
          padding,
          background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
          shadowColor: gradientColors[0],
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
          opacity: disabled ? 0.6 : 1,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
      >
        {CardContent}
      </TouchableOpacity>
    )
  }

  return CardContent
}
