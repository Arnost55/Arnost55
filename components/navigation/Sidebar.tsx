import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../ui/Icon';
import { useRouter } from 'expo-router';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { arcSpring } from '../../constants/design-tokens';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const navItems = [
  { label: 'Home', href: '#hero', icon: 'home' },
  { label: 'About', href: '#about', icon: 'user' },
  { label: 'Skills', href: '#skills', icon: 'code' },
  { label: 'Projects', href: '#projects', icon: 'briefcase' },
  { label: 'Content', href: '#content', icon: 'film' },
  { label: 'Education', href: '#education', icon: 'graduationCap' },
  { label: 'Languages', href: '#languages', icon: 'book' },
  { label: 'Contact', href: '#contact', icon: 'mail' },
];

/**
 * Sidebar - Desktop-only fixed navigation sidebar
 */
export const Sidebar = () => {
  const { isDark, toggleTheme, theme, setTheme } = useTheme();
  const router = useRouter();
  const { isDesktop } = useBreakpoint();

  if (!isDesktop) return null;

  const anim = useSharedValue(0);

  React.useEffect(() => {
    anim.value = withSpring(1, arcSpring);
  }, []);

  const handleNavPress = (href: string) => {
    const element = document.getElementById(href.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const sidebarStyle = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [{ translateX: withSpring(-30 * (1 - anim.value), arcSpring) }],
  }));

  return (
    <View style={[styles.sidebar, sidebarStyle]}>
      {/* Logo */}
      <View style={styles.logo}>
        <Text style={styles.logoText}>AD</Text>
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        {navItems.map((item) => (
          <Pressable
            key={item.label}
            style={styles.navLink}
            onPress={() => handleNavPress(item.href)}
            accessibilityLabel={item.label}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Icon name={item.icon} size={20} color="var(--fg-2)" style={styles.navIcon} />
            <Text style={styles.navLinkText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Theme Toggle */}
      <View style={styles.themeSection}>
        <Text style={styles.themeLabel}>Theme</Text>
        <View style={styles.themeSelector}>
          {(['light', 'dark', 'system'] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.themeOption, theme === t && styles.themeOptionActive]}
              onPress={() => setTheme(t)}
              accessibilityRole="radio"
              accessibilityState={{ checked: theme === t }}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            >
              <Icon
                name={t === 'light' ? 'sun' : t === 'dark' ? 'moon' : 'monitor'}
                size={18}
                color={theme === t ? '#fff' : 'var(--fg)'}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Settings Link */}
      <Pressable
        style={styles.settingsLink}
        onPress={handleSettingsPress}
        hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
      >
        <Icon name="settings" size={20} color="var(--fg-2)" style={styles.settingsIcon} />
        <Text style={styles.settingsText}>Settings</Text>
      </Pressable>

      {/* Footer */}
      <View style={styles.sidebarFooter}>
        <Text style={styles.footerText}>Made with ❤️ by Arnošt</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 240,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRightWidth: 1,
    borderRightColor: 'var(--border)',
    paddingVertical: 32,
    paddingHorizontal: 16,
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 95, 95, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
    letterSpacing: -0.4,
  },
  nav: {
    flex: 1,
    gap: 4,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  navIcon: {
    width: 24,
  },
  navLinkText: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: '500',
    color: 'var(--fg-2)',
  },
  divider: {
    height: 1,
    backgroundColor: 'var(--border-soft)',
    marginVertical: 16,
  },
  themeSection: {
    gap: 12,
  },
  themeLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  themeOption: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'var(--border)',
  },
  themeOptionActive: {
    backgroundColor: 'rgba(255, 95, 95, 0.2)',
    borderColor: 'transparent',
  },
  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  settingsIcon: {
    width: 24,
  },
  settingsText: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: '500',
    color: 'var(--fg-2)',
  },
  sidebarFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'var(--muted)',
  },
});

export default Sidebar;
