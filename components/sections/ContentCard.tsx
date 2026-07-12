import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { contentChannels } from '../../constants/data/contentCreation';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';
import { arcSpring } from '../../constants/design-tokens';

const platformColors = {
  youtube: '#FF0000',
  instagram: '#E1306C',
  tiktok: '#000000',
};

const platformGradients = {
  youtube: 'linear-gradient(135deg, #FF0000, #CC0000)',
  instagram: 'linear-gradient(135deg, #E1306C, #FD1D1D, #F77737, #FCAF45)',
  tiktok: 'linear-gradient(135deg, #000000, #333333)',
};

/**
 * ContentCard - Platform channel cards with gradient headers
 */
export const ContentCard = ({ channel, index }: { channel: typeof contentChannels[0]; index: number }) => {
  const anim = useSharedValue(0);

  React.useEffect(() => {
    anim.value = withDelay(index * 150, withSpring(1, arcSpring));
  }, [index]);

  const color = platformColors[channel.platform as keyof typeof platformColors] || '#ff5f5f';
  const gradient = platformGradients[channel.platform as keyof typeof platformGradients] || 'linear-gradient(135deg, #ff7e5f, #feb47b)';

  return (
    <Card
      variant="default"
      padding="none"
      hover={true}
      style={[
        styles.card,
        anim.animatedStyle,
      ]}
    >
      {/* Gradient header */}
      <View style={[
        styles.header,
        { backgroundColor: color }, // Use solid color for RNW compatibility
      ]}>
        <View style={styles.headerContent}>
          <View style={styles.iconWrapper}>
            <Icon name={channel.icon} size={28} color="#fff" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.platformName}>
              {channel.platform.charAt(0).toUpperCase() + channel.platform.slice(1)}
            </Text>
            <Text style={styles.handle}>@{channel.handle}</Text>
          </View>
          <Chip variant="selected" size="sm" style={styles.subscribers}>
            {channel.subscribers}
          </Chip>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.description}>{channel.description}</Text>

        {/* Pillars would go here if we had them per channel */}
        <View style={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Icon name="externalLink" size={14} />}
            onPress={() => {}}
            testID={`content-${channel.platform}-visit`}
          >
            Visit Channel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Icon name="heart" size={14} />}
            onPress={() => {}}
            testID={`content-${channel.platform}-follow`}
          >
            Follow
          </Button>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  platformName: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  handle: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  subscribers: {
    // Handled by Chip
  },
  content: {
    padding: 20,
    gap: 16,
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-2)',
    lineHeight: 1.6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'var(--border-soft)',
  },
});

export default ContentCard;