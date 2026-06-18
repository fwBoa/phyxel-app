'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Globe } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import ScrollReveal from '@/components/motion/ScrollReveal'
import StaggerContainer, { StaggerItem } from '@/components/motion/StaggerContainer'
import type { ReactNode } from 'react'

function CardReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="card-gradient-border rounded-2xl p-8 shadow-sm"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const STEPS = [
  {
    title: 'Complétez votre profil marque',
    desc:  'Secteur, objectifs, budget, cible — Phyxel apprend à connaître votre marque en 5 minutes.',
  },
  {
    title: 'Recevez des lieux recommandés',
    desc:  'Notre algorithme sélectionne les espaces compatibles avec votre marque et votre budget.',
  },
  {
    title: 'Réservez et lancez votre expérience',
    desc:  'Demande de réservation en 2 clics, confirmation sous 48h, et votre pop-up prend vie.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="bg-white py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* En-tête centré avec animation au scroll */}
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-[22px] font-bold text-foreground sm:text-3xl">
              Comment ça marche&nbsp;?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mt-3 text-sm text-text-secondary sm:mt-4 sm:text-base">
              De votre profil marque à votre première expérience physique, en 3 étapes.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {STEPS.map(({ title, desc }, i) => (
            <CardReveal key={title} delay={i * 0.12}>
              <span className="text-primary text-base leading-none sm:text-lg">✦</span>
              <h3 className="mt-3 text-base font-bold leading-snug text-foreground sm:mt-4 sm:text-lg">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {desc}
              </p>
            </CardReveal>
          ))}
        </div>

      </div>

      {/* Bloc accompagnement */}
      <div className="mt-16 py-10 sm:mt-24 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-20">

            {/* Image avec badges flottants */}
            <ScrollReveal className="relative w-full shrink-0 lg:w-[520px]" y={40}>
              <div className="relative overflow-hidden rounded-[24px] aspect-[4/3] sm:rounded-[32px]">
                <Image
                  src="/assets/img/boutique-accompagnement.jpg"
                  alt="Accompagnement Phyxel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 520px"
                  priority
                />
              </div>

              {/* Badge 1 */}
              <div className="absolute bottom-[38%] left-[4%] flex items-center gap-2 rounded-xl bg-white/40 px-3 py-2 shadow-sm backdrop-blur-md sm:left-[8%] sm:px-4 sm:py-2.5">
                <Plus size={16} className="text-[#0052CC] shrink-0" strokeWidth={2.5} />
                <span className="text-xs font-medium text-[#0A0A0A] sm:text-sm">500 marques accompagnées</span>
              </div>

              {/* Badge 2 */}
              <div className="absolute bottom-[18%] left-[4%] flex items-center gap-2 rounded-xl bg-white/40 px-3 py-2 shadow-sm backdrop-blur-md sm:left-[8%] sm:px-4 sm:py-2.5">
                <Globe size={16} className="text-[#0052CC] shrink-0" strokeWidth={2.5} />
                <span className="text-xs font-medium text-[#0A0A0A] sm:text-sm">Un réseau qualifié de partenaires et de lieux</span>
              </div>
            </ScrollReveal>

            {/* Texte */}
            <StaggerContainer className="flex-1 max-w-lg" staggerDelay={0.12}>
              <StaggerItem>
              <h2 className="text-[22px] font-bold leading-tight text-[#0A0A0A] sm:text-[42px] sm:leading-[1.15]">
                  Choisissez l&apos;accompagnement{' '}
                  <span className="shimmer-blue">qui vous convient le mieux&nbsp;!</span>
                </h2>
              </StaggerItem>

              <StaggerItem>
                <p className="mt-4 text-sm leading-relaxed text-[#6B6B6B] sm:mt-6 sm:text-base sm:text-lg">
                  Que vous souhaitiez gérer votre projet en autonomie ou être accompagné de A à Z,
                  Phyxel vous aide à transformer votre présence digitale en expérience réelle.
                </p>
              </StaggerItem>

              <StaggerItem>
                <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B] sm:mt-4 sm:text-base sm:text-lg">
                  Nous trouvons les lieux adaptés à votre marque et, si besoin, nous coordonnons
                  également l&apos;ensemble de votre projet avec notre réseau de partenaires spécialisés.
                </p>
              </StaggerItem>

              <StaggerItem>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center rounded-full bg-[#0052CC] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#003D99] sm:mt-8 sm:px-7 sm:py-3.5"
                >
                  Demander un devis personnalisé
                </Link>
              </StaggerItem>
            </StaggerContainer>

          </div>
        </div>
      </div>

      {/* Carrousel de tags animé */}
      <div className="mt-12 overflow-hidden sm:mt-24">
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex min-w-full shrink-0 items-center gap-8 py-3">
            {Array.from({ length: 4 }).flatMap((_, i) =>
              TAGS.map((tag) => (
                <span
                  key={`a-${i}-${tag}`}
                  className="inline-flex shrink-0 items-center rounded-full border border-[#D1D5DB] px-8 py-3 text-lg font-medium text-[#9CA3AF]"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
          <div className="animate-marquee flex min-w-full shrink-0 items-center gap-8 py-3" aria-hidden>
            {Array.from({ length: 4 }).flatMap((_, i) =>
              TAGS.map((tag) => (
                <span
                  key={`b-${i}-${tag}`}
                  className="inline-flex shrink-0 items-center rounded-full border border-[#D1D5DB] px-8 py-3 text-lg font-medium text-[#9CA3AF]"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="relative flex overflow-hidden">
          <div className="animate-marquee-reverse flex min-w-full shrink-0 items-center gap-8 py-3">
            {Array.from({ length: 4 }).flatMap((_, i) =>
              TAGS_REVERSE.map((tag) => (
                <span
                  key={`c-${i}-${tag}`}
                  className="inline-flex shrink-0 items-center rounded-full border border-[#D1D5DB] px-8 py-3 text-lg font-medium text-[#9CA3AF]"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
          <div className="animate-marquee-reverse flex min-w-full shrink-0 items-center gap-8 py-3" aria-hidden>
            {Array.from({ length: 4 }).flatMap((_, i) =>
              TAGS_REVERSE.map((tag) => (
                <span
                  key={`d-${i}-${tag}`}
                  className="inline-flex shrink-0 items-center rounded-full border border-[#D1D5DB] px-8 py-3 text-lg font-medium text-[#9CA3AF]"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

    </section>
  )
}

const TAGS = [
  'Recherche de lieux',
  'Expérience de marque',
  'Stratégie retail',
  'Budget maîtrisé',
  'Sur-mesure',
  'Accompagnement sur-mesure',
  'Expert dédié',
]

const TAGS_REVERSE = [
  'Gestion complète',
  'Expert dédié',
  'Accompagnement sur-mesure',
  'Conseil stratégique',
  'Budget maîtrisé',
  'Expérience de marque',
  'Recherche de lieux',
]
