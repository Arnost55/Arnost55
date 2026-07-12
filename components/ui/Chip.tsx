import React, { forwardRef, ReactNode } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { arcSpring, motion } from '../../constants/design-tokens';

export interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'selected' | 'dot' | 'success' | 'outline';
  size?: 'sm' | 'md';
  disabled?: boolean;
  onPress?: () => void;
  selected?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  style?: any;
  testID?: string;
}

/**
 * Chip/Pill - Arc Browser style pills for tags, filters, categories
 * Variants: default (accent/16), selected (gradient), dot (with indicator), success, outline
 */
export const Chip = forwardRef<Pressable, ChipProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      disabled = false,
      onPress,
      selected = false,
      leftIcon,
      rightIcon,
      className = '',
      style,
      testID,
    },
    ref
  ) => {
    const { isDark } = useTheme();
    const isSelected = selected || variant === 'selected';
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const handlePressIn = () => {
      if (!disabled) {
        translateY.value = withSpring(-1, arcSpring);
      }
    };

    const handlePressOut = () => {
      if (!disabled) {
        translateY.value = withSpring(0, arcSpring);
      }
    };

    const variantStyles = isSelected
      ? [styles.selected, { backgroundImage: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }]
      : styles[variant];

    const baseStyles = [
      styles.base,
      variantStyles,
      styles[size],
      disabled && styles.disabled,
      style,
    ];

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          ...baseStyles,
          animatedStyle,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPressEnd={handlePressOut}
        disabled={disabled}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityState={{ selected: isSelected, disabled }}
        testID={testID}
      >
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[
            styles.text,
            styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
            isSelected && styles.textSelected,
            styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`],
          ]}>{children}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      </Pressable>
    );
  }
);

Chip.displayName = 'Chip';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999, // radius.pill
    gap: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    // Additional pressed state handled by animation
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconLeft: {
    marginRight: 2,
  },
  iconRight: {
    marginLeft: 2,
  },
  // Variant styles
  default: {
    backgroundColor: 'rgba(255, 95, 95, 0.16)', // accent/16
    borderWidth: 0,
  },
  selected: {
    // Gradient applied dynamically
    borderWidth: 0,
  },
  dot: {
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    borderWidth: 0,
    paddingLeft: 12,
  },
  success: {
    backgroundColor: 'rgba(72, 187, 120, 0.16)', // success/16
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'var(--border)',
  },
  // Size styles
  sm: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  md: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  // Text variant styles
  text: {
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
  },
  textDefault: {
    color: 'var(--accent)',
  },
  textSelected: {
    color: '#fff',
  },
  textDot: {
    color: 'var(--accent)',
  },
  textSuccess: {
    color: 'var(--success)',
  },
  textOutline: {
    color: 'var(--fg-2)',
  },
  // Text size styles
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12, // text-xs
  },
});

export default Chip;