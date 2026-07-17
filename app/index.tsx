import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
import {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Link } from 'expo-router';
import { ScreenContainer, Section } from '../components/layout/ScreenContainer';
import { Hero } from '../components/sections/Hero';
import { AboutCard } from '../components/sections/AboutCard';
import { SkillsGrid } from '../components/sections/SkillsGrid';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { ContentCard } from '../components/sections/ContentCard';
import { Timeline } from '../components/sections/Timeline';
import { LanguageList } from '../components/sections/LanguageList';
import { ContactForm } from '../components/sections/ContactForm';
import { ContactInfo } from '../components/sections/ContactInfo';
import { CTACard } from '../components/sections/CTACard';
import { Footer } from '../components/navigation/Footer';
import { contentChannels } from '../constants/data/contentCreation';
import { arcSpring } from '../constants/design-tokens';

/**
 * Home screen - Single scrollable page with all sections
 */
function HomeScreen() {
  const { height } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  // Section refs for scroll-to animations
  const sectionRefs = {
    hero: useRef<View>(null),
    about: useRef<View>(null),
    skills: useRef<View>(null),
    projects: useRef<View>(null),
    content: useRef<View>(null),
    education: useRef<View>(null),
    languages: useRef<View>(null),
    contact: useRef<View>(null),
  };

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  // Intersection observer-style animation triggers
  useEffect(() => {
    // Simple scroll-based animation triggers
    // In a real app, you'd use useAnimatedReaction or onScrollEndDrag
  }, []);

  return (
    <ScreenContainer scrollable={true} showGradient={true}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View ref={sectionRefs.hero} style={styles.sectionWrapper}>
          <Hero />
        </View>

        {/* About Section */}
        <View ref={sectionRefs.about} style={styles.sectionWrapper} id="about">
          <AboutCard />
        </View>

        {/* Skills Section */}
        <View ref={sectionRefs.skills} style={styles.sectionWrapper} id="skills">
          <SkillsGrid />
        </View>

        {/* Projects Section */}
        <View ref={sectionRefs.projects} style={styles.sectionWrapper} id="projects">
          <ProjectsSection />
        </View>

        {/* Content Creation Section */}
        <View ref={sectionRefs.content} style={styles.sectionWrapper} id="content">
          {contentChannels.map((channel, index) => (
            <ContentCard key={channel.platform} channel={channel} index={index} />
          ))}
        </View>

        {/* Education Section */}
        <View ref={sectionRefs.education} style={styles.sectionWrapper} id="education">
          <Timeline />
        </View>

        {/* Languages Section */}
        <View ref={sectionRefs.languages} style={styles.sectionWrapper} id="languages">
          <LanguageList />
        </View>

        {/* Contact Section */}
        <View ref={sectionRefs.contact} style={styles.sectionWrapper} id="contact">
          <Section style={styles.contactSection} size="lg">
            <View style={styles.contactHeader}>
              <Text style={styles.contactLabel}>Contact</Text>
              <Text style={styles.contactTitle}>Let's Talk</Text>
            </View>
            <View style={styles.contactGrid}>
              <View style={styles.contactLeft}>
                <ContactInfo />
              </View>
              <View style={styles.contactRight}>
                <ContactForm />
              </View>
            </View>
          </Section>
        </View>

        {/* CTA / Footer */}
        <CTACard />

        {/* Footer */}
        <Footer />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  sectionWrapper: {
    width: '100%',
  },
  contactSection: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  contactHeader: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  contactLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: '600',
    color: 'var(--accent)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  contactTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 40,
    fontWeight: '400',
    color: 'var(--fg)',
    lineHeight: 1.15,
    letterSpacing: -0.8,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 32,
  },
  contactLeft: {
    flex: 1,
    minWidth: 300,
    maxWidth: 400,
  },
  contactRight: {
    flex: 1,
    minWidth: 300,
    maxWidth: 600,
  },
});

export default HomeScreen;
