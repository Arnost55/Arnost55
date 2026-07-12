import React, { forwardRef, TextInputProps } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { arcSpring, motion } from '../../constants/design-tokens';
import { Easing } from 'react-native-reanimated';

export interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  style?: any;
  testID?: string;
  rows?: number;
}

/**
 * Textarea - Multi-line text input with frosted glass styling
 */
export const Textarea = forwardRef<TextInput, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      style,
      testID,
      rows = 4,
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

    const containerStyle = [
      styles.container,
      error && styles.containerError,
      focusRingStyle,
      style,
    ];

    return (
      <View style={[styles.wrapper, className]} testID={testID}>
        {label && (
          <Text style={styles.label}>{label}</Text>
        )}
        <View style={containerStyle}>
          <TextInput
            ref={ref}
            style={[
              styles.textarea,
              animatedStyle,
              { minHeight: rows * 24 },
              error && styles.textareaError,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="var(--muted)"
            selectionColor="var(--accent)"
            multiline
            textAlignVertical="top"
            {...props}
          />
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

Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: '500',
    color: 'var(--fg)',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'var(--border)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
  },
  containerError: {
    borderColor: 'var(--danger)',
  },
  textarea: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--fg)',
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  textareaError: {
    // Error state handled by container
  },
  errorText: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'var(--danger)',
    fontWeight: '500',
    marginTop: 4,
  },
  helperText: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'var(--muted)',
    marginTop: 4,
  },
});

export default Textarea;