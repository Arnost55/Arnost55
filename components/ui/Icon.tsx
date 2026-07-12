import React, { ReactNode } from 'react';
import { Text, StyleSheet, View } from 'react-native';

// Lucide icon names mapping to actual icon components
// For now, we'll use a simple text-based approach
// In production, you'd import from lucide-react-native

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill';
  style?: any;
  className?: string;
  testID?: string;
}

/**
 * Icon - Wrapper for lucide-react-native icons with Arc styling
 * Uses text-based fallbacks for common icons
 */
export const Icon = ({
  name,
  size = 20,
  color = 'currentColor',
  weight = 'regular',
  style,
  className = '',
  testID,
}: IconProps) => {
  // Simple text-based icons for common names
  const iconMap: Record<string, string> = {
    github: '⌘',
    linkedin: 'in',
    mail: '✉',
    phone: '☎',
    location: '📍',
    code: '</>',
    server: '⚙',
    database: '🗄',
    shield: '🛡',
    cpu: '⚡',
    film: '🎬',
    youtube: '▶',
    instagram: '📷',
    music: '♪',
    sparkles: '✨',
    check: '✓',
    chevronRight: '›',
    chevronLeft: '‹',
    chevronDown: '▼',
    chevronUp: '▲',
    x: '✕',
    menu: '☰',
    sun: '☀',
    moon: '🌙',
    monitor: '🖥',
    smartphone: '📱',
    tablet: '📟',
    layout: '⬜',
    grid: '⬚',
    list: '☰',
    search: '🔍',
    filter: '⛶',
    star: '★',
    heart: '♥',
    download: '⬇',
    upload: '⬆',
    link: '🔗',
    externalLink: '↗',
    github: '⌘',
    twitter: '𝕏',
    discord: '🎮',
    email: '✉',
    globe: '🌐',
    lock: '🔒',
    unlock: '🔓',
    eye: '👁',
    eyeOff: '🙈',
    settings: '⚙',
    home: '🏠',
    user: '👤',
    briefcase: '💼',
    book: '📚',
    graduationCap: '🎓',
    award: '🏆',
    code: '{}',
    terminal: '>_',
    flask: '🧪',
    hammer: '🔨',
    wrench: '🔧',
    palette: '🎨',
    camera: '📷',
    image: '🖼',
    video: '🎥',
    music: '🎵',
    volume: '🔊',
    volumeOff: '🔇',
    play: '▶',
    pause: '⏸',
    stop: '■',
    skipForward: '⏭',
    skipBack: '⏮',
    fastForward: '⏩',
    rewind: '⏪',
    repeat: '🔁',
    shuffle: '🔀',
    mic: '🎤',
    micOff: '🎤',
    headphones: '🎧',
    speaker: '🔊',
  };

  const symbol = iconMap[name.toLowerCase()] || name;

  const weightStyles = {
    thin: { fontWeight: '300' as const },
    light: { fontWeight: '400' as const },
    regular: { fontWeight: '500' as const },
    bold: { fontWeight: '700' as const },
    fill: { fontWeight: '900' as const },
  };

  return (
    <Text
      style={[
        styles.icon,
        { fontSize: size, color },
        weightStyles[weight],
        style,
      ]}
      className={className}
      testID={testID}
      accessibilityHidden={true}
    >
      {symbol}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    lineHeight: 1,
    includeFontPadding: false,
    textAlign: 'center',
  },
});

export default Icon;