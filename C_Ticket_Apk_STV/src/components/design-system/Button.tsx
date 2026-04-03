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

interface ButtonProps extends Omit<TamaguiButtonProps, 'size'> {
  title?: string
  icon?: keyof typeof Ionicons.glyphMap
  iconPosition?: 'left' | 'right'
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: '$primary', text: 'white' },
  secondary: { bg: '$secondary', text: 'white' },
  success: { bg: '$success', text: 'white' },
  warning: { bg: '$warning', text: 'white' },
  error: { bg: '$error', text: 'white' },
  outline: { bg: 'transparent', text: '$primary', border: '$primary' },
  ghost: { bg: 'transparent', text: '$color' },
}

const sizeStyles: Record<ButtonSize, { padding: number; fontSize: number; iconSize: number; height: number; gap: number }> = {
  xs: { padding: 8, fontSize: 12, iconSize: 14, height: 32, gap: 4 },
  sm: { padding: 10, fontSize: 13, iconSize: 16, height: 36, gap: 6 },
  md: { padding: 12, fontSize: 15, iconSize: 18, height: 44, gap: 8 },
  lg: { padding: 16, fontSize: 16, iconSize: 20, height: 52, gap: 10 },
  xl: { padding: 20, fontSize: 18, iconSize: 24, height: 60, gap: 12 },
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

  return (
    <TamaguiButton
      onPress={onPress}
      backgroundColor={disabled ? '$color5' : colors.bg}
      borderColor={colors.border}
      borderWidth={variant === 'outline' ? 2 : 0}
      borderRadius={12}
      height={dims.height}
      paddingHorizontal={dims.padding}
      paddingVertical={dims.padding}
      width={fullWidth ? '100%' : undefined}
      disabled={disabled || loading}
      opacity={disabled || loading ? 0.5 : 1}
      pressStyle={{ opacity: 0.85, scale: 0.98 }}
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      {loading ? (
        <Spinner size="small" color={colors.text} />
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

// Botón solo ícono para acciones como logout
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
  variant = 'primary',
  size = 20,
  disabled = false,
}: IconButtonProps) {
  const colors = variantStyles[variant]
  const buttonSize = size + 24

  return (
    <TamaguiButton
      onPress={onPress}
      backgroundColor={disabled ? '$color5' : colors.bg}
      borderColor={colors.border}
      borderWidth={variant === 'outline' ? 2 : 0}
      borderRadius={12}
      width={buttonSize}
      height={buttonSize}
      padding={0}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      pressStyle={{ opacity: 0.85, scale: 0.95 }}
      justifyContent="center"
      alignItems="center"
    >
      <Ionicons name={icon} size={size} color={colors.text} />
    </TamaguiButton>
  )
}
