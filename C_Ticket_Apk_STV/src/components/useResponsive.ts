import { useWindowDimensions, Platform } from 'react-native'

// iOS-inspired breakpoints
// iPhone SE: 375x667, iPhone 15: 393x852, iPad: 768x1024
export function useResponsive() {
  const { width, height } = useWindowDimensions()
  
  // Device type detection
  const isSmallPhone = width < 375
  const isPhone = width >= 375 && width < 600
  const isLargePhone = width >= 600 && width < 768
  const isTablet = width >= 768 && width < 1024
  const isLargeTablet = width >= 1024
  
  // Orientation
  const isPortrait = height > width
  const isLandscape = width > height
  
  // Convenience flags
  const isMobile = width < 768
  const isDesktop = width >= 1024
  
  // Dynamic spacing for mobile - more generous spacing
  const spacing = {
    xs: isMobile ? 4 : 6,
    sm: isMobile ? 8 : 10,
    md: isMobile ? 12 : 16,
    lg: isMobile ? 16 : 20,
    xl: isMobile ? 20 : 24,
    '2xl': isMobile ? 24 : 32,
    '3xl': isMobile ? 32 : 40,
  }
  
  // Padding for screens
  const padding = {
    screen: isMobile ? 16 : 24,
    card: isMobile ? 16 : 20,
    section: isMobile ? 12 : 16,
  }

  return {
    width,
    height,
    isSmallPhone,
    isPhone,
    isLargePhone,
    isTablet,
    isLargeTablet,
    isMobile,
    isDesktop,
    isPortrait,
    isLandscape,
    spacing,
    padding,
    // Platform-specific helpers
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  }
}
