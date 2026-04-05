import React from 'react'
import {
  Button as TamaguiButton,
  XStack,
  Text as TamaguiText,
  Spinner,
  type ButtonProps as TamaguiButtonProps,
} from 'tamagui'
import { Ionicons } from '@expo/vector-icons'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface CustomButtonProps {
  title?: string
  icon?: keyof typeof Ionicons.glyphMap
  iconPosition?: 'left' | 'right'
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

type ButtonProps = Omit<TamaguiButtonProps, 'size' | 'variant'> & CustomButtonProps

// iOS-style color palette
const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: '$primary', text: 'white' },
  secondary: { bg: '$secondary', text: 'white' },
  success: { bg: '$success', text: 'white' },
  warning: { bg: '$warning', text: 'white' },
  error: { bg: '$error', text: 'white' },
  outline: { bg: 'transparent', text: '$primary', border: '$primary' },
  ghost: { bg: 'transparent', text: '$primary' },
}

// iOS minimum touch target is 44x44pt
const sizeStyles: Record<ButtonSize, { padding: number; fontSize: number; iconSize: number; height: number; gap: number }> = {
  xs: { padding: 10, fontSize: 15, iconSize: 16, height: 44, gap: 6 },
  sm: { padding: 12, fontSize: 15, iconSize: 18, height: 48, gap: 8 },
  md: { padding: 14, fontSize: 17, iconSize: 20, height: 52, gap: 8 },
  lg: { padding: 16, fontSize: 17, iconSize: 22, height: 56, gap: 10 },
  xl: { padding: 18, fontSize: 20, iconSize: 24, height: 64, gap: 12 },
}

export function Button({
  title,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  ...props
}: ButtonProps) {
  const colors = variantStyles[variant]
  const dims = sizeStyles[size]
  const isGhostOrOutline = variant === 'ghost' || variant === 'outline'

  return (
    <TamaguiButton
      onPress={onPress}
      backgroundColor={disabled ? '$color4' : colors.bg}
      borderColor={colors.border}
      borderWidth={variant === 'outline' ? 1.5 : 0}
      borderRadius="$lg"
      height={dims.height}
      paddingHorizontal={dims.padding}
      paddingVertical={dims.padding}
      width={fullWidth ? '100%' : undefined}
      disabled={disabled || loading}
      opacity={disabled || loading ? 0.6 : 1}
      pressStyle={{ 
        opacity: isGhostOrOutline ? 0.5 : 0.8, 
        scale: 0.97,
      }}
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      {loading ? (
        <Spinner size="small" color={isGhostOrOutline ? colors.text : colors.text} />
      ) : (
        <XStack alignItems="center" gap={dims.gap} justifyContent="center">
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={dims.iconSize} color={colors.text} />
          )}
          {title && (
            <TamaguiText
              color={colors.text}
              fontSize={dims.fontSize}
              fontWeight="600"
              textAlign="center"
              letterSpacing={-0.4}
            >
              {title}
            </TamaguiText>
          )}
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={dims.iconSize} color={colors.text} />
          )}
        </XStack>
      )}
    </TamaguiButton>
  )
}

// iOS-style icon button with minimum 44x44pt touch target
interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  variant?: ButtonVariant
  size?: number
  disabled?: boolean
}

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 22,
  disabled = false,
}: IconButtonProps) {
  const colors = variantStyles[variant]
  // Minimum 44x44pt touch target for accessibility
  const buttonSize = Math.max(44, size + 24)

  return (
    <TamaguiButton
      onPress={onPress}
      backgroundColor={disabled ? '$color4' : colors.bg}
      borderColor={colors.border}
      borderWidth={variant === 'outline' ? 1.5 : 0}
      borderRadius="$lg"
      width={buttonSize}
      height={buttonSize}
      padding={0}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ opacity: 0.6, scale: 0.92 }}
      justifyContent="center"
      alignItems="center"
    >
      <Ionicons name={icon} size={size} color={colors.text} />
    </TamaguiButton>
  )
}
