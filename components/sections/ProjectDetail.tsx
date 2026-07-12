import React from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useTheme, useBreakpoint } from '../../hooks';
import { arcSpring, motion } from '../../constants/design-tokens';
import { Easing } from 'react-native-reanimated';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { BlurView } from 'expo-blur';
import { projects } from '../../constants/data/projects';

interface ProjectDetailProps {
  projectId: string;
  visible: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * ProjectDetail - Modal sheet (mobile) or full page (desktop) for project details
 */
export const ProjectDetail = ({ projectId, visible, onClose, onPrev, onNext }: ProjectDetailProps) => {
  const { isDark, isDesktop } = useTheme(); // isDesktop from useBreakpoint would be better
  const { isDesktop: isDesktopBP } = useBreakpoint();
  const isModal = !isDesktopBP;

  const project = projects.find(p => p.id === projectId);
  const currentIndex = projects.findIndex(p => p.id === projectId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < projects.length - 1;

  const translateY = useSharedValue(isModal ? '100%' : 0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const handleOpen = () => {
    if (isModal) {
      translateY.value = withSpring(0, arcSpring);
      opacity.value = withTiming(1, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    } else {
      opacity.value = withTiming(1, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
      scale.value = withSpring(1, arcSpring);
    }
  };

  const handleClose = () => {
    if (isModal) {
      translateY.value = withSpring('100%', arcSpring);
      opacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    } else {
      opacity.value = withTiming(0, { duration: motion.fast, easing: Easing.bezier(0.32, 0.72, 0, 1) });
      scale.value = withSpring(0.95, arcSpring);
    }
    setTimeout(() => runOnJS(onClose)(), isModal ? motion.base : motion.fast);
  };

  if (visible) {
    handleOpen();
  } else {
    handleClose();
  }

  if (!visible && opacity.value === 0) {
    return null;
  }

  if (!project) return null;

  const content = (
    <View style={styles.content}>
      {/* Hero image */}
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

      {/* Content */}
      <View style={styles.details}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.description}>{project.fullDescription}</Text>

        {/* Tech stack */}
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
              leftIcon={<Icon name="github" size={18} />}
              onPress={() => {}}
              testID={`detail-${project.id}-github`}
            >
              View Code
            </Button>
          )}
          {project.liveUrl && (
            <Button
              variant="glass"
              leftIcon={<Icon name="externalLink" size={18} />}
              onPress={() => {}}
              testID={`detail-${project.id}-live`}
            >
              Live Demo
            </Button>
          )}
        </View>

        {/* Prev/Next navigation */}
        {(hasPrev || hasNext) && (
          <View style={styles.nav}>
            {hasPrev && (
              <Button
                variant="outline"
                leftIcon={<Icon name="chevronLeft" size={18} />}
                onPress={onPrev}
                testID={`detail-${project.id}-prev`}
              >
                Previous Project
              </Button>
            )}
            {hasNext && (
              <Button
                variant="outline"
                rightIcon={<Icon name="chevronRight" size={18} />}
                onPress={onNext}
                testID={`detail-${project.id}-next`}
              >
                Next Project
              </Button>
            )}
          </View>
        )}
      </View>
    </View>
  );

  if (isModal) {
    return (
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable
          style={backdropStyle}
          onPress={onClose}
          pointerEvents="box-only"
        />
        <BlurView
          intensity={isDark ? 'dark' : 'regular'}
          style={[
            styles.sheet,
            modalStyle,
          ]}
        >
          <View style={styles.sheetHeader}>
            <View style={styles.dragHandle} />
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="x" size={24} color="var(--fg-2)" />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        </BlurView>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      {content}
    </View>
  );
};

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
  sheet: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  },
  pageContainer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--border-soft)',
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
  sheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  content: {
    gap: 24,
  },
  heroWrapper: {
    position: 'relative',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 8,
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
  },
});

export default ProjectDetail;