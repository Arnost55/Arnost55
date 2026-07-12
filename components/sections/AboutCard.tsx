import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { personalInfo } from '../../constants/data/personal';
import { education } from '../../constants/data/education';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';
import { arcSpring } from '../../constants/design-tokens';

const stats = [
  { label: 'Major Projects', value: '3+', icon: 'briefcase' },
  { label: 'Tech Domains', value: '5+', icon: 'code' },
  { label: 'Years Content', value: '2+', icon: 'film' },
  { label: 'Curiosity', value: '∞', icon: 'sparkles' },
];

const philosophy = [
  { title: 'Bias Toward Action', description: 'Ideas are cheap. Execution is everything. I build to learn.', icon: 'zap' },
  { title: 'Full-Stack Thinking', description: 'From silicon to UI — understand the whole stack, not just your layer.', icon: 'cpu' },
  { title: 'Teach to Learn', description: 'Explaining complex topics simply proves you understand them deeply.', icon: 'book' },
  { title: 'Hardware Meets Software', description: 'Best solutions emerge at the intersection of physical and digital.', icon: 'hammer' },
  { title: 'Open Source First', description: 'Build in public. Share knowledge. Contribute back to the community.', icon: 'github' },
  { title: 'Continuous Craft', description: 'Master the fundamentals. Then push boundaries. Repeat forever.', icon: 'award' },
];

/**
 * AboutCard - About section with stats and philosophy highlights
 */
export const AboutCard = () => {
  const { isDesktop, isTablet } = useBreakpoint();
  const statAnims = stats.map((_, i) => useSharedValue(0));
  const philAnims = philosophy.map((_, i) => useSharedValue(0));

  // Staggered entrance
  React.useEffect(() => {
    statAnims.forEach((anim, i) => {
      anim.value = withDelay(i * 100, withSpring(1, arcSpring));
    });
    philAnims.forEach((anim, i) => {
      anim.value = withDelay(400 + i * 80, withSpring(1, arcSpring));
    });
  }, []);

  return (
    <section id="about" style={styles.section}>
      <View style={styles.container}>
        {/* Section header */}
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.sectionTitle}>Who I Am</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryWrapper}>
          <Text style={styles.summary}>{personalInfo.summary}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              variant="default"
              padding="lg"
              style={[
                styles.statCard,
                statAnims[index].animatedStyle,
              ]}
            >
              <View style={styles.statIconWrapper}>
                <Icon name={stat.icon} size={24} color="var(--accent)" />
              </View>
              <Text style={[
                styles.statValue,
                statAnims[index].animatedStyle,
              ]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Philosophy */}
        <View style={styles.philosophy}>
          <View style={styles.philosophyHeader}>
            <Text style={styles.sectionTitle}>Philosophy</Text>
          </View>
          <View style={[
            styles.philosophyGrid,
            isDesktop ? { gridTemplateColumns: 'repeat(3, 1fr)' } :
            isTablet ? { gridTemplateColumns: 'repeat(2, 1fr)' } :
            { gridTemplateColumns: '1fr' },
          ]}>
            {philosophy.map((item, index) => (
              <Card
                key={item.title}
                variant="outlined"
                padding="lg"
                style={[
                  styles.philosophyCard,
                  philAnims[index].animatedStyle,
                ]}
              >
                <View style={styles.philosophyIconWrapper}>
                  <Icon name={item.icon} size={24} color="var(--accent)" />
                </View>
                <Text style={styles.philosophyTitle}>{item.title}</Text>
                <Text style={styles.philosophyDescription}>{item.description}</Text>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </section>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'var(--surface-warm)',
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
  summaryWrapper: {
    maxWidth: 800,
    alignSelf: 'center',
    marginBottom: 48,
  },
  summary: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    color: 'var(--fg-2)',
    lineHeight: 1.7,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 64,
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    maxWidth: 200,
    alignItems: 'center',
    textAlign: 'center',
  },
  statIconWrapper: {
    marginBottom: 12,
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: 48,
    fontWeight: '400',
    color: 'var(--fg)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
    marginTop: 4,
  },
  philosophy: {
    marginTop: 24,
  },
  philosophyHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  philosophyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  philosophyCard: {
    flex: 1,
    minWidth: 280,
  },
  philosophyIconWrapper: {
    marginBottom: 16,
  },
  philosophyTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '600',
    color: 'var(--fg)',
    marginBottom: 8,
  },
  philosophyDescription: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
    lineHeight: 1.6,
  },
});

export default AboutCard;