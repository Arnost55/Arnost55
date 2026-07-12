/**
 * Arc Browser Design Tokens for React Native for Web
 * Centralized design tokens matching global.css and tailwind.config.ts
 */

// Color tokens
export const colors = {
  light: {
    bg: '#fdf3ec',
    surface: '#ffffff',
    surfaceWarm: '#fff4ea',
    fg: '#1a1a1f',
    fg2: '#54545a',
    muted: '#8c8c93',
    border: '#ece5db',
    borderSoft: '#f6f0e8',
    accent: '#ff5f5f',
    accentOn: '#ffffff',
    accentHover: '#e85555',
    success: '#48bb78',
    warn: '#f6ad55',
    danger: '#f56565',
    glassLight: 'rgba(255, 255, 255, 0.7)',
    glassMedium: 'rgba(255, 255, 255, 0.5)',
    glassHeavy: 'rgba(255, 255, 255, 0.85)',
    glassDark: 'rgba(20, 20, 25, 0.6)',
  },
  dark: {
    bg: '#1a1a1f',
    surface: '#1e1e24',
    surfaceWarm: '#25201d',
    fg: '#fafafa',
    fg2: '#b8b8be',
    muted: '#8c8c93',
    border: '#2d2a26',
    borderSoft: '#3a3530',
    accent: '#ff5f5f',
    accentOn: '#ffffff',
    accentHover: '#e85555',
    success: '#48bb78',
    warn: '#f6ad55',
    danger: '#f56565',
    glassLight: 'rgba(30, 30, 36, 0.7)',
    glassMedium: 'rgba(30, 30, 36, 0.5)',
    glassHeavy: 'rgba(30, 30, 36, 0.85)',
    glassDark: 'rgba(10, 10, 12, 0.6)',
  },
};

// Gradients
export const gradients = {
  sunset: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
  twilight: 'linear-gradient(135deg, #7f5af0, #e84393)',
  aurora: 'linear-gradient(135deg, #16f2b3, #0db4f7)',
};

// Typography tokens
export const typography = {
  fontDisplay: '"Argent CF", "Source Serif Pro", Georgia, serif',
  fontBody: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  fontMono: '"Berkeley Mono", ui-monospace, Menlo, Consolas, monospace',
  textXs: 12,
  textSm: 13,
  textBase: 15,
  textLg: 18,
  textXl: 22,
  text2xl: 32,
  text3xl: 40,
  text4xl: 72,
  leadingBody: 1.55,
  leadingTight: 1.05,
  trackingDisplay: '-0.03em',
};

// Spacing tokens
export const spacing = {
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
  space12: 48,
  sectionYDesktop: 96,
  sectionYTablet: 64,
  sectionYPhone: 48,
};

// Radius tokens
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 9999,
};

// Elevation/Shadow tokens
export const elevation = {
  flat: 'none',
  ring: '0 0 0 1px var(--border)',
  raised: '0 8px 32px rgba(0, 0, 0, 0.08)',
  focusRing: '0 0 0 4px color-mix(in oklab, var(--accent), transparent 80%)',
};

// Motion tokens
export const motion = {
  fast: 200,
  base: 320,
  easeStandard: 'cubic-bezier(0.32, 0.72, 0, 1)',
};

// Reanimated spring preset (approximates cubic-bezier(0.32, 0.72, 0, 1))
export const arcSpring = {
  damping: 20,
  stiffness: 150,
  mass: 1,
};

// Breakpoints
export const breakpoints = {
  mobile: 430,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

export type Breakpoint = keyof typeof breakpoints;

// Container
export const container = {
  max: 1200,
  gutterDesktop: 32,
  gutterTablet: 24,
  gutterPhone: 16,
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modalBackdrop: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
};