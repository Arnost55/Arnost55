import { useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { breakpoints, type Breakpoint } from '../constants/design-tokens';

/**
 * Hook for responsive breakpoints using React Native's useWindowDimensions
 * Returns the current breakpoint and helper functions
 */
export const useBreakpoint = () => {
  const { width } = useWindowDimensions();
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (width >= breakpoints.wide) return 'wide';
    if (width >= breakpoints.desktop) return 'desktop';
    if (width >= breakpoints.tablet) return 'tablet';
    return 'mobile';
  });

  useEffect(() => {
    let newBreakpoint: Breakpoint = 'mobile';
    if (width >= breakpoints.wide) newBreakpoint = 'wide';
    else if (width >= breakpoints.desktop) newBreakpoint = 'desktop';
    else if (width >= breakpoints.tablet) newBreakpoint = 'tablet';
    setBreakpoint(newBreakpoint);
  }, [width]);

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop' || breakpoint === 'wide';
  const isWide = breakpoint === 'wide';

  const isAtLeast = (target: Breakpoint) => {
    const order: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
    return order.indexOf(breakpoint) >= order.indexOf(target);
  };

  const isAtMost = (target: Breakpoint) => {
    const order: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
    return order.indexOf(breakpoint) <= order.indexOf(target);
  };

  return {
    breakpoint,
    width,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isAtLeast,
    isAtMost,
    // Tailwind-style breakpoint helpers
    sm: breakpoint === 'mobile' ? false : true,    // ≥ tablet
    md: breakpoint === 'mobile' || breakpoint === 'tablet' ? false : true, // ≥ desktop
    lg: breakpoint === 'wide',                     // wide only
  };
};

/**
 * Hook for getting responsive values based on current breakpoint
 */
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T) => {
  const { breakpoint } = useBreakpoint();
  const order: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];

  // Find the most specific value for current breakpoint
  for (let i = order.indexOf(breakpoint); i >= 0; i--) {
    const bp = order[i];
    if (values[bp] !== undefined) return values[bp];
  }
  return defaultValue;
};

/**
 * Get responsive grid columns based on breakpoint
 */
export const useGridColumns = (config: { mobile: number; tablet: number; desktop: number; wide?: number }) => {
  const { breakpoint } = useBreakpoint();
  switch (breakpoint) {
    case 'wide':
      return config.wide ?? config.desktop;
    case 'desktop':
      return config.desktop;
    case 'tablet':
      return config.tablet;
    default:
      return config.mobile;
  }
};

/**
 * Get responsive spacing based on breakpoint
 */
export const useResponsiveSpacing = (config: {
  mobile: number;
  tablet?: number;
  desktop?: number;
  wide?: number;
}) => {
  const { breakpoint } = useBreakpoint();
  switch (breakpoint) {
    case 'wide':
      return config.wide ?? config.desktop ?? config.tablet ?? config.mobile;
    case 'desktop':
      return config.desktop ?? config.tablet ?? config.mobile;
    case 'tablet':
      return config.tablet ?? config.mobile;
    default:
      return config.mobile;
  }
};