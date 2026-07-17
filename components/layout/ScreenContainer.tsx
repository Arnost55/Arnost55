import React, { ReactNode, forwardRef } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks';

interface ScreenContainerProps {
  children: ReactNode;
  style?: any;
  showGradient?: boolean;
  gradientVariant?: 'sunset' | 'twilight' | 'aurora';
  scrollable?: boolean;
  contentContainerStyle?: any;
}

/**
 * ScreenContainer - Root layout wrapper with safe area, gradient backdrop, and optional scroll
 */
export const ScreenContainer = ({
  children,
  style,
  showGradient = true,
  gradientVariant = 'sunset',
  scrollable = true,
  contentContainerStyle,
}: ScreenContainerProps) => {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const horizontalPadding = isDesktop ? 32 : isTablet ? 24 : 16;

  const containerStyle = [styles.container, isDark ? styles.dark : styles.light, style];

  const contentStyle = [
    styles.content,
    { paddingHorizontal: horizontalPadding },
    contentContainerStyle,
  ];

  return (
    <SafeAreaView style={containerStyle}>
      {showGradient && <GradientBackdrop variant={gradientVariant} />}
      {scrollable ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
};

interface GradientBackdropProps {
  variant?: 'sunset' | 'twilight' | 'aurora';
  animated?: boolean;
  style?: any;
}

export const GradientBackdrop = ({
  variant = 'sunset',
  animated = true,
  style,
}: GradientBackdropProps) => {
  const gradientColors = {
    sunset: '#ff7e5f, #feb47b',
    twilight: '#7f5af0, #e84393',
    aurora: '#16f2b3, #0db4f7',
  };

  return (
    <View
      style={[
        styles.gradientBackdrop,
        {
          backgroundImage: `linear-gradient(135deg, ${gradientColors[variant]})`,
        },
        style,
      ]}
      pointerEvents="none"
    />
  );
};

interface FrostedCardProps {
  children: ReactNode;
  style?: any;
  intensity?: 'light' | 'medium' | 'heavy' | 'dark';
  hover?: boolean;
  pressable?: boolean;
  onPress?: () => void;
  border?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'pill';
}

export const FrostedCard = ({
  children,
  style,
  intensity = 'light',
  hover = false,
  pressable = false,
  onPress,
  border = true,
  padding = 'md',
  radius = 'lg',
}: FrostedCardProps) => {
  const { isDark } = useTheme();

  const intensityMap = {
    light: isDark ? 'glassDark' : 'glassLight',
    medium: isDark ? 'glassMedium' : 'glassMedium',
    heavy: isDark ? 'glassHeavy' : 'glassHeavy',
    dark: isDark ? 'glassDark' : 'glassDark',
  };

  const paddingMap = {
    none: 0,
    sm: 12,
    md: 16,
    lg: 24,
  };

  const radiusMap = {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 9999,
  };

  const glassStyle = [
    styles.frostedCard,
    {
      backgroundColor: `var(--${intensityMap[intensity]})`,
      borderRadius: radiusMap[radius],
      padding: paddingMap[padding],
      borderWidth: border ? 1 : 0,
      borderColor: isDark ? 'var(--border)' : 'var(--border)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 32,
      elevation: 4,
    },
    hover && styles.hover,
    style,
  ];

  if (pressable && onPress) {
    return (
      <PressableFrostedCard style={glassStyle} onPress={onPress} intensity={intensity}>
        {children}
      </PressableFrostedCard>
    );
  }

  return <View style={glassStyle}>{children}</View>;
};

const PressableFrostedCard = forwardRef<
  View,
  { children: ReactNode; style: any; onPress: () => void; intensity: string }
>(({ children, style, onPress, intensity }, ref) => {
  const { isDark } = useTheme();

  return (
    <View ref={ref} style={style}>
      {children}
    </View>
  );
});

interface SectionProps {
  children: ReactNode;
  style?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  id?: string;
}

export const Section = ({ children, style, size = 'lg', fullWidth = false, id }: SectionProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const spacingMap = {
    sm: { phone: 32, tablet: 40, desktop: 48 },
    md: { phone: 48, tablet: 64, desktop: 80 },
    lg: { phone: 48, tablet: 64, desktop: 96 },
    xl: { phone: 64, tablet: 80, desktop: 128 },
  };

  const verticalPadding = isDesktop
    ? spacingMap[size].desktop
    : isTablet
      ? spacingMap[size].tablet
      : spacingMap[size].phone;

  const horizontalPadding = isDesktop ? 32 : isTablet ? 24 : 16;

  return (
    <View
      id={id}
      style={[
        styles.section,
        {
          paddingVertical: verticalPadding,
          paddingHorizontal: horizontalPadding,
          width: fullWidth ? '100%' : undefined,
          maxWidth: fullWidth ? '100%' : 1200,
          marginHorizontal: fullWidth ? 0 : 'auto',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'var(--bg)',
  },
  light: {
    backgroundColor: '#fdf3ec',
  },
  dark: {
    backgroundColor: '#1a1a1f',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingTop: 24,
    paddingBottom: 48,
  },
  gradientBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  frostedCard: {
    // Base frosted glass styles applied via style prop
  },
  hover: {
    // Hover styles would be handled via Reanimated or CSS
  },
  section: {
    width: '100%',
    boxSizing: 'border-box',
  },
});

export { styles as GradientBackdropStyles };
