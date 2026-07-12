import React from 'react';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReanimatedRoot } from 'react-native-reanimated';
import { ThemeProvider } from '../hooks/useTheme';
import { GradientBackdrop } from '../components/layout/ScreenContainer';
import { Header } from '../components/navigation/Header';
import { Sidebar } from '../components/navigation/Sidebar';
import { useBreakpoint } from '../hooks/useBreakpoint';

/**
 * Root layout with providers and global gradient backdrop
 */
export default function RootLayout() {
  const { isDesktop } = useBreakpoint();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReanimatedRoot>
        <ThemeProvider>
          <GradientBackdrop variant="sunset" animated />
          <Header />
          {isDesktop && <Sidebar />}
          <Slot />
        </ThemeProvider>
      </ReanimatedRoot>
    </GestureHandlerRootView>
  );
}