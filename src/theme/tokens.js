import { useColorScheme } from 'react-native';

// Contrast (WCAG) checked per pair: every text colour is at least 4.5:1 on its surface.
const light = {
  bg: '#F2F3F7', surface: '#FFFFFF', surface2: '#E9EBF2', edge: '#D5D9E5', separator: '#DDE0E9',
  label: '#1B1D26', secondary: '#5A5F6E', placeholder: '#6E7382',
  accent: '#3F5FC0', onAccent: '#FFFFFF', accentTint: '#E7ECFB',
  success: '#1E7B45', successTint: '#E2F4E9', danger: '#B3362B', dangerTint: '#FBE9E7',
  puzzle: '#7C93E0', challenge: '#EDAE49', scrim: 'rgba(10,12,20,0.45)',
};
const dark = {
  bg: '#101218', surface: '#1C1F28', surface2: '#2A2E3A', edge: '#0A0B10', separator: '#2F3340',
  label: '#F2F3F7', secondary: '#A8ADBC', placeholder: '#8D93A3',
  accent: '#8FA8F5', onAccent: '#101218', accentTint: '#252E4D',
  success: '#5FCF8E', successTint: '#163324', danger: '#FF8A7E', dangerTint: '#3D1C19',
  puzzle: '#4E66BC', challenge: '#B57F22', scrim: 'rgba(0,0,0,0.6)',
};

export const useColors = () => (useColorScheme() === 'dark' ? dark : light);

export const type = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.3 },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  headline: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 25 },
  subhead: { fontSize: 15, lineHeight: 21 },
  footnote: { fontSize: 13, lineHeight: 18 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
};
