'use client'

import SearchBar from '@/components/features/SearchBar'
import { COLORS } from '@/constants/colors'
import { motion, useReducedMotion } from 'motion/react'

const STATS = [
  '+340 espaces disponibles',
  '12 villes en France',
  'Réservation en 48h',
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function HeroSection() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Fond décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full opacity-10 bg-[radial-gradient(circle,#0052CC_0%,transparent_70%)]"
      />

      <motion.div
        className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
        initial={reduce ? false : 'hidden'}
        animate="visible"
        variants={containerVariants}
      >
        {/* Titre */}
        <motion.h1
          className="text-[32px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl sm:leading-tight"
          variants={itemVariants}
        >
          Trouvez le lieu physique idéal pour{' '}
          <motion.span
            className="inline-block shimmer-blue"
            initial={reduce ? false : { backgroundSize: '0% 100%' }}
            animate={{ backgroundSize: '200% 100%' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            faire vivre votre marque
          </motion.span>{' '}
          e-commerce
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg"
          variants={itemVariants}
        >
          Phyxel vous recommande les espaces physiques les plus adaptés à votre marque —
          showrooms, pop-ups, corners — et vous permet de réserver en quelques clics.
        </motion.p>

        {/* Boutons de navigation */}
        <motion.div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row" variants={itemVariants}>
          <button className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-[0.98]">
            Trouver mon lieu
          </button>
          <button className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors active:scale-[0.98]">
            Explorer les espaces
          </button>
        </motion.div>

        {/* Barre de recherche */}
        <motion.div className="mt-4" variants={itemVariants}>
          <SearchBar variant="hero" />
        </motion.div>

        {/* Stats */}
        <motion.div className="mt-5 flex flex-wrap justify-center gap-4 sm:gap-6" variants={itemVariants}>
          {STATS.map((stat) => (
            <div key={stat} className="flex items-center gap-1.5 font-semibold uppercase tracking-wide" style={{ fontSize: '11px', color: COLORS.brand.periwinkle }}>
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.brand.periwinkle }} />
              {stat}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
