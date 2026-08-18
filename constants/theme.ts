/**
 * STA Design Tokens
 * Warm hospitality + fintech trust palette
 */

export const colors = {
  // Brand
  primary: '#0F766E',        // deep teal – trust, official
  primaryDark: '#115E59',
  primaryLight: '#5EEAD4',
  emphasis: '#D97706',       // warm amber – hospitality
  emphasisLight: '#FDE68A',

  // Semantic
  success: '#059669',
  danger: '#DC2626',
  warning: '#F59E0B',
  info: '#0369A1',

  // Surfaces
  background: '#FAF7F2',     // warm sand
  surface: '#FFFFFF',
  surfaceAlt: '#F5F1EA',
  surfaceDark: '#0B2A2A',    // deep teal surface for hero

  // Text
  text: '#1C1917',
  textSubtle: '#57534E',
  textMuted: '#A8A29E',
  textInverse: '#FFFFFF',

  // Utility
  border: '#E7E2D9',
  borderStrong: '#D6CFC1',
  overlay: 'rgba(11, 42, 42, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const typography = {
  displayLg: { fontSize: 32, fontWeight: '700' as const, lineHeight: 38 },
  displayMd: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  h1: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h2: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  h3: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
};

export const shadows = {
  card: {
    shadowColor: '#0B2A2A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  hero: {
    shadowColor: '#0B2A2A',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

export const theme = { colors, spacing, radii, typography, shadows };
export default theme;
