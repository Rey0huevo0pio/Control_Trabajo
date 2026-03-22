import { createTamagui, createFont } from '@tamagui/core'

const font = createFont({
  family: 'System',
  size: {
    true: 16,
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
  },
  weight: {
    true: '400',
    1: '300',
    2: '400',
    3: '500',
    4: '600',
    5: '700',
  },
})

const themes = {
  light: {
    color: '#000000',
    color2: '#424242',
    color3: '#757575',
    color4: '#9e9e9e',
    color5: '#bdbdbd',
    background: '#ffffff',
    background2: '#f5f5f5',
    background3: '#eeeeee',
    borderColor: '#e0e0e0',
    primary: '#2196F3',
    secondary: '#9C27B0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
  dark: {
    color: '#ffffff',
    color2: '#bdbdbd',
    color3: '#9e9e9e',
    color4: '#757575',
    color5: '#424242',
    background: '#121212',
    background2: '#1e1e1e',
    background3: '#2c2c2c',
    borderColor: '#424242',
    primary: '#64B5F6',
    secondary: '#BA68C8',
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
  },
}

export const tamaguiConfig = createTamagui({
  fonts: {
    body: font,
    heading: font,
  },
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
