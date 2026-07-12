import React, { forwardRef, TextInputProps } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { arcSpring, motion } from '../../constants/design-tokens';
import { Easing } from 'react-native-reanimated';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  style?: any;
  testID?: string;
}

/**
 * Input - Form input with frosted glass styling and focus ring
 */
export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      style,
      testID,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { isDark } = useTheme();
    const isFocused = useSharedValue(false);
    const borderColor = useSharedValue('var(--border)');
    const backgroundColor = useSharedValue(isDark ? 'rgba(30, 30, 36, 0.7)' : 'rgba(255, 255, 255, 0.85)');
    const focusRingOpacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      borderColor: borderColor.value,
      backgroundColor: backgroundColor.value,
    }));

    const focusRingStyle = useAnimatedStyle(() => ({
      shadowColor: 'var(--accent)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: focusRingOpacity.value,
      shadowRadius: 8,
      elevation: focusRingOpacity.value * 4,
    }));

    const handleFocus = (e: any) => {
      isFocused.value = true;
      borderColor.value = withSpring('var(--accent)', arcSpring);
      backgroundColor.value = withSpring(isDark ? 'rgba(30, 30, 36, 0.85)' : 'rgba(255, 255, 255, 0.95)', arcSpring);
      focusRingOpacity.value = withTiming(0.2, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      isFocused.value = false;
      borderColor.value = withSpring(error ? 'var(--danger)' : 'var(--border)', arcSpring);
      backgroundColor.value = withSpring(isDark ? 'rgba(30, 30, 36, 0.7)' : 'rgba(255, 255, 255, 0.85)', arcSpring);
      focusRingOpacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
      onBlur?.(e);
    };

    const inputContainerStyle = [
      styles.inputContainer,
      error && styles.inputContainerError,
      focusRingStyle,
      style,
    ];

    return (
      <View style={[styles.container, className]} testID={testID}>
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
        <View style={inputContainerStyle}>
          {leftIcon && (
            <View style={styles.iconLeft}>
              {leftIcon}
            </View>
          )}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              animatedStyle,
              error && styles.inputError,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="var(--muted)"
            selectionColor="var(--accent)"
            {...props}
          />
          {rightIcon && (
            <View style={styles.iconRight}>
              {rightIcon}
            </View>
          )}
        </View>
        {error && (
          <Text style={styles.errorText} testID={`${testID}-error`}>
            {error}
          </Text>
        )}
        {!error && helperText && (
          <Text style={styles.helperText} testID={`${testID}-helper`}>
            {helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: 13, // text-sm
    fontWeight: '500',
    color: 'var(--fg)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'var(--border)',
    borderRadius: 12, // radius.md
    paddingHorizontal: 14,
    paddingVertical: 14,
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
  },
  inputContainerError: {
    borderColor: 'var(--danger)',
  },
  input: {
    flex: 1,
    fontFamily: 'var(--font-body)',
    fontSize: 15, // text-base
    color: 'var(--fg)',
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  inputError: {
    // Error state handled by container
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 12, // text-xs
    color: 'var(--danger)',
    fontWeight: '500',
  },
  helperText: {
    fontFamily: 'var(--font-body)',
    fontSize: 12, // text-xs
    color: 'var(--muted)',
  },
});

export default Input;