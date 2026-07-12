import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { languages } from '../../constants/data/languages';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';
import { arcSpring } from '../../constants/design-tokens';

const proficiencyColors = {
  native: 'var(--success)',
  professional: 'var(--accent)',
  limited: 'var(--warn)',
  elementary: 'var(--muted)',
};

const proficiencyLabels = {
  native: 'Native / Bilingual',
  professional: 'Full Professional Proficiency',
  limited: 'Limited Working Proficiency',
  elementary: 'Elementary Proficiency',
};

/**
 * LanguageList - Language proficiency display
 */
export const LanguageList = () => {
  const langAnims = languages.map((_, i) => useSharedValue(0));

  React.useEffect(() => {
    langAnims.forEach((anim, i) => {
      anim.value = withDelay(i * 80, withSpring(1, arcSpring));
    });
  }, []);

  return (
    <section id="languages" style={styles.section}>
      <View style={styles.container}>
        {/* Section header */}
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>Languages</Text>
          <Text style={styles.sectionTitle}>Language Proficiency</Text>
        </View>

        {/* Language cards */}
        <View style={styles.grid}>
          {languages.map((lang, index) => (
            <Card
              key={lang.language}
              variant="outlined"
              padding="md"
              style={[
                styles.card,
                langAnims[index].animatedStyle,
              ]}
            >
              <View style={styles.langHeader}>
                <Text style={styles.langName}>{lang.language}</Text>
                <Chip
                  variant="outline"
                  size="sm"
                  style={[
                    styles.proficiencyChip,
                    { borderColor: proficiencyColors[lang.level as keyof typeof proficiencyColors] },
                  ]}
                >
                  {proficiencyLabels[lang.level]}
                </Chip>
              </View>
              <Text style={styles.langDetail}>{lang.proficiency}</Text>
            </Card>
          ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    minWidth: 200,
    maxWidth: 280,
    alignItems: 'flex-start',
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  langName: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '600',
    color: 'var(--fg)',
  },
  proficiencyChip: {
    // Handled by Chip component
  },
  langDetail: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
    lineHeight: 1.5,
  },
});

export default LanguageList;