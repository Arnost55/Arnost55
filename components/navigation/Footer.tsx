import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Linking } from 'react-native';
import { Icon } from '../ui/Icon';

const socialLinks = [
  { name: 'github', url: 'https://github.com/Arnost55', label: 'GitHub' },
  { name: 'linkedin', url: 'https://linkedin.com/in/arnost-dobrucky', label: 'LinkedIn' },
  { name: 'mail', url: 'mailto:arnstdobrucky48@gmail.com', label: 'Email' },
];

/**
 * Footer - Simple footer with copyright and social links
 */
export const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.socialRow}>
        {socialLinks.map((social) => (
          <Pressable
            key={social.name}
            style={styles.socialLink}
            onPress={() => Linking.openURL(social.url)}
            accessibilityLabel={social.label}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name={social.name} size={20} color="var(--fg-2)" />
          </Pressable>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.copyright}>
        © {new Date().getFullYear()} Arnošt Dobrucký. Built with React Native for Web.
      </Text>

      <Text style={styles.techStack}>
        Expo · NativeWind · Reanimated · expo-blur
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialLink: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'var(--border)',
  },
  divider: {
    width: '100%',
    maxWidth: 400,
    height: 1,
    backgroundColor: 'var(--border-soft)',
  },
  copyright: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--muted)',
    textAlign: 'center',
  },
  techStack: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--muted)',
    textAlign: 'center',
  },
});

export default Footer;