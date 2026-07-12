import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useAnimatedStyleHelpers } from '../../hooks/useAnimatedStyle';
import { personalInfo, highlights, socialLinks } from '../../constants/data/personal';
import { projects } from '../../constants/data/projects';
import { Button } from '../ui';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { FrostedCard } from '../layout/ScreenContainer';

/**
 * Hero - Main landing section with name, title, summary, highlights, CTAs, social links
 * Desktop: Split layout with code visualization on right
 * Mobile: Stacked layout
 */
export const Hero = () => {
  const { isDesktop, isTablet } = useBreakpoint();
  const { createEntrance, createStaggeredEntrance, createGradientAnimation } = useAnimatedStyleHelpers();
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue(0);

  // Entrance animations for staggered elements
  const greeting = createEntrance(0);
  const name = createEntrance(100);
  const title = createEntrance(200);
  const summary = createEntrance(300);
  const highlight1 = createStaggeredEntrance(0, 100);
  const highlight2 = createStaggeredEntrance(1, 100);
  const highlight3 = createStaggeredEntrance(2, 100);
  const highlight4 = createStaggeredEntrance(3, 100);
  const ctaPrimary = createEntrance(500);
  const ctaSecondary = createEntrance(600);
  const social = createEntrance(700);
  const gradientAnim = createGradientAnimation();

  // Start animations on mount
  useEffect(() => {
    greeting.start();
    name.start();
    title.start();
    summary.start();
    highlight1.start();
    highlight2.start();
    highlight3.start();
    highlight4.start();
    ctaPrimary.start();
    ctaSecondary.start();
    social.start();
    gradientAnim.start();
  }, []);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // Parallax effect for background elements
  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }],
  }));

  return (
    <section id="hero" style={styles.section}>
      <View style={[styles.gradientWrapper, gradientAnim.animatedStyle]} pointerEvents="none" />
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.container}>
          {/* Left column - text content */}
          <View style={styles.leftColumn}>
            <View style={styles.greetingWrapper}>
              <Text style={[styles.greeting, greeting.animatedStyle]}>
                Hello, I'm
              </Text>
            </View>

            <Text style={[styles.name, name.animatedStyle]}>
              {personalInfo.name}
            </Text>

            <Text style={[styles.title, title.animatedStyle]}>
              {personalInfo.title}
            </Text>

            <Text style={[styles.summary, summary.animatedStyle]}>
              {personalInfo.summary}
            </Text>

            {/* Highlights pills */}
            <View style={[styles.highlights, highlight1.animatedStyle]}>
              {highlights.map((highlight, index) => {
                const anim = index === 0 ? highlight1 : index === 1 ? highlight2 : index === 2 ? highlight3 : highlight4;
                return (
                  <Chip
                    key={highlight}
                    style={[
                      styles.highlightChip,
                      index > 1 && { marginTop: 8 }, // Wrap on mobile
                      anim.animatedStyle,
                    ]}
                  >
                    {highlight}
                  </Chip>
                );
              })}
            </View>

            {/* CTA Buttons */}
            <View style={[styles.ctaGroup, ctaPrimary.animatedStyle]}>
              <Button
                variant="primary"
                size="lg"
                onPress={() => {}}
                testID="hero-cta-primary"
              >
                View Projects
              </Button>
              <Button
                variant="glass"
                size="lg"
                onPress={() => {}}
                testID="hero-cta-secondary"
                style={ctaSecondary.animatedStyle}
              >
                Get In Touch
              </Button>
            </View>

            {/* Social Links */}
            <View style={[styles.socialGroup, social.animatedStyle]}>
              {socialLinks.map((social, index) => (
                <Pressable
                  key={social.platform}
                  style={[
                    styles.socialLink,
                    index > 0 && styles.socialLinkOffset,
                    social.animatedStyle || {},
                  ]}
                  onPress={() => {}}
                  accessibilityLabel={social.platform}
                  testID={`hero-social-${social.platform}`}
                >
                  <Icon name={social.icon} size={20} color="var(--fg)" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Right column - desktop only: skill cards + code visualization */}
          {isDesktop && (
            <View style={styles.rightColumn}>
              <View style={styles.visualizationWrapper}>
                <CodeVisualization />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </section>
  );
};

// Simple Chip component for highlights
const Chip = ({ children, style, ...props }: any) => (
  <View
    style={[
      styles.chip,
      style,
    ]}
    {...props}
  >
    <Text style={styles.chipText}>{children}</Text>
  </View>
);

// Animated code visualization placeholder
const CodeVisualization = () => {
  const { createGradientAnimation } = useAnimatedStyleHelpers();
  const gradientAnim = createGradientAnimation();
  const rotate = useSharedValue(0);

  useEffect(() => {
    gradientAnim.start();
    rotate.value = withSpring(360, { damping: 1, stiffness: 10 });
  }, []);

  return (
    <View style={styles.codeVisualization}>
      <View style={[styles.ring, { transform: [{ rotate: rotate.value + 'deg' }] }]} />
      <View style={styles.ring2} />
      <View style={styles.ring3} />
      <View style={styles.particles}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={[styles.particle, { transform: [{ rotate: i * 45 + 'deg' }, { translateX: 60 }] }]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    position: 'relative',
    minHeight: '100vh',
  },
  gradientWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    opacity: 1,
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 48,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  leftColumn: {
    width: '100%',
    alignItems: 'flex-start',
    gap: 16,
  },
  rightColumn: {
    width: '100%',
    marginTop: 48,
    alignItems: 'center',
  },
  greetingWrapper: {
    marginBottom: 4,
  },
  greeting: {
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    fontWeight: '400',
    color: 'var(--accent)',
    letterSpacing: '0.02em',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: 72, // text-4xl
    fontWeight: '400',
    lineHeight: 76,
    color: 'var(--fg)',
    letterSpacing: '-0.03em',
    maxWidth: '100%',
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: 32, // text-2xl
    fontWeight: '600',
    color: 'var(--fg-2)',
    lineHeight: 1.3,
    maxWidth: '100%',
  },
  summary: {
    fontFamily: 'var(--font-body)',
    fontSize: 15, // text-base
    color: 'var(--fg-2)',
    lineHeight: 1.7,
    maxWidth: 600,
    marginTop: 8,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 95, 95, 0.16)',
    borderRadius: 9999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--accent)',
  },
  ctaGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  socialGroup: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  socialLink: {
    width: 40,
    height: 40,
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
  socialLinkOffset: {
    marginLeft: -8,
  },
  visualizationWrapper: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 1,
  },
  codeVisualization: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 280,
    height: 280,
    marginTop: -140,
    marginLeft: -140,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(255, 126, 95, 0.3)',
    borderStyle: 'dashed',
  },
  ring2: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginTop: -100,
    marginLeft: -100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 126, 95, 0.2)',
  },
  ring3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 120,
    height: 120,
    marginTop: -60,
    marginLeft: -60,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 95, 95, 0.1)',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff5f5f',
    opacity: 0.6,
    marginTop: -4,
    marginLeft: -4,
  },
});

export default Hero;