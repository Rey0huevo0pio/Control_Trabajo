/**
 * ============================================================================
 * 📐 LAYOUT - Professional Layout Components (Google/Microsoft Style)
 * ============================================================================
 *
 * QUÉ HACE ESTE ARCHIVO:
 * - Layouts modernos con SafeArea y animaciones
 * - Componentes Stack, HStack, VStack profesionales
 * - ScreenLayout con scroll y keyboard handling
 * - Loading states y empty states profesionales
 *
 * ============================================================================
 */
import React from 'react'
import { 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native'
import { Text } from './Text'
import { Card } from './Card'
import { useResponsive } from '../useResponsive'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// iOS/Android-style vertical stack
interface StackProps {
  children: React.ReactNode
  gap?: number | string
  style?: ViewStyle
  flex?: number
}

export function Stack({ 
  children, 
  gap = 16, 
  style,
  flex,
}: StackProps) {
  return (
    <View 
      style={[
        { 
          gap,
          flex,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

// iOS/Android-style horizontal stack
interface HStackProps {
  children: React.ReactNode
  gap?: number | string
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  style?: ViewStyle
  flex?: number
}

export function HStack({ 
  children, 
  gap = 16, 
  align = 'center', 
  justify,
  style,
  flex,
}: HStackProps) {
  return (
    <View 
      style={[
        { 
          flexDirection: 'row',
          alignItems: align,
          justifyContent: justify,
          gap,
          flex,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

// Professional screen layout
interface ScreenLayoutProps {
  children: React.ReactNode
  padding?: number
  scrollable?: boolean
  backgroundColor?: string
  useSafeArea?: boolean
  avoidKeyboard?: boolean
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
}

export function ScreenLayout({
  children,
  padding,
  scrollable = true,
  backgroundColor = '#F2F2F7',
  useSafeArea = true,
  avoidKeyboard = true,
  style,
  contentContainerStyle,
}: ScreenLayoutProps) {
  const { isMobile } = useResponsive()
  const insets = useSafeAreaInsets()

  const paddingHorizontal = padding || (isMobile ? 16 : 24)
  const paddingTop = useSafeArea
    ? (Platform.OS === 'ios' ? insets.top + 12 : 24)
    : 16

  const content = (
    <View
      style={[
        {
          flex: 1,
          backgroundColor,
          paddingHorizontal,
          paddingTop,
          paddingBottom: useSafeArea ? insets.bottom + 16 : 16,
          gap: 20,
        },
        style,
      ]}
    >
      {children}
    </View>
  )

  const wrappedContent = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {content}
    </KeyboardAvoidingView>
  ) : content

  if (scrollable) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingBottom: useSafeArea ? insets.bottom + 24 : 40,
            flexGrow: 1,
          },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {wrappedContent}
      </ScrollView>
    )
  }

  return wrappedContent
}

// Screen section component
interface ScreenSectionProps {
  title?: string
  children: React.ReactNode
  gap?: number | string
  padding?: number
  style?: ViewStyle
}

export function ScreenSection({ 
  title, 
  children, 
  gap = 16, 
  padding,
  style,
}: ScreenSectionProps) {
  return (
    <View 
      style={[
        { gap, padding },
        style,
      ]}
    >
      {title && (
        <Text 
          variant="h5" 
          fontWeight="700" 
          style={{ 
            marginBottom: 8,
            fontSize: 18,
          }}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  )
}

/**
 * Professional Loading Component
 */
interface LoadingProps {
  message?: string
  subMessage?: string
  size?: 'small' | 'large'
  color?: string
  style?: ViewStyle
  fullScreen?: boolean
}

export function Loading({
  message = 'Cargando...',
  subMessage,
  size = 'large',
  color = '#007AFF',
  style,
  fullScreen = false,
}: LoadingProps) {
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  const loadingContent = (
    <Animated.View 
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          gap: 12,
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text 
          variant="body" 
          fontWeight="600" 
          style={{ 
            color: '#000000',
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      )}
      {subMessage && (
        <Text 
          variant="bodySmall" 
          style={{ 
            color: '#8E8E93',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          {subMessage}
        </Text>
      )}
    </Animated.View>
  )

  if (fullScreen) {
    return (
      <View 
        style={{ 
          flex: 1, 
          backgroundColor: '#F2F2F7',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loadingContent}
      </View>
    )
  }

  return (
    <Card
      variant="outlined"
      padding={24}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loadingContent}
    </Card>
  )
}

/**
 * Professional Empty State Component
 */
interface EmptyStateProps {
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap
  title: string
  message?: string
  actionButton?: React.ReactNode
  style?: ViewStyle
}

export function EmptyState({
  icon,
  title,
  message,
  actionButton,
  style,
}: EmptyStateProps) {
  const { Ionicons } = require('@expo/vector-icons')
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#F2F2F7',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Ionicons name={icon} size={60} color="#C7C7CC" />
      </View>
      
      <Text
        variant="h5"
        fontWeight="700"
        style={{
          fontSize: 20,
          color: '#000000',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      
      {message && (
        <Text
          variant="body"
          style={{
            fontSize: 15,
            color: '#8E8E93',
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          {message}
        </Text>
      )}
      
      {actionButton}
    </Animated.View>
  )
}

/**
 * Professional Error State Component
 */
interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  style?: ViewStyle
}

export function ErrorState({
  title = 'Error',
  message,
  onRetry,
  style,
}: ErrorStateProps) {
  const { Ionicons } = require('@expo/vector-icons')
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#FFE5E3',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Ionicons name="alert-circle" size={60} color="#FF3B30" />
      </View>
      
      <Text
        variant="h5"
        fontWeight="700"
        style={{
          fontSize: 20,
          color: '#000000',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      
      <Text
        variant="body"
        style={{
          fontSize: 15,
          color: '#8E8E93',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        {message}
      </Text>
      
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            variant="body"
            fontWeight="700"
            style={{
              color: '#FFFFFF',
              fontSize: 15,
            }}
          >
            Intentar de Nuevo
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}

// Fix the missing TouchableOpacity import issue
import { TouchableOpacity } from 'react-native'
