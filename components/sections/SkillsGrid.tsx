import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, useAnimatedReaction, withTiming } from 'react-native-reanimated';
import { skillCategories } from '../../constants/data/skills';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';
import { arcSpring } from '../../constants/design-tokens';

/**
 * SkillsGrid - Expandable skill categories with animated proficiency bars
 */
export const SkillsGrid = () => {
  const { isDesktop, isTablet } = useBreakpoint();

  // Animation shared values for proficiency bars
  const barAnimations = skillCategories.map(cat =>
    cat.skills.map(skill => useSharedValue(0))
  );

  const categoryAnimations = skillCategories.map(() => useSharedValue(false));

  // Trigger animations on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = skillCategories.findIndex(cat => cat.category === entry.target.getAttribute('data-category'));
            if (index >= 0) {
              categoryAnimations[index].value = withSpring(1, arcSpring);
              cat.skills.forEach((skill, i) => {
                setTimeout(() => {
                  barAnimations[index][i].value = withSpring(skill.proficiency / 5, { ...arcSpring, duration: 800 });
                }, i * 100);
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe elements
    const elements = document.querySelectorAll('[data-category]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" style={styles.section}>
      <View style={styles.container}>
        {/* Section header */}
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>Skills</Text>
          <Text style={styles.sectionTitle}>Tech Stack</Text>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          {skillCategories.map((category, catIndex) => (
            <Card
              key={category.category}
              variant="default"
              padding="md"
              hover={true}
              style={[
                styles.categoryCard,
                isDesktop && styles.categoryCardDesktop,
              ]}
            >
              {/* Category header */}
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconWrapper}>
                  <Icon name={category.icon} size={20} color="var(--accent)" />
                </View>
                <Text style={styles.categoryTitle}>{category.category}</Text>
              </View>

              {/* Skills list */}
              <View style={styles.skillsList}>
                {category.skills.map((skill, skillIndex) => (
                  <View
                    key={skill.name}
                    style={styles.skillRow}
                    data-category={category.category}
                  >
                    <View style={styles.skillInfo}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <View style={styles.proficiencyBarContainer}>
                        <View style={styles.proficiencyBarTrack}>
                          <View
                            style={[
                              styles.proficiencyBarFill,
                              {
                                width: `${barAnimations[catIndex][skillIndex].value * 100}%`,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                    <Text style={styles.skillLevel}>{skill.proficiency}/5</Text>
                  </View>
                ))}
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
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
  },
  categoryCardDesktop: {
    // Additional desktop styles
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  categoryIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '600',
    color: 'var(--fg)',
  },
  skillsList: {
    gap: 16,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  skillInfo: {
    flex: 1,
    gap: 6,
  },
  skillName: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: '500',
    color: 'var(--fg)',
  },
  proficiencyBarContainer: {
    height: 6,
  },
  proficiencyBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    overflow: 'hidden',
  },
  proficiencyBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: 'var(--accent)',
  },
  skillLevel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--fg-2)',
    minWidth: 32,
    textAlign: 'right',
  },
});

export default SkillsGrid;