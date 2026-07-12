import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { arcSpring } from '../../constants/design-tokens';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    shortDescription: string;
    image: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
    category: string;
  };
  featured: boolean;
  index: number;
  onPress?: () => void;
}

/**
 * ProjectCard - Project display card with thumbnail, tech stack, and actions
 */
export const ProjectCard = ({ project, featured, index, onPress }: ProjectCardProps) => {
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    shadowOpacity: shadowOpacity.value,
    elevation: shadowOpacity.value * 4,
  }));

  const handleHoverIn = () => {
    if (featured) {
      translateY.value = withSpring(-8, arcSpring);
      shadowOpacity.value = withSpring(1, arcSpring);
    }
  };

  const handleHoverOut = () => {
    if (featured) {
      translateY.value = withSpring(0, arcSpring);
      shadowOpacity.value = withSpring(0, arcSpring);
    }
  };

  const cardWidth = featured ? '48%' : '30%';
  const minWidth = featured ? 320 : 280;

  return (
    <Card
      variant={featured ? 'elevated' : 'default'}
      padding="md"
      hover={featured}
      pressable={!!onPress}
      onPress={onPress}
      style={[
        styles.card,
        { width: cardWidth, minWidth },
        featured && styles.cardFeatured,
        animatedStyle,
      ]}
    >
      {/* Featured badge */}
      {featured && (
        <View style={styles.featuredBadge}>
          <Icon name="sparkles" size={12} color="var(--accent)" />
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}

      {/* Thumbnail */}
      <View style={styles.thumbnailWrapper}>
        <Image
          source={{ uri: project.image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <Chip variant="outline" size="sm" style={styles.categoryChip}>
          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
        </Chip>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {project.shortDescription}
        </Text>

        {/* Tech stack */}
        <View style={styles.techStack}>
          {project.techStack.slice(0, 5).map((tech, i) => (
            <Chip key={tech} variant="default" size="sm" style={styles.techChip}>
              {tech}
            </Chip>
          ))}
          {project.techStack.length > 5 && (
            <Chip variant="outline" size="sm" style={styles.techChip}>
              +{project.techStack.length - 5} more
            </Chip>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {project.githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Icon name="github" size={14} />}
              onPress={() => {}}
              testID={`project-${project.id}-github`}
            >
              Code
            </Button>
          )}
          {project.liveUrl && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Icon name="externalLink" size={14} />}
              onPress={() => {}}
              testID={`project-${project.id}-live`}
            >
              Live
            </Button>
          )}
          <Button
            variant={featured ? 'primary' : 'glass'}
            size="sm"
            rightIcon={<Icon name="chevronRight" size={14} />}
            onPress={onPress}
            testID={`project-${project.id}-details`}
          >
            View Details
          </Button>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
  },
  cardFeatured: {
    borderTopWidth: 3,
    borderTopColor: 'transparent',
    borderImageSource: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    borderImageSlice: 1,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  featuredText: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: '600',
    color: 'var(--accent)',
  },
  thumbnailWrapper: {
    position: 'relative',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  categoryChip: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  content: {
    gap: 12,
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: featured ? 20 : 18,
    fontWeight: '700',
    color: 'var(--fg)',
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
    lineHeight: 1.6,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  techChip: {
    // Handled by Chip component
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
  },
});

export default ProjectCard;