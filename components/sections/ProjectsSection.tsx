import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, useAnimatedScrollHandler } from 'react-native-reanimated';
import { projects } from '../../constants/data/projects';
import { ProjectCard } from './ProjectCard';
import { Chip } from '../ui/Chip';
import { arcSpring } from '../../constants/design-tokens';

const categories = ['all', 'software', 'hardware', 'content'];

/**
 * ProjectsSection - Filterable project grid with featured and standard cards
 */
export const ProjectsSection = () => {
  const { isDesktop, isTablet } = useBreakpoint();
  const activeCategory = useSharedValue('all');
  const categoryAnims = categories.map(() => useSharedValue(false));

  const filteredProjects = activeCategory.value === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory.value);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const moreProjects = filteredProjects.filter(p => !p.featured);

  const handleCategoryChange = (category: string) => {
    activeCategory.value = category;
    categories.forEach((cat, i) => {
      categoryAnims[i].value = withSpring(cat === category, arcSpring);
    });
  };

  return (
    <section id="projects" style={styles.section}>
      <View style={styles.container}>
        {/* Section header */}
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>Projects</Text>
          <Text style={styles.sectionTitle}>Selected Work</Text>
        </View>

        {/* Filter chips */}
        <View style={styles.filterContainer}>
          {categories.map((cat, index) => (
            <Chip
              key={cat}
              variant={activeCategory.value === cat ? 'selected' : 'default'}
              onPress={() => handleCategoryChange(cat)}
              style={[
                styles.filterChip,
                categoryAnims[index].animatedStyle,
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Chip>
          ))}
        </View>

        {/* Featured projects - larger cards */}
        {featuredProjects.length > 0 && (
          <View style={styles.featuredGrid}>
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={true}
                index={index}
              />
            ))}
          </View>
        )}

        {/* More projects - standard grid */}
        {moreProjects.length > 0 && (
          <View style={styles.moreGrid}>
            {moreProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={false}
                index={index}
              />
            ))}
          </View>
        )}
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  filterChip: {
    // Chip styles handled by component
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 32,
  },
  moreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});

export default ProjectsSection;