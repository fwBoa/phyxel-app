export const COLORS = {
  background: {
    primary:   '#FFFFFF',
    secondary: '#F5F3FF',   // lavande très claire
    dark:      '#0A0A0A',
  },
  text: {
    primary:   '#0A0A0A',
    secondary: '#6B7280',
    muted:     '#9CA3AF',
    inverse:   '#FFFFFF',
  },
  brand: {
    primary:   '#7C3AED',   // violet
    light:     '#EDE9FE',
    dark:      '#5B21B6',
    muted:     '#F5F3FF',
    gradient:  'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
  },
  border: {
    default:   '#E5E7EB',
    focus:     '#7C3AED',
  },
  status: {
    success:   '#22C55E',
    warning:   '#F59E0B',
    error:     '#EF4444',
    info:      '#3B82F6',
  },
  // Fonds pastels des cartes espaces
  cardBg: {
    purple: '#DDD6FE',
    yellow: '#FEF3C7',
    green:  '#D1FAE5',
    pink:   '#FCE7F3',
    teal:   '#CCFBF1',
    salmon: '#FEE2E2',
  },
} as const;
