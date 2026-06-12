export const COLORS = {
  background: {
    primary:   '#FFFFFF',
    secondary: '#FAFAFA',
    dark:      '#0A192F',
  },

  text: {
    primary:   '#0A192F',
    secondary: '#4A5568',
    muted:     '#9B9B9B',
    inverse:   '#FFFFFF',
  },

  // Accent bleu électrique royal — CTAs, badges, highlights (design.md)
  brand: {
    primary:    '#0052CC',
    light:      '#BFDBFE',
    dark:       '#003D99',
    muted:      '#EFF6FF',
    light_blue: '#3B82F6',
    periwinkle: '#818CF8',
  },

  border: {
    default:   '#E2E8F0',
    focus:     '#0052CC',
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
