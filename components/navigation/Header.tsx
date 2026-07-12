import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../ui/Icon';
import { useRouter } from 'expo-router';
import { Button } from '../ui/Button';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { arcSpring } from '../../constants/design-tokens';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Content', href: '#content' },
  { label: 'Education', href: '#education' },
  { label: 'Languages', href: '#languages' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Header - Responsive navigation header
 * Mobile: Logo + theme toggle + menu button
 * Desktop: Logo + nav links + theme toggle
 */
export const Header = () => {
  const { isDark, toggleTheme, theme } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const menuOpen = useSharedValue(false);
  const menuAnim = useSharedValue(0);

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuAnim.value,
    transform: [{ translateY: withSpring(-10 * (1 - menuAnim.value), arcSpring) }],
  }));

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
    menuAnim.value = withSpring(menuOpen.value ? 1 : 0, arcSpring);
  };

  const handleNavPress = (href: string) => {
    // Scroll to section on same page
    const element = document.getElementById(href.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    menuOpen.value = false;
    menuAnim.value = withSpring(0, arcSpring);
  };

  const handleSettingsPress = () => {
    router.push('/settings');
    menuOpen.value = false;
    menuAnim.value = withSpring(0, arcSpring);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        {/* Logo */}
        <Pressable
          style={styles.logo}
          onPress={() => handleNavPress('#hero')}
          accessibilityLabel="Home"
        >
          <Text style={styles.logoText}>AD</Text>
        </Pressable>

        {/* Desktop Navigation */}
        {isDesktop && (
          <View style={styles.desktopNav}>
            {navItems.map((item) => (
              <Pressable
                key={item.label}
                style={styles.navLink}
                onPress={() => handleNavPress(item.href)}
                accessibilityLabel={item.label}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text style={styles.navLinkText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {/* Theme Toggle */}
          <Pressable
            style={styles.themeButton}
            onPress={toggleTheme}
            accessibilityLabel={`Switch to ${theme === 'system' ? (isDark ? 'light' : 'dark') : theme} mode`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name={theme === 'system' ? (isDark ? 'monitor' : 'monitor') : isDark ? 'moon' : 'sun'}
              size={20}
              color="var(--fg)"
            />
          </Pressable>

          {/* Settings */}
          <Pressable
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            accessibilityLabel="Settings"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="settings" size={20} color="var(--fg)" />
          </Pressable>

          {/* Mobile Menu Button */}
          {!isDesktop && (
            <Pressable
              style={styles.menuButton}
              onPress={toggleMenu}
              accessibilityLabel={menuOpen.value ? 'Close menu' : 'Open menu'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name={menuOpen.value ? 'x' : 'menu'} size={24} color="var(--fg)" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Mobile Menu */}
      {!isDesktop && (
        <View
          style={[
            styles.mobileMenu,
            menuStyle,
          ]}
          pointerEvents={menuOpen.value ? 'box-only' : 'none'}
        >
          {navItems.map((item) => (
            <Pressable
              key={item.label}
              style={styles.mobileNavLink}
              onPress={() => handleNavPress(item.href)}
              accessibilityLabel={item.label}
            >
              <Text style={styles.mobileNavLinkText}>{item.label}</Text>
            </Pressable>
          ))}
          <Pressable
            style={[styles.mobileNavLink, styles.mobileSettingsLink]}
            onPress={handleSettingsPress}
          >
            <View style={styles.mobileSettingsContent}>
              <Icon name="settings" size={20} color="var(--fg)" />
              <Text style={styles.mobileNavLinkText}>Settings</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundImage: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  desktopNav: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navLinkText: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: '500',
    color: 'var(--fg-2)',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'var(--border)',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'var(--border)',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'var(--border)',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'var(--border)',
    paddingVertical: 8,
    gap: 4,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 8,
  },
  mobileNavLink: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  mobileNavLinkText: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    fontWeight: '500',
    color: 'var(--fg)',
  },
  mobileSettingsLink: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
    paddingTop: 14,
  },
  mobileSettingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default Header;