import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { projects } from '../../constants/data/projects';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { Icon } from '../../components/ui/Icon';
import { arcSpring, motion } from '../../constants/design-tokens';
import { Easing } from 'react-native-reanimated';

/**
 * Project Detail Screen - Modal sheet on mobile, full page on desktop
 */
export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isDesktop } = useBreakpoint();

  const project = projects.find(p => p.id === id);

  // Animation values - use numeric values for Reanimated
  const translateY = useSharedValue(isDesktop ? 0 : 1000);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  // Modal animations
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleOpen = () => {
    opacity.value = withTiming(1, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    translateY.value = withSpring(0, arcSpring);
    scale.value = withSpring(1, arcSpring);
  };

  const handleClose = () => {
    if (isDesktop) {
      opacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
      scale.value = withSpring(0.95, arcSpring);
    } else {
      translateY.value = withSpring(1000, arcSpring);
      opacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    }
    setTimeout(() => runOnJS(router.back)(), isDesktop ? motion.fast : motion.base);
  };

  useEffect(() => {
    handleOpen();
  }, []);

  if (!project) {
    return null;
  }

  const currentIndex = projects.findIndex(p => p.id === id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < projects.length - 1;
  const prevProject = hasPrev ? projects[currentIndex - 1] : null;
  const nextProject = hasNext ? projects[currentIndex + 1] : null;

  // For web, we need to render the backdrop filter via CSS
  const sheetStyle = isDesktop ? styles.modal : styles.sheet;
  const contentStyle = isDesktop ? {} : { backgroundColor: 'rgba(255, 255, 255, 0.85)' };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Backdrop */}
      <Pressable
        style={backdropStyle}
        onPress={handleClose}
        pointerEvents="box-only"
      />

      {/* Modal / Page content */}
      <View
        style={[
          sheetStyle,
          modalStyle,
          contentStyle,
        ]}
        pointerEvents="box-only"
      >
        {/* Header */}
        <View style={styles.header}>
          {isDesktop && (
            <Pressable
              style={styles.closeButton}
              onPress={handleClose}
              accessibilityLabel="Close"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="x" size={24} color="var(--fg-2)" />
            </Pressable>
          )}
          {!isDesktop && (
            <View style={styles.dragHandleWrapper}>
              <View style={styles.dragHandle} />
            </View>
          )}
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          <View style={styles.heroWrapper}>
            <Image
              source={{ uri: project.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <Chip variant="default" size="md" style={styles.categoryChip}>
                {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
              </Chip>
              {project.featured && (
                <Chip variant="selected" size="sm" style={styles.featuredChip}>
                  <Icon name="sparkles" size={12} color="#fff" /> Featured
                </Chip>
              )}
            </View>
          </View>

          {/* Details */}
          <View style={styles.details}>
            <Text style={styles.title}>{project.title}</Text>
            <Text style={styles.description}>{project.fullDescription}</Text>

            {/* Tech Stack */}
            <View style={styles.techSection}>
              <Text style={styles.sectionTitle}>Tech Stack</Text>
              <View style={styles.techStack}>
                {project.techStack.map((tech, i) => (
                  <Chip key={tech} variant="default" size="md">
                    {tech}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Highlights */}
            <View style={styles.highlightsSection}>
              <Text style={styles.sectionTitle}>Highlights</Text>
              <View style={styles.highlightsList}>
                {project.highlights.map((highlight, i) => (
                  <View key={i} style={styles.highlightItem}>
                    <Icon name="check" size={16} color="var(--success)" style={styles.checkIcon} />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {project.githubUrl && (
                <Button
                  variant="primary"
                  leftIcon={<Icon name="github" size={18} color="#fff" />}
                  onPress={() => Linking.openURL(project.githubUrl!)}
                  testID={`detail-${project.id}-github`}
                >
                  View Code
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  variant="glass"
                  leftIcon={<Icon name="externalLink" size={18} />}
                  onPress={() => Linking.openURL(project.liveUrl!)}
                  testID={`detail-${project.id}-live`}
                >
                  Live Demo
                </Button>
              )}
            </View>

            {/* Prev/Next Navigation */}
            {(hasPrev || hasNext) && (
              <View style={styles.nav}>
                {hasPrev && (
                  <Button
                    variant="outline"
                    leftIcon={<Icon name="chevronLeft" size={18} />}
                    onPress={() => router.push(`/project/${prevProject?.id}`)}
                    testID={`detail-${project.id}-prev`}
                  >
                    Previous: {prevProject?.title}
                  </Button>
                )}
                {hasNext && (
                  <Button
                    variant="outline"
                    rightIcon={<Icon name="chevronRight" size={18} />}
                    onPress={() => router.push(`/project/${nextProject?.id}`)}
                    testID={`detail-${project.id}-next`}
                  >
                    Next: {nextProject?.title}
                  </Button>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 400,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'var(--border)',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modal: {
    width: '90%',
    maxWidth: 800,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'var(--border)',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-soft)',
  },
  dragHandleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'var(--muted)',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroWrapper: {
    position: 'relative',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  categoryChip: {},
  featuredChip: {},
  details: {
    gap: 24,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 32,
    fontWeight: '400',
    color: 'var(--fg)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--fg-2)',
    lineHeight: 1.7,
  },
  techSection: {
    gap: 12,
  },
  highlightsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '600',
    color: 'var(--fg)',
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightsList: {
    gap: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  highlightText: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg)',
    lineHeight: 1.6,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
    flexWrap: 'wrap',
    gap: 12,
  },
});

export default ProjectDetailScreen;