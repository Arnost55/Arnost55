import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { arcSpring } from '../../constants/design-tokens';

/**
 * CTACard - Final call-to-action card at the bottom of the page
 */
export const CTACard = () => {
  const anim = useSharedValue(0);

  React.useEffect(() => {
    anim.value = withDelay(200, withSpring(1, arcSpring));
  }, []);

  return (
    <View style={[styles.container, anim.animatedStyle]}>
      <View style={styles.card}>
        <Text style={styles.title}>Want to Collaborate?</Text>
        <Text style={styles.description}>
          I\'m always open to interesting projects, freelance work, speaking opportunities,
          or just a good technical conversation.
        </Text>
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Icon name="mail" size={20} color="#fff" />}
            onPress={() => {}}
            testID="cta-email"
          >
            Get In Touch
          </Button>
          <Button
            variant="glass"
            size="lg"
            leftIcon={<Icon name="github" size={20} />}
            onPress={() => {}}
            testID="cta-github"
          >
            View on GitHub
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  card: {
    width: '100%',
    maxWidth: 600,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderWidth: 1,
    borderColor: 'var(--border)',
    borderRadius: 16,
    alignItems: 'center',
    textAlign: 'center',
    gap: 16,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 28,
    fontWeight: '400',
    color: 'var(--fg)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    color: 'var(--fg-2)',
    lineHeight: 1.6,
    maxWidth: 400,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
});

export default CTACard;