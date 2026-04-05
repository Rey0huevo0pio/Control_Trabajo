import { createTamagui, createFont, createTokens } from '@tamagui/core'

// Tipografía profesional estilo iOS - San Francisco/System fonts
const font = createFont({
  family: 'System, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  size: {
    true: 17, // iOS base font size (más grande para accesibilidad)
    xs: 13,
    sm: 15,
    md: 17,
    lg: 20,
    xl: 22,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
    '5xl': 48,
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
    tight: -0.4,
    normal: 0,
    wide: 0.3,
  },
  lineHeight: {
    true: 1.47,
    tight: 1.2,
    normal: 1.47,
    relaxed: 1.6,
  },
})

// Tokens de diseño estilo iOS - Colores suaves y accesibles
const tokens = createTokens({
  color: {
    // Texto (alto contraste para accesibilidad)
    text: '#000000',
    textSecondary: '#3C3C43', // iOS secondary label
    textTertiary: '#8E8E93', // iOS tertiary label
    textMuted: '#C7C7CC',
    textInverse: '#ffffff',

    // Fondos estilo iOS
    background: '#F2F2F7', // iOS system background
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F9F9F9',
    backgroundGrouped: '#F2F2F7',
    backgroundElevated: '#FFFFFF',

    // Bordes sutiles
    border: '#D1D1D6', // iOS separator
    borderStrong: '#AEAEB2',
    borderSubtle: '#E5E5EA',

    // Colores de marca - más suaves y modernos
    primary: '#007AFF', // iOS system blue
    primaryLight: '#409CFF',
    primaryDark: '#0055D4',
    primaryMuted: '#E5F1FF',

    secondary: '#5856D6', // iOS system purple
    secondaryLight: '#7A78E8',
    secondaryDark: '#3634A3',
    secondaryMuted: '#F0EFFB',

    // Estados con colores iOS system
    success: '#34C759', // iOS system green
    successMuted: '#E3F9E8',
    warning: '#FF9500', // iOS system orange
    warningMuted: '#FFF3E0',
    error: '#FF3B30', // iOS system red
    errorMuted: '#FFE5E3',
    info: '#5AC8FA', // iOS system cyan
    infoMuted: '#E5F7FD',
    orange: '#FF9500',
    orangeMuted: '#FFF3E0',
    pink: '#FF2D55',
    pinkMuted: '#FFE5EB',
    teal: '#5AC8FA',
    tealMuted: '#E5F7FD',
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
    '6xl': 64,
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
  // Radios grandes estilo iOS
  radius: {
    true: 0,
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    full: 9999,
  },
  // Sombras sutiles estilo iOS
  shadow: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
    md: '0 4px 8px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.10)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.12)',
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

// Temas estilo iOS
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
    color: '#FFFFFF',
    color2: '#EBEBF5',
    color3: '#8E8E93',
    color4: '#636366',
    background: '#000000',
    background2: '#1C1C1E',
    background3: '#2C2C2E',
    borderColor: '#38383A',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
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
