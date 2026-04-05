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
  
  // Dynamic sizing for accessibility
  // Larger spacing on bigger screens
  const spacingScale = isPhone ? 1 : isTablet ? 1.2 : 1.4
  // Font scaling for accessibility
  const fontScale = isSmallPhone ? 0.9 : isPhone ? 1 : isTablet ? 1.1 : 1.2
  
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
    spacingScale,
    fontScale,
    // Platform-specific helpers
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  }
}
