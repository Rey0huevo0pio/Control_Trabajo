/**
 * ============================================================================
 * 🎨 TAMAGUI CONFIG - Configuración de Diseño para Web
 * ============================================================================
 * 
 * QUÉ HACE ESTE ARCHIVO:
 * - Configura Tamagui para web con MISMO diseño que el móvil
 * - Mismos tokens de color, spacing, radius
 * - Mismos temas (light/dark)
 * - Adaptado para web (CSS-compatible)
 * 
 * CONEXIONES:
 * - Mobile: C_Ticket_Apk_STV/src/lib/tamagui.config.ts (mismos tokens)
 * - App.jsx: Se importa aquí para envolver la app
 * - Design System: Usa estos tokens todos los componentes
 * 
 * IMPORTANTE:
 * - MISMOS COLORES que el móvil → consistencia total
 * - MISMOS TOKENS → fácil migración
 * - Web-compatible → funciona en Chrome, Firefox, Safari, Edge
 * 
 * ============================================================================
 */
import { createTamagui } from 'tamagui'

// Tipografía profesional - Web fonts
const config = createTamagui({
  defaultTheme: 'light',
  themes: {
    light: {
      // Colores de texto
      color: '#000000',
      color2: '#3C3C43',
      color3: '#8E8E93',
      color4: '#C7C7CC',
      
      // Colores de fondo
      background: '#F2F2F7',
      background2: '#FFFFFF',
      background3: '#F9F9F9',
      
      // Bordes
      borderColor: '#D1D1D6',
      
      // Colores de marca
      primary: '#007AFF',
      secondary: '#5856D6',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
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
  },
  tokens: {
    color: {
      // Texto
      text: '#000000',
      textSecondary: '#3C3C43',
      textTertiary: '#8E8E93',
      textMuted: '#C7C7CC',
      
      // Fondos
      background: '#F2F2F7',
      backgroundSecondary: '#FFFFFF',
      backgroundTertiary: '#F9F9F9',
      
      // Bordes
      border: '#D1D1D6',
      borderStrong: '#AEAEB2',
      borderSubtle: '#E5E5EA',
      
      // Marca
      primary: '#007AFF',
      primaryLight: '#409CFF',
      primaryDark: '#0055D4',
      primaryMuted: '#E5F1FF',
      
      secondary: '#5856D6',
      secondaryLight: '#7A78E8',
      secondaryDark: '#3634A3',
      secondaryMuted: '#F0EFFB',
      
      // Estados
      success: '#34C759',
      successMuted: '#E3F9E8',
      warning: '#FF9500',
      warningMuted: '#FFF3E0',
      error: '#FF3B30',
      errorMuted: '#FFE5E3',
      info: '#5AC8FA',
      infoMuted: '#E5F7FD',
    },
    space: {
      xs: 4,
      sm: 8,
      md: 12,
      true: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
      '4xl': 40,
      '5xl': 48,
      '6xl': 64,
    },
    size: {
      xs: 4,
      sm: 8,
      md: 12,
      true: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
      '4xl': 40,
      '5xl': 48,
    },
    radius: {
      xs: 6,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      full: 9999,
    },
    zIndex: {
      xs: 0,
      sm: 100,
      md: 200,
      true: 300,
      lg: 400,
      xl: 500,
      '2xl': 600,
      '3xl': 700,
      '4xl': 800,
      '5xl': 900,
    },
  },
  fonts: {
    body: {
      family: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      size: {
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
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        tight: -0.4,
        normal: 0,
        wide: 0.3,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.47,
        relaxed: 1.6,
      },
    },
    heading: {
      family: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      size: {
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
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  media: {
    sm: { maxWidth: 640 },
    md: { maxWidth: 768 },
    lg: { maxWidth: 1024 },
    xl: { maxWidth: 1280 },
    gtSm: { minWidth: 641 },
    gtMd: { minWidth: 769 },
    gtLg: { minWidth: 1025 },
    short: { maxHeight: 640 },
    tall: { minHeight: 768 },
  },
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

export type Conf = typeof config

declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends Conf {}
}

export default config
