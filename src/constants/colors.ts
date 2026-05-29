export const COLORS = {
  background: {
    primary:   '#FFFFFF',
    secondary: '#F9F9F9',
    dark:      '#0A0A0A',
  },

  text: {
    primary:   '#0A0A0A',
    secondary: '#6B6B6B',
    muted:     '#9B9B9B',
    inverse:   '#FFFFFF',
  },

  // Accent rose/magenta — CTAs, badges, highlights
  brand: {
    primary:   '#E91E8C',
    light:     '#F5A0CF',
    dark:      '#B0156A',
    muted:     '#FDE8F4',
  },

  border: {
    default:   '#E5E5E5',
    focus:     '#0A0A0A',
  },

  status: {
    success:   '#22C55E',
    warning:   '#F59E0B',
    error:     '#EF4444',
    info:      '#3B82F6',
  },

  // Score de matching espace/marque
  match: {
    high:      '#22C55E', // > 85%
    medium:    '#F59E0B', // 70–85%
    low:       '#EF4444', // < 70%
  },
} as const

// Tokens Tailwind — à référencer dans tailwind.config.ts
export const TAILWIND_TOKENS = {
  'brand-primary':  COLORS.brand.primary,
  'brand-light':    COLORS.brand.light,
  'brand-dark':     COLORS.brand.dark,
  'brand-muted':    COLORS.brand.muted,
  'text-primary':   COLORS.text.primary,
  'text-secondary': COLORS.text.secondary,
  'bg-secondary':   COLORS.background.secondary,
} as const
