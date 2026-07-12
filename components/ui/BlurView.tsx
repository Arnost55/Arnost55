import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView as ExpoBlurView } from 'expo-blur';

export interface BlurViewProps {
  children: ReactNode;
  intensity?: 'light' | 'medium' | 'heavy' | 'dark' | 'regular';
  style?: any;
  className?: string;
  testID?: string;
}

/**
 * BlurView - Wrapper around expo-blur with Arc Browser styling
 * Provides consistent frosted glass effect across platforms
 */
export const BlurView = ({
  children,
  intensity = 'regular',
  style,
  className = '',
  testID,
}: BlurViewProps) => {
  // Map intensity names to expo-blur values
  const intensityMap: Record<string, 'light' | 'dark' | 'regular'> = {
    light: 'light',
    medium: 'light',
    heavy: 'regular',
    dark: 'dark',
    regular: 'regular',
  };

  const mappedIntensity = intensityMap[intensity] || 'regular';

  return (
    <ExpoBlurView
      intensity={mappedIntensity}
      style={[
        styles.base,
        style,
      ]}
      className={className}
      testID={testID}
    >
      {children}
    </ExpoBlurView>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default BlurView;