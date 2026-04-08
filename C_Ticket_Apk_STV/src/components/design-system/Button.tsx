/**
 * ============================================================================
 * 🎨 BUTTON - Professional Button Component (Google/Microsoft Style)
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Botones modernos con gradientes y animaciones
 * - Múltiples variantes: primary, secondary, success, warning, error, outline, ghost
 * - Micro-interacciones al presionar
 * - Sombras y elevaciones profesionales
 *
 * ============================================================================
 */
import React from 'react'
import { TouchableOpacity, Animated, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from './Text'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps {
  title?: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: keyof typeof Ionicons.glyphMap
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  children?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: '#007AFF',
      shadowColor: '#007AFF',
    },
    text: { color: '#FFFFFF' },
  },
  secondary: {
    container: {
      backgroundColor: '#5856D6',
      shadowColor: '#5856D6',
    },
    text: { color: '#FFFFFF' },
  },
  success: {
    container: {
      backgroundColor: '#34C759',
      shadowColor: '#34C759',
    },
    text: { color: '#FFFFFF' },
  },
  warning: {
    container: {
      backgroundColor: '#FF9500',
      shadowColor: '#FF9500',
    },
    text: { color: '#FFFFFF' },
  },
  error: {
    container: {
      backgroundColor: '#FF3B30',
      shadowColor: '#FF3B30',
    },
    text: { color: '#FFFFFF' },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: '#007AFF',
    },
    text: { color: '#007AFF' },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: { color: '#007AFF' },
  },
}

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  xs: {
    container: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 32,
    },
    text: { fontSize: 12, fontWeight: '600' },
  },
  sm: {
    container: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      minHeight: 38,
    },
    text: { fontSize: 13, fontWeight: '600' },
  },
  md: {
    container: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 44,
    },
    text: { fontSize: 15, fontWeight: '600' },
  },
  lg: {
    container: {
      paddingHorizontal: 24,
      paddingVertical: 14,
      minHeight: 50,
    },
    text: { fontSize: 16, fontWeight: '600' },
  },
  xl: {
    container: {
      paddingHorizontal: 28,
      paddingVertical: 16,
      minHeight: 56,
    },
    text: { fontSize: 17, fontWeight: '700' },
  },
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  children,
}: ButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current
  const opacityAnim = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
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

  const vStyle = variantStyles[variant]
  const sStyle = sizeStyles[size]

  const containerStyle: ViewStyle = {
    ...vStyle.container,
    ...sStyle.container,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: disabled ? 0.5 : 1,
    ...(variant !== 'outline' && variant !== 'ghost' ? {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    } : {}),
    ...style,
  }

  const combinedTextStyle: TextStyle = {
    ...vStyle.text,
    ...sStyle.text,
    ...textStyle,
  }

  if (fullWidth) {
    containerStyle.width = '100%'
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={{ opacity: 1 }}
    >
      <Animated.View
        style={[
          containerStyle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {loading ? (
          <Text style={combinedTextStyle}>Cargando...</Text>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons name={icon} size={combinedTextStyle.fontSize || 15} color={combinedTextStyle.color} />
            )}
            {title && <Text style={combinedTextStyle}>{title}</Text>}
            {children}
            {icon && iconPosition === 'right' && (
              <Ionicons name={icon} size={combinedTextStyle.fontSize || 15} color={combinedTextStyle.color} />
            )}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}

/**
 * Icon Button Component
 */
interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
  variant?: ButtonVariant
  size?: number
  disabled?: boolean
  style?: ViewStyle
}

export function IconButton({
  icon,
  onPress,
  variant = 'primary',
  size = 24,
  disabled = false,
  style,
}: IconButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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

  const vStyle = variantStyles[variant]

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: vStyle.container.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Ionicons name={icon} size={size} color={vStyle.text.color} />
      </Animated.View>
    </TouchableOpacity>
  )
}
