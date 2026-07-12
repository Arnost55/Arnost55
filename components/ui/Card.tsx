import React, { forwardRef, ReactNode } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { arcSpring } from '../../constants/design-tokens';

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  pressable?: boolean;
  onPress?: () => void;
  className?: string;
  style?: any;
  testID?: string;
}

/**
 * Card - Arc Browser frosted glass card with variants
 */
export const Card = forwardRef<View, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      hover = false,
      pressable = false,
      onPress,
      className = '',
      style,
      testID,
    },
    ref
  ) => {
    const { isDark } = useTheme();
    const translateY = useSharedValue(0);
    const shadowOpacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      shadowOpacity: shadowOpacity.value,
      elevation: shadowOpacity.value * 4,
    }));

    const handleHoverIn = () => {
      if (hover && !pressable) {
        translateY.value = withSpring(-4, arcSpring);
        shadowOpacity.value = withSpring(1, arcSpring);
      }
    };

    const handleHoverOut = () => {
      if (hover && !pressable) {
        translateY.value = withSpring(0, arcSpring);
        shadowOpacity.value = withSpring(0, arcSpring);
      }
    };

    const handlePressIn = () => {
      if (pressable) {
        translateY.value = withSpring(-2, arcSpring);
      }
    };

    const handlePressOut = () => {
      if (pressable) {
        translateY.value = withSpring(0, arcSpring);
      }
    };

    const paddingMap = {
      none: 0,
      sm: 12,
      md: 16,
      lg: 24,
    };

    const variantBase = {
      default: {
        backgroundColor: isDark ? 'rgba(30, 30, 36, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderWidth: 1,
        borderColor: isDark ? 'var(--border)' : 'var(--border)',
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDark ? 'var(--border)' : 'var(--border)',
      },
      elevated: {
        backgroundColor: isDark ? '#1e1e24' : '#ffffff',
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 32,
        elevation: 4,
      },
    };

    const baseStyles = [
      styles.base,
      variantBase[variant],
      { borderRadius: 16, padding: paddingMap[padding] },
      style,
    ];

    if (pressable && onPress) {
      return (
        <BlurView
          ref={ref}
          intensity={isDark ? 'dark' : 'light'}
          style={baseStyles}
          className={className}
        >
          <Pressable
            style={({ pressed }) => [
              animatedStyle,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPressEnd={handlePressOut}
            testID={testID}
            accessibilityRole="button"
          >
            {children}
          </Pressable>
        </BlurView>
      );
    }

    if (hover) {
      return (
        <BlurView
          ref={ref}
          intensity={isDark ? 'dark' : 'light'}
          style={baseStyles}
          className={className}
        >
          <View style={animatedStyle} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
            {children}
          </View>
        </BlurView>
      );
    }

    return (
      <BlurView
        ref={ref}
        intensity={isDark ? 'dark' : 'light'}
        style={baseStyles}
        className={className}
      >
        <View style={animatedStyle}>
          {children}
        </View>
      </BlurView>
    );
  }
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  base: {
    // Base card styles applied via style prop
  },
});

export default Card;