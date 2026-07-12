import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { personalInfo } from '../../constants/data/personal';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

/**
 * ContactInfo - Contact information cards with social links
 */
export const ContactInfo = () => {
  const contactItems = [
    { label: 'Email', value: personalInfo.email, icon: 'mail', action: 'mailto:' + personalInfo.email },
    { label: 'Phone', value: personalInfo.phone, icon: 'phone', action: 'tel:' + personalInfo.phone },
    { label: 'Location', value: personalInfo.location, icon: 'mapPin', action: null },
  ];

  const socialLinks = [
    { platform: 'GitHub', url: personalInfo.github, icon: 'github' },
    { platform: 'LinkedIn', url: personalInfo.linkedin, icon: 'linkedin' },
  ];

  return (
    <section id="contact-info" style={styles.section}>
      <View style={styles.container}>
        {/* Section header */}
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>Contact</Text>
          <Text style={styles.sectionTitle}>Contact Info</Text>
        </View>

        {/* Contact items */}
        <View style={styles.cards}>
          {contactItems.map((item, index) => (
            <Card key={item.label} variant="default" padding="lg" style={styles.card}>
              <View style={styles.itemHeader}>
                <View style={styles.itemIconWrapper}>
                  <Icon name={item.icon} size={20} color="var(--accent)" />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
              </View>
              <Text style={styles.itemValue}>{item.value}</Text>
              {item.action && (
                <Pressable
                  style={styles.itemAction}
                  onPress={() => {}}
                  accessibilityLabel={`Open ${item.label}`}
                >
                  <Text style={styles.itemActionText}>Open</Text>
                  <Icon name="externalLink" size={14} color="var(--accent)" />
                </Pressable>
              )}
            </Card>
          ))}
        </View>

        {/* Social links */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Connect</Text>
          <View style={styles.socialRow}>
            {socialLinks.map((social) => (
              <Pressable
                key={social.platform}
                style={styles.socialButton}
                onPress={() => {}}
                accessibilityLabel={social.platform}
              >
                <Icon name={social.icon} size={20} color="var(--fg)" />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </section>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'var(--bg)',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 48,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--accent)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 40,
    fontWeight: '400',
    color: 'var(--fg)',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 48,
  },
  card: {
    flex: 1,
    minWidth: 220,
    maxWidth: 300,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  itemIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: '500',
    color: 'var(--fg-2)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  itemValue: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    color: 'var(--fg)',
    lineHeight: 1.5,
    marginBottom: 12,
  },
  itemAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
  },
  itemActionText: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: '500',
    color: 'var(--accent)',
  },
  socialSection: {
    alignItems: 'center',
    gap: 16,
  },
  socialTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '600',
    color: 'var(--fg)',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
});

export default ContactInfo;