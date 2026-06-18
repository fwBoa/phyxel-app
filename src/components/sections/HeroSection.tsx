'use client'

import Link from 'next/link'
import SearchSheet from '@/components/features/SearchSheet'
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
    <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:py-28">
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
        {/* Badge au-dessus du titre */}
        <motion.div
          className="mx-auto inline-flex items-center rounded-full border border-border-custom bg-white px-4 py-1.5"
          variants={itemVariants}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary sm:text-xs">
            Marketplace phygitale
          </span>
        </motion.div>

        {/* Titre */}
        <motion.h1
          className="mt-4 text-[28px] font-bold leading-[1.15] tracking-tight text-foreground sm:mt-6 sm:text-5xl sm:leading-tight"
          variants={itemVariants}
        >
          Trouvez le lieu physique idéal pour{' '}
          <span className="hero-gradient-text inline-block relative">
            <span className="sr-only">faire vivre votre marque</span>
            <motion.span
              className="hero-gradient-sweep inline-block"
              aria-hidden
              initial={reduce ? false : { backgroundPosition: '200% center' }}
              animate={{ backgroundPosition: '0% center' }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundImage: 'linear-gradient(to right, #0D58C6, #ffffff 50%, #0D58C6)',
                backgroundSize: '200% auto',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              faire vivre votre marque
            </motion.span>
            <span
              aria-hidden
              className="hero-gradient-final inline-block text-[#0D58C6]"
              style={{ opacity: 0, animation: 'heroGradientFadeIn 0.15s ease-out 1.3s forwards' }}
            >
              faire vivre votre marque
            </span>
          </span>{' '}
          e-commerce
        </motion.h1>

        <style>{`
          .hero-gradient-sweep {
            position: absolute;
            inset: 0;
          }
        `}</style>

        {/* Sous-titre */}
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base sm:text-lg"
          variants={itemVariants}
        >
          Phyxel recommande des pop-up stores, showrooms, corners et espaces
          événementiels adaptés à votre budget, votre cible et vos objectifs.
        </motion.p>

        {/* Boutons de navigation */}
        <motion.div className="mt-6 flex flex-col justify-center gap-2 sm:mt-8 sm:flex-row sm:gap-3" variants={itemVariants}>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
          >
            Trouver mon lieu
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/explorer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-50 active:scale-[0.98]"
          >
            Explorer les espaces
          </Link>
        </motion.div>

        {/* SearchBar (desktop) / SearchSheet trigger (mobile) */}
        <motion.div className="mt-4 sm:mt-6" variants={itemVariants}>
          <SearchSheet />
        </motion.div>

        {/* Stats */}
        <motion.div className="mt-4 flex flex-wrap justify-center gap-3 sm:mt-6 sm:gap-6" variants={itemVariants}>
          {STATS.map((stat) => (
            <div key={stat} className="flex items-center gap-1.5 font-semibold uppercase tracking-wide" style={{ fontSize: '10px', color: COLORS.brand.periwinkle }}>
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.brand.periwinkle }} />
              {stat}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
