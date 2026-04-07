import { useWindowDimensions, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// iOS-inspired breakpoints for modern devices
// iPhone SE: 375x667, iPhone 15: 393x852, iPhone 15 Pro Max: 430x932
// Small Android: 360x640, Standard Android: 393x851, Foldable: ~600x800
// iPad Mini: 768x1024, iPad Pro: 1024x1366
export function useResponsive() {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  // Device type detection - refined for modern phones
  const isSmallPhone = width < 375  // iPhone SE, small Android
  const isPhone = width >= 375 && width < 600  // Standard phones
  const isLargePhone = width >= 600 && width < 768  // Large phones, foldables unfolded
  const isTablet = width >= 768 && width < 1024  // iPad mini, small tablets
  const isLargeTablet = width >= 1024  // iPad Pro, large tablets

  // Orientation
  const isPortrait = height > width
  const isLandscape = width > height

  // Convenience flags - better mobile detection
  const isMobile = width < 768
  const isSmallMobile = width < 375
  const isStandardMobile = width >= 375 && width < 600
  const isDesktop = width >= 1024

  // Safe area aware spacing
  const safeSpacing = {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  }

  // Dynamic spacing for mobile - optimized for modern phones with full-screen displays
  const spacing = {
    xs: isMobile ? 4 : 6,
    sm: isMobile ? 8 : 10,
    md: isMobile ? 12 : 16,
    lg: isMobile ? 16 : 24,
    xl: isMobile ? 24 : 32,
    '2xl': isMobile ? 32 : 40,
    '3xl': isMobile ? 40 : 48,
  }

  // Padding for screens - positioned below status bar for notch devices
  const padding = {
    screen: isMobile ? 20 : 32,
    screenHorizontal: isMobile ? 20 : 32,
    screenTop: isMobile ? insets.top + 8 : 16, // Below status bar + small gap
    card: isMobile ? 16 : 24,
    section: isMobile ? 16 : 24,
  }

  // Font size scaling for better readability
  const fontScale = {
    small: isSmallPhone ? 0.9 : 1,
    normal: 1,
    large: isLargePhone || isTablet ? 1.1 : 1,
    xlarge: isLargeTablet ? 1.2 : 1,
  }

  // Button sizing - prevent overflow on small screens
  const buttonSizes = {
    minHeight: isSmallPhone ? 44 : 48, // Minimum touch target (Apple HIG: 44pt)
    padding: isMobile ? 12 : 16,
    fontSize: isMobile ? 16 : 17,
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
    isSmallMobile,
    isStandardMobile,
    isDesktop,
    isPortrait,
    isLandscape,
    spacing,
    padding,
    safeSpacing,
    fontScale,
    buttonSizes,
    // Platform-specific helpers
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    // Helper for content below header
    contentTopPadding: insets.top + 56, // Status bar + header height
  }
}
