import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { education } from '../../constants/data/education';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { arcSpring } from '../../constants/design-tokens';

/**
 * Timeline - Education timeline with vertical layout on mobile, horizontal on desktop
 */
export const Timeline = () => {
  const timelineAnims = education.map((_, i) => useSharedValue(0));

  React.useEffect(() => {
    timelineAnims.forEach((anim, i) => {
      anim.value = withDelay(i * 150, withSpring(1, arcSpring));
    });
  }, []);

  return (
    <section id="education" style={styles.section}>
      <View style={styles.container}>
        {/* Section header */}
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>Education</Text>
          <Text style={styles.sectionTitle}>Background</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {education.map((item, index) => (
            <Card
              key={item.id}
              variant="outlined"
              padding="lg"
              style={[
                styles.timelineItem,
                timelineAnims[index].animatedStyle,
              ]}
            >
              {/* Timeline dot and line */}
              <View style={styles.timelineDotWrapper}>
                <View style={styles.timelineDot} />
                {index < education.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              {/* Content */}
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.institution}>{item.institution}</Text>
                  <Text style={styles.period}>
                    {item.startDate} — {item.endDate}
                  </Text>
                </View>
                <Text style={styles.degree}>{item.degree}</Text>
                <Text style={styles.field}>{item.field}</Text>
                <Text style={styles.location}>
                  <Icon name="mapPin" size={14} color="var(--muted)" />
                  {item.location}
                </Text>
                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
                {item.highlights && item.highlights.length > 0 && (
                  <View style={styles.highlights}>
                    {item.highlights.map((highlight, i) => (
                      <Text key={i} style={styles.highlight}>
                        <Icon name="check" size={14} color="var(--success)" style={styles.highlightIcon} />
                        {highlight}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </Card>
          ))}
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
  timeline: {
    flexDirection: 'column',
    gap: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    position: 'relative',
    minWidth: 0,
  },
  timelineDotWrapper: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'var(--accent)',
    borderWidth: 3,
    borderColor: 'var(--bg)',
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 24,
    left: 7,
    bottom: -24,
    width: 2,
    backgroundColor: 'var(--border)',
  },
  timelineContent: {
    flex: 1,
    gap: 8,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  institution: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '600',
    color: 'var(--fg)',
    flex: 1,
  },
  period: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--muted)',
    whiteSpace: 'nowrap',
    marginLeft: 16,
  },
  degree: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: '500',
    color: 'var(--accent)',
  },
  field: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
  },
  location: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--muted)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
    lineHeight: 1.6,
    marginTop: 8,
  },
  highlights: {
    gap: 6,
    marginTop: 12,
  },
  highlight: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--fg)',
    lineHeight: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightIcon: {
    marginTop: 1,
  },
});

export default Timeline;