import React, { ReactNode } from 'react';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { arcSpring, motion } from '../../constants/design-tokens';
import { Easing } from 'react-native-reanimated';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  subtitle?: string;
  height?: number | '90%' | '50%' | 'auto';
  dragHandle?: boolean;
  showCloseButton?: boolean;
  snapPoints?: number[];
  className?: string;
  style?: any;
  testID?: string;
}

/**
 * Sheet - Bottom sheet (drawer) for mobile with drag handle and spring animation
 * Slides up from bottom, covers 90% of viewport by default on mobile
 */
export const Sheet = ({
  visible,
  onClose,
  children,
  title,
  subtitle,
  height = '90%',
  dragHandle = true,
  showCloseButton = false,
  snapPoints,
  className = '',
  style,
  testID,
}: SheetProps) => {
  const { isDark } = useTheme();
  const translateY = useSharedValue(visible ? 0 : '100%');
  const backdropOpacity = useSharedValue(0);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.5, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    translateY.value = withSpring(0, arcSpring);
  };

  const handleClose = () => {
    backdropOpacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    translateY.value = withSpring('100%', arcSpring);
    setTimeout(() => runOnJS(onClose)(), motion.base);
  };

  if (visible) {
    handleOpen();
  } else {
    handleClose();
  }

  if (!visible && backdropOpacity.value === 0) {
    return null;
  }

  const handleDrag = () => {
    // TODO: Implement drag gesture with react-native-gesture-handler
    // For now, close on backdrop press
  };

  return (
    <View style={styles.overlay} testID={`${testID}-overlay`}>
      <Pressable
        style={backdropStyle}
        onPress={onClose}
        testID={`${testID}-backdrop`}
        accessibilityHidden
      />
      <BlurView
        intensity={isDark ? 'dark' : 'regular'}
        style={[
          styles.sheet,
          sheetStyle,
          style,
        ]}
        className={className}
        testID={testID}
      >
        {(dragHandle || title || showCloseButton) && (
          <View style={styles.header}>
            {dragHandle && (
              <View style={styles.dragHandle} />
            )}
            {title && (
              <View style={styles.titleContainer} style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
            )}
            {showCloseButton && (
              <Pressable
                style={styles.closeButton}
                onPress={onClose}
                accessibilityLabel="Close sheet"
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
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'var(--border)',
    overflow: 'hidden',
    maxHeight: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-soft)',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'var(--muted)',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '600',
    color: 'var(--fg)',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--fg-2)',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: 'var(--fg-2)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxHeight: '70%',
  },
});

export default Sheet;