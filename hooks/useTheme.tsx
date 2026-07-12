import { useColorScheme } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { createContext, useContext, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'portfolio-theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored) return stored;
    }
    return 'system';
  });

  const resolvedTheme = theme === 'system' ? (systemTheme || 'light') : theme;
  const isDark = resolvedTheme === 'dark';

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    // Apply to document for CSS variables
    if (typeof document !== 'undefined') {
      const resolved = newTheme === 'system' ? (systemTheme || 'light') : newTheme;
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    }
  }, [systemTheme]);

  const toggleTheme = useCallback(() => {
    const themes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [theme, setTheme]);

  // Sync with system changes
  useEffect(() => {
    if (theme === 'system') {
      const resolved = systemTheme || 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', resolved === 'dark');
      }
    }
  }, [systemTheme, theme]);

  // Initial sync on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for accessing system color scheme directly
export const useSystemColorScheme = () => {
  return useColorScheme();
};