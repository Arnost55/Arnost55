import React, { forwardRef, ReactNode } from 'react';
import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { arcSpring } from '../../constants/design-tokens';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'glass' | 'subtle' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  style?: any;
  testID?: string;
}

/**
 * Button - Arc Browser style buttons with spring animations
 * Variants: primary (gradient), glass (frosted), subtle (text with hover bg), outline, ghost
 */
export const Button = forwardRef<Pressable, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      onPress,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      style,
      testID,
    },
    ref
  ) => {
    const { isDark } = useTheme();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const handlePressIn = () => {
      if (!disabled && !loading) {
        scale.value = withSpring(0.98, arcSpring);
        opacity.value = withSpring(0.8, arcSpring);
      }
    };

    const handlePressOut = () => {
      if (!disabled && !loading) {
        scale.value = withSpring(1, arcSpring);
        opacity.value = withSpring(1, arcSpring);
      }
    };

    const baseStyles = [
      styles.base,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      loading && styles.loading,
      style,
    ];

    const textStyles = [
      styles.text,
      styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`],
    ];

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          ...baseStyles,
          animatedStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPressEnd={handlePressOut}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        testID={testID}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#fff' : isDark ? '#fff' : '#1a1a1f'}
            style={styles.spinner}
          />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text style={textStyles} numberOfLines={1}>{children}</Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </View>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12, // radius.md
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    // Additional loading styles
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
  // Variant styles
  primary: {
    backgroundImage: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    shadowColor: '#ff7e5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subtle: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'var(--accent)',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Size styles
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  // Text variant styles
  text: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
  },
  textPrimary: {
    color: '#fff',
  },
  textGlass: {
    color: 'var(--fg)',
  },
  textSubtle: {
    color: 'var(--accent)',
  },
  textOutline: {
    color: 'var(--accent)',
  },
  textGhost: {
    color: 'var(--accent)',
  },
  // Text size styles
  textSm: {
    fontSize: 13, // text-sm
  },
  textMd: {
    fontSize: 15, // text-base
  },
  textLg: {
    fontSize: 16,
  },
  spinner: {
    // Center spinner
  },
});

export default Button;