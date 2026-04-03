import React from 'react'
import { Text as TamaguiText, type TextProps } from 'tamagui'

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodySmall' | 'caption' | 'label' | 'labelSmall'

interface CustomTextProps extends TextProps {
  variant?: TextVariant
  color?: string
  align?: 'left' | 'center' | 'right'
  children: React.ReactNode
}

const variantStyles: Record<TextVariant, Partial<TextProps>> = {
  h1: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
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
    >
      {children}
    </TamaguiText>
  )
}
