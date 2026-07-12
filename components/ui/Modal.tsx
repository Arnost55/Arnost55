import React, { ReactNode } from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { arcSpring, motion } from '../../constants/design-tokens';
import { Easing } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  style?: any;
  testID?: string;
}

/**
 * Modal - Centered modal dialog with frosted glass and spring animation
 */
export const Modal = ({
  visible,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  style,
  testID,
}: ModalProps) => {
  const { isDark } = useTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleOpen = () => {
    opacity.value = withTiming(1, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    scale.value = withSpring(1, arcSpring);
  };

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    scale.value = withSpring(0.95, arcSpring);
    // Call onClose after animation
    setTimeout(() => runOnJS(onClose)(), motion.fast);
  };

  // Handle visibility changes
  if (visible) {
    handleOpen();
  } else {
    handleClose();
  }

  const sizeStyles = {
    sm: { width: '85%', maxWidth: 320 },
    md: { width: '90%', maxWidth: 480 },
    lg: { width: '95%', maxWidth: 640 },
    xl: { width: '95%', maxWidth: 800 },
    full: { width: '100%', maxWidth: '100%', height: '100%', maxHeight: '100%' },
  };

  if (!visible && opacity.value === 0) {
    return null;
  }

  return (
    <View style={styles.overlay} testID={`${testID}-overlay`}>
      <Pressable
        style={backdropStyle}
        onPress={closeOnOverlayClick ? onClose : undefined}
        testID={`${testID}-backdrop`}
        accessibilityHidden={!closeOnOverlayClick}
      />
      <BlurView
        intensity={isDark ? 'dark' : 'light'}
        style={[
          styles.modal,
          sizeStyles[size],
          modalStyle,
          style,
        ]}
        className={className}
        testID={testID}
      >
        {(title || showCloseButton) && (
          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            {showCloseButton && (
              <Pressable
                style={styles.closeButton}
                onPress={onClose}
                accessibilityLabel="Close modal"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            )}
          </View>
        )}
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 400,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'var(--border)',
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-soft)',
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: 20,
    fontWeight: '600',
    color: 'var(--fg)',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: 'var(--fg-2)',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxHeight: '70%',
  },
});

export default Modal;