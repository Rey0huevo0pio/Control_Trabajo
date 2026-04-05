import React from 'react'
import { Text as TamaguiText, type TextProps } from 'tamagui'

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodySmall' | 'caption' | 'label' | 'labelSmall' | 'title3' | 'title2' | 'title1'

interface CustomTextProps extends TextProps {
  variant?: TextVariant
  color?: string
  align?: 'left' | 'center' | 'right'
  children: React.ReactNode
}

// iOS-style typography with accessibility in mind
// Based on iOS Human Interface Guidelines typography
const variantStyles: Record<TextVariant, Partial<TextProps>> = {
  // Large titles
  h1: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  h3: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  // Title styles
  title1: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: -0.4,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    letterSpacing: -0.4,
  },
  h5: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  h6: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  // Body text - optimized for readability
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  // Label styles
  label: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  labelSmall: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
}

export function Text({
  variant = 'body',
  color,
  align = 'left',
  children,
  ...props
}: CustomTextProps) {
  const styles = variantStyles[variant]

  return (
    <TamaguiText
      color={color || '$color'}
      textAlign={align}
      {...styles}
      {...props}
      // Accessibility: allow text scaling
      allowFontScaling={true}
      maxFontSizeMultiplier={1.3}
    >
      {children}
    </TamaguiText>
  )
}
