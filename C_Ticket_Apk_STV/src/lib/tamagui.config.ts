import { createTamagui, createFont, createTokens } from '@tamagui/core'

// Tipografía profesional
const font = createFont({
  family: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
  size: {
    true: 16,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  weight: {
    true: '400',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  letterSpacing: {
    true: 0,
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
  lineHeight: {
    true: 1.5,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
})

// Tokens de diseño
const tokens = createTokens({
  color: {
    // Texto
    text: '#1a1a1a',
    textSecondary: '#4a5568',
    textTertiary: '#718096',
    textMuted: '#a0aec0',
    textInverse: '#ffffff',
    
    // Fondos
    background: '#ffffff',
    backgroundSecondary: '#f7fafc',
    backgroundTertiary: '#edf2f7',
    
    // Bordes
    border: '#e2e8f0',
    borderStrong: '#cbd5e0',
    
    // Colores de marca
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    primaryMuted: '#dbeafe',
    
    secondary: '#7c3aed',
    secondaryLight: '#8b5cf6',
    secondaryDark: '#6d28d9',
    secondaryMuted: '#ede9fe',
    
    // Estados
    success: '#10b981',
    successMuted: '#d1fae5',
    warning: '#f59e0b',
    warningMuted: '#fef3c7',
    error: '#ef4444',
    errorMuted: '#fee2e2',
    info: '#3b82f6',
    infoMuted: '#dbeafe',
  },
  space: {
    true: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },
  size: {
    true: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },
  radius: {
    true: 0,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
})

// Temas
const themes = {
  light: {
    color: tokens.color.text,
    color2: tokens.color.textSecondary,
    color3: tokens.color.textTertiary,
    color4: tokens.color.textMuted,
    background: tokens.color.background,
    background2: tokens.color.backgroundSecondary,
    background3: tokens.color.backgroundTertiary,
    borderColor: tokens.color.border,
    primary: tokens.color.primary,
    secondary: tokens.color.secondary,
    success: tokens.color.success,
    warning: tokens.color.warning,
    error: tokens.color.error,
  },
  dark: {
    color: '#f7fafc',
    color2: '#e2e8f0',
    color3: '#cbd5e0',
    color4: '#a0aec0',
    background: '#0f172a',
    background2: '#1e293b',
    background3: '#334155',
    borderColor: '#475569',
    primary: '#60a5fa',
    secondary: '#a78bfa',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  },
}

export const tamaguiConfig = createTamagui({
  defaultTheme: 'light',
  fonts: {
    body: font,
    heading: font,
  },
  tokens,
  themes,
  shorthands: {
    f: 'flex',
    ai: 'alignItems',
    jc: 'justifyContent',
    fd: 'flexDirection',
    p: 'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    pt: 'paddingTop',
    pr: 'paddingRight',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    m: 'margin',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft',
    br: 'borderRadius',
    bw: 'borderWidth',
    bc: 'borderColor',
    w: 'width',
    h: 'height',
    c: 'color',
    bg: 'backgroundColor',
    fs: 'fontSize',
    fw: 'fontWeight',
    ta: 'textAlign',
  },
})

export type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
