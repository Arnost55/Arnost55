/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-warm': 'var(--surface-warm)',
        fg: 'var(--fg)',
        'fg-2': 'var(--fg-2)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        'border-soft': 'var(--border-soft)',
        accent: 'var(--accent)',
        'accent-on': 'var(--accent-on)',
        'accent-hover': 'var(--accent-hover)',
        success: 'var(--success)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
        glass: {
          light: 'var(--glass-light)',
          medium: 'var(--glass-medium)',
          heavy: 'var(--glass-heavy)',
          dark: 'var(--glass-dark)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
      },
      lineHeight: {
        body: 'var(--leading-body)',
        tight: 'var(--leading-tight)',
      },
      letterSpacing: {
        display: 'var(--tracking-display)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        12: 'var(--space-12)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        flat: 'var(--elev-flat)',
        ring: 'var(--elev-ring)',
        raised: 'var(--elev-raised)',
        'focus-ring': 'var(--focus-ring)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
      backgroundImage: {
        'gradient-sunset': 'var(--gradient-sunset)',
        'gradient-twilight': 'var(--gradient-twilight)',
        'gradient-aurora': 'var(--gradient-aurora)',
      },
    },
  },
  plugins: [],
}