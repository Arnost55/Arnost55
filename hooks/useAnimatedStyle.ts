import { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing, runOnJS } from 'react-native-reanimated';
import { arcSpring, motion } from '../constants/design-tokens';
import { useReducedMotion } from './useReducedMotion';

/**
 * Hook for creating Reanimated animations with Arc Browser spring easing
 * Respects reduced motion preferences
 */
export const useAnimatedStyleHelpers = () => {
  const { reduceMotion } = useReducedMotion();

  // Spring config matching Arc's cubic-bezier(0.32, 0.72, 0, 1)
  const springConfig = reduceMotion
    ? { duration: 0 }
    : arcSpring;

  const fastSpringConfig = reduceMotion
    ? { duration: 0 }
    : { ...arcSpring, stiffness: 200, damping: 25 };

  /**
   * Create entrance animation (fade in + slide up)
   * @param delay - Delay in milliseconds before animation starts
   * @returns Object with animated style and control functions
   */
  const createEntrance = (delay: number = 0) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    const start = () => {
      const run = () => {
        opacity.value = withSpring(1, springConfig);
        translateY.value = withSpring(0, springConfig);
      };

      if (delay > 0) {
        setTimeout(run, delay);
      } else {
        run();
      }
    };

    const reset = () => {
      opacity.value = 0;
      translateY.value = 30;
    };

    return { animatedStyle, start, reset, opacity, translateY };
  };

  /**
   * Create staggered entrance for list items
   * @param index - Item index for stagger calculation
   * @param baseDelay - Base delay between items (default 100ms)
   */
  const createStaggeredEntrance = (index: number, baseDelay: number = 100) => {
    return createEntrance(index * baseDelay);
  };

  /**
   * Create press/tap scale animation
   * @param scale - Scale factor when pressed (default 0.98)
   */
  const createPressScale = (scale: number = 0.98) => {
    const scaleValue = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
    }));

    const onPressIn = () => {
      scaleValue.value = withSpring(scale, fastSpringConfig);
    };

    const onPressOut = () => {
      scaleValue.value = withSpring(1, fastSpringConfig);
    };

    return { animatedStyle, onPressIn, onPressOut, scaleValue };
  };

  /**
   * Create hover elevation animation for cards
   */
  const createHoverElevation = () => {
    const translateY = useSharedValue(0);
    const shadowOpacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const enter = () => {
      translateY.value = withSpring(-4, springConfig);
      shadowOpacity.value = withSpring(1, springConfig);
    };

    const leave = () => {
      translateY.value = withSpring(0, springConfig);
      shadowOpacity.value = withSpring(0, springConfig);
    };

    return { animatedStyle, enter, leave, translateY, shadowOpacity };
  };

  /**
   * Create chip/filter selection animation
   */
  const createChipSelection = () => {
    const translateY = useSharedValue(0);
    const isSelected = useSharedValue(false);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const setSelected = (selected: boolean) => {
      isSelected.value = selected;
      translateY.value = withSpring(selected ? -2 : 0, fastSpringConfig);
    };

    return { animatedStyle, setSelected, translateY, isSelected };
  };

  /**
   * Create progress bar animation (for skill proficiency)
   */
  const createProgressAnimation = (target: number, duration: number = 800) => {
    const progress = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      width: `${progress.value}%`,
    }));

    const start = () => {
      progress.value = withTiming(target, {
        duration: reduceMotion ? 0 : duration,
        easing: Easing.out(Easing.cubic),
      });
    };

    const reset = () => {
      progress.value = 0;
    };

    return { animatedStyle, start, reset, progress };
  };

  /**
   * Create modal/sheet slide animation
   * @param type - 'sheet' (bottom) or 'modal' (center)
   */
  const createModalAnimation = (type: 'sheet' | 'modal' = 'sheet') => {
    if (type === 'sheet') {
      const translateY = useSharedValue(reduceMotion ? 0 : '100%');

      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
      }));

      const enter = () => {
        translateY.value = withSpring(0, springConfig);
      };

      const exit = () => {
        translateY.value = withSpring('100%', springConfig);
      };

      return { animatedStyle, enter, exit, translateY };
    } else {
      const opacity = useSharedValue(0);
      const scale = useSharedValue(0.95);

      const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      }));

      const enter = () => {
        opacity.value = withSpring(1, springConfig);
        scale.value = withSpring(1, springConfig);
      };

      const exit = () => {
        opacity.value = withSpring(0, fastSpringConfig);
        scale.value = withSpring(0.95, fastSpringConfig);
      };

      return { animatedStyle, enter, exit, opacity, scale };
    }
  };

  /**
   * Create backdrop fade animation
   */
  const createBackdropAnimation = () => {
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    const enter = () => {
      opacity.value = withTiming(1, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    };

    const exit = () => {
      opacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    };

    return { animatedStyle, enter, exit, opacity };
  };

  /**
   * Create gradient backdrop position animation (slow ambient shift)
   */
  const createGradientAnimation = () => {
    const position = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      backgroundPosition: `${position.value}% 50%`,
    }));

    const start = () => {
      // Animate from 0% to 100% over 20s, then reverse
      position.value = withTiming(100, {
        duration: 20000,
        easing: Easing.linear,
      }, (finished) => {
        if (finished) {
          position.value = withTiming(0, {
            duration: 20000,
            easing: Easing.linear,
          }, (finished) => {
            if (finished) runOnJS(start)();
          });
        }
      });
    };

    return { animatedStyle, start, position };
  };

  return {
    createEntrance,
    createStaggeredEntrance,
    createPressScale,
    createHoverElevation,
    createChipSelection,
    createProgressAnimation,
    createModalAnimation,
    createBackdropAnimation,
    createGradientAnimation,
    springConfig,
    fastSpringConfig,
    reduceMotion,
  };
};

/**
 * Convenience hook for scroll-triggered animations
 * Use with react-native-reanimated's useScrollViewOffset or useAnimatedReaction
 */
export const useScrollAnimation = () => {
  const { reduceMotion } = useReducedMotion();
  const springConfig = reduceMotion ? { duration: 0 } : arcSpring;

  const createScrollFadeIn = (threshold: number = 0.1) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    // This would be driven by useAnimatedReaction with scroll position
    const update = (progress: number) => {
      if (progress >= threshold) {
        opacity.value = withSpring(1, springConfig);
        translateY.value = withSpring(0, springConfig);
      } else {
        opacity.value = withSpring(0, springConfig);
        translateY.value = withSpring(30, springConfig);
      }
    };

    return { animatedStyle, update, opacity, translateY };
  };

  return { createScrollFadeIn, springConfig };
};