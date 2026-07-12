import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Hook for detecting and respecting reduced motion preferences
 * Works with both system-level prefers-reduced-motion and manual toggle
 */
export const useReducedMotion = () => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [userPreference, setUserPreference] = useState(false);

  // Check system preference on mount
  useEffect(() => {
    const checkSystemPreference = async () => {
      const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setReduceMotion(isEnabled);
    };
    checkSystemPreference();

    // Listen for changes
    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setReduceMotion(enabled);
      }
    );

    return () => {
      listener.remove();
    };
  }, []);

  // Check CSS media query for web
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        setReduceMotion(e.matches || userPreference);
      };
      mediaQuery.addEventListener('change', handleChange);
      // Initial check
      setReduceMotion(mediaQuery.matches || userPreference);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [userPreference]);

  const toggleReducedMotion = () => {
    setUserPreference(prev => {
      const newValue = !prev;
      setReduceMotion(newValue);
      // Persist to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('portfolio-reduced-motion', String(newValue));
      }
      return newValue;
    });
  };

  // Load user preference from localStorage on mount
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('portfolio-reduced-motion');
      if (stored !== null) {
        const pref = stored === 'true';
        setUserPreference(pref);
        setReduceMotion(prev => prev || pref);
      }
    }
  }, []);

  return {
    reduceMotion,
    systemPrefersReducedMotion: reduceMotion && !userPreference,
    userPreference,
    toggleReducedMotion,
    // Helper to conditionally apply animations
    withReducedMotion: <T>(animatedValue: T, staticValue: T): T =>
      reduceMotion ? staticValue : animatedValue,
  };
};

/**
 * Hook for getting animation config based on reduced motion
 */
export const useAnimationConfig = () => {
  const { reduceMotion } = useReducedMotion();

  return {
    // Duration: 0 when reduced motion, otherwise use provided duration
    duration: (ms: number) => (reduceMotion ? 0 : ms),
    // Spring config: no animation when reduced motion
    spring: (config: object) => (reduceMotion ? { ...config, duration: 0 } : config),
    // Timing config: instant when reduced motion
    timing: (config: object) => (reduceMotion ? { ...config, duration: 0 } : config),
  };
};