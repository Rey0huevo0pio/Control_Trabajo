import { useWindowDimensions } from 'react-native'

export function useResponsive() {
  const { width, height } = useWindowDimensions()
  const isMobile = width < 480
  const isTablet = width >= 480 && width < 768
  const isDesktop = width >= 768

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
  }
}
