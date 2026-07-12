import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView, Linking } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useTheme, useReducedMotion } from '../../hooks';
import { ScreenContainer, Section } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Icon } from '../../components/ui/Icon';
import { arcSpring } from '../../constants/design-tokens';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

/**
 * Settings Screen - Theme, reduced motion, about
 */
export default function SettingsScreen() {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();
  const { reduceMotion, toggleReducedMotion } = useReducedMotion();
  const { width } = useWindowDimensions();

  const anim = useSharedValue(0);

  React.useEffect(() => {
    anim.value = withSpring(1, arcSpring);
  }, []);

  const version = Application.nativeApplicationVersion || '1.0.0';
  const buildNumber = Application.nativeBuildVersion || '1';

  return (
    <ScreenContainer scrollable={true} showGradient={true}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, anim.animatedStyle]}>
          <Icon name="settings" size={28} color="var(--accent)" />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>

        {/* Theme Section */}
        <Section size="md" style={[styles.section, anim.animatedStyle]}>
          <View style={styles.sectionHeader}>
            <Icon name="sun" size={20} color="var(--accent)" />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>

          <Card variant="default" padding="md" style={styles.settingsCard}>
            {/* Theme selector */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingDescription}>
                  Choose your preferred color scheme
                </Text>
              </View>
              <View style={styles.themeSelector}>
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <Pressable
                    key={t}
                    style={[
                      styles.themeOption,
                      theme === t && styles.themeOptionActive,
                    ]}
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

            {/* Reduced motion */}
            <View style={[styles.settingRow, styles.settingRowDivider]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Reduced Motion</Text>
                <Text style={styles.settingDescription}>
                  Minimize animations for accessibility
                </Text>
              </View>
              <Switch
                value={reduceMotion}
                onValueChange={toggleReducedMotion}
                trackColor={{ false: 'var(--border)', true: 'var(--accent)' }}
                thumbColor={isDark ? '#fff' : '#fff'}
              />
            </View>
          </Card>
        </Section>

        {/* About Section */}
        <Section size="md" style={[styles.section, anim.animatedStyle]}>
          <View style={styles.sectionHeader}>
            <Icon name="info" size={20} color="var(--accent)" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <Card variant="default" padding="md" style={styles.settingsCard}>
            <View style={styles.aboutItem}>
              <View style={styles.aboutIconWrapper}>
                <Icon name="book" size={20} color="var(--accent)" />
              </View>
              <View style={styles.aboutInfo}>
                <Text style={styles.aboutLabel}>Portfolio</Text>
                <Text style={styles.aboutVersion}>v{version} (build {buildNumber})</Text>
              </View>
            </View>

            <View style={[styles.aboutItem, styles.aboutItemDivider]}>
              <View style={styles.aboutIconWrapper}>
                <Icon name="github" size={20} color="var(--accent)" />
              </View>
              <Pressable onPress={() => Linking.openURL('https://github.com/Arnost55')}>
                <View style={styles.aboutInfo}>
                  <Text style={styles.aboutLabel}>Source Code</Text>
                  <Text style={styles.aboutVersion}>github.com/Arnost55</Text>
                </View>
              </Pressable>
              <Icon name="chevronRight" size={18} color="var(--muted)" />
            </View>

            <View style={[styles.aboutItem, styles.aboutItemDivider]}>
              <View style={styles.aboutIconWrapper}>
                <Icon name="globe" size={20} color="var(--accent)" />
              </View>
              <Pressable onPress={() => Linking.openURL('https://arc.net')}>
                <View style={styles.aboutInfo}>
                  <Text style={styles.aboutLabel}>Design System</Text>
                  <Text style={styles.aboutVersion}>Arc Browser inspired</Text>
                </View>
              </Pressable>
              <Icon name="chevronRight" size={18} color="var(--muted)" />
            </View>

            <View style={[styles.aboutItem, styles.aboutItemDivider]}>
              <View style={styles.aboutIconWrapper}>
                <Icon name="heart" size={20} color="var(--accent)" />
              </View>
              <Pressable onPress={() => Linking.openURL('https://hackclub.com')}>
                <View style={styles.aboutInfo}>
                  <Text style={styles.aboutLabel}>Built With Hack Club</Text>
                  <Text style={styles.aboutVersion}>Blueprint & Stardance programs</Text>
                </View>
              </Pressable>
              <Icon name="chevronRight" size={18} color="var(--muted)" />
            </View>

            <View style={styles.aboutItem}>
              <View style={styles.aboutIconWrapper}>
                <Icon name="shield" size={20} color="var(--accent)" />
              </View>
              <View style={styles.aboutInfo}>
                <Text style={styles.aboutLabel}>Privacy</Text>
                <Text style={styles.aboutVersion}>No tracking, no analytics, fully local</Text>
              </View>
            </View>
          </Card>
        </Section>

        {/* Quick Actions */}
        <Section size="md" style={[styles.section, anim.animatedStyle]}>
          <View style={styles.sectionHeader}>
            <Icon name="zap" size={20} color="var(--accent)" />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <Card variant="default" padding="md" style={styles.settingsCard}>
            <View style={styles.actionGrid}>
              <Pressable
                style={styles.actionCard}
                onPress={() => {}}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={styles.actionIconWrapper}>
                  <Icon name="palette" size={22} color="var(--accent)" />
                </View>
                <Text style={styles.actionLabel}>Toggle Theme</Text>
              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={() => Linking.openURL('mailto:arnstdobrucky48@gmail.com')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={styles.actionIconWrapper}>
                  <Icon name="mail" size={22} color="var(--accent)" />
                </View>
                <Text style={styles.actionLabel}>Contact Me</Text>
              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={() => Linking.openURL('https://github.com/Arnost55')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={styles.actionIconWrapper}>
                  <Icon name="github" size={22} color="var(--accent)" />
                </View>
                <Text style={styles.actionLabel}>View GitHub</Text>
              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={() => Linking.openURL('https://youtube.com/@arni_pictures_tech')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={styles.actionIconWrapper}>
                  <Icon name="youtube" size={22} color="var(--accent)" />
                </View>
                <Text style={styles.actionLabel}>YouTube Channel</Text>
              </Pressable>
            </View>
          </Card>
        </Section>

        {/* Device Info */}
        <Section size="md" style={[styles.section, anim.animatedStyle]}>
          <View style={styles.sectionHeader}>
            <Icon name="smartphone" size={20} color="var(--accent)" />
            <Text style={styles.sectionTitle}>Device Info</Text>
          </View>

          <Card variant="outlined" padding="md" style={styles.settingsCard}>
            <View style={styles.deviceGrid}>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceLabel}>Platform</Text>
                <Text style={styles.deviceValue}>{Device.osName || 'Web'}</Text>
              </View>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceLabel}>Version</Text>
                <Text style={styles.deviceValue}>{Device.osVersion || 'N/A'}</Text>
              </View>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceLabel}>Model</Text>
                <Text style={styles.deviceValue}>{Device.modelName || 'Browser'}</Text>
              </View>
              <View style={styles.deviceItem}>
                <Text style={styles.deviceLabel}>Width</Text>
                <Text style={styles.deviceValue}>{Math.round(width)}px</Text>
              </View>
            </View>
          </Card>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by Arnošt Dobrucký
          </Text>
          <Text style={styles.footerText}>
            React Native for Web · Expo · NativeWind · Reanimated
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 32,
    fontWeight: '400',
    color: 'var(--fg)',
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--fg-2)',
  },
  section: {
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 20,
    fontWeight: '600',
    color: 'var(--fg)',
  },
  settingsCard: {
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-soft)',
    marginBottom: 4,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    fontWeight: '500',
    color: 'var(--fg)',
  },
  settingDescription: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--fg-2)',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'var(--border)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionActive: {
    backgroundImage: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    borderColor: 'transparent',
    shadowColor: '#ff7e5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  aboutItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-soft)',
  },
  aboutIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aboutInfo: {
    flex: 1,
    gap: 2,
  },
  aboutLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: '500',
    color: 'var(--fg)',
  },
  aboutVersion: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    color: 'var(--fg-2)',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: 140,
    maxWidth: 160,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--border)',
    gap: 8,
  },
  actionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: '500',
    color: 'var(--fg)',
    textAlign: 'center',
  },
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  deviceItem: {
    flex: 1,
    minWidth: 120,
    gap: 4,
  },
  deviceLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  deviceValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    color: 'var(--fg)',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--muted)',
    textAlign: 'center',
  },
});