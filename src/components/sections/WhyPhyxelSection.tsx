'use client'

import { useEffect, useRef } from 'react'
import { Check, Clock, PersonStanding, TrendingUp } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import ScrollReveal from '@/components/motion/ScrollReveal'

const PILLARS = [
  {
    title:   'Recommandations personnalisées',
    desc:    'Notre algorithme analyse votre profil marque pour ne proposer que les lieux qui matchent vraiment.',
    Icon:    Check,
    iconBg:  '#6B7FD7',
    iconColor: '#ffffff',
  },
  {
    title:   'Gain de temps considérable',
    desc:    'Fini les heures de prospection. Trouvez le lieu idéal en moins d\'une heure, réservation incluse.',
    Icon:    Clock,
    iconBg:  '#D6E4F7',
    iconColor: '#1E3A8A',
  },
  {
    title:   'Lieux adaptés à votre budget',
    desc:    'Des espaces pour tous les budgets, filtrés selon vos capacités financières réelles.',
    Icon:    PersonStanding,
    iconBg:  '#3B5BDB',
    iconColor: '#93C5FD',
  },
  {
    title:   'Expérience mesurable',
    desc:    'Suivez vos performances physiques et mesurez l\'impact de chaque activation sur vos ventes.',
    Icon:    TrendingUp,
    iconBg:  'var(--color-brand-muted)',
    iconColor: 'var(--color-brand-primary)',
  },
]

const CARD_TOP   = 100
const SCALE_STEP = 0.04

export default function WhyPhyxelSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    function onScroll() {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        const buried = CARD_TOP - rect.top
        if (buried > 0) {
          const depth = Math.min(buried / card.offsetHeight, 1)
          const scale = 1 - depth * SCALE_STEP * (PILLARS.length - 1 - i)
          card.style.transform = `scale(${Math.max(scale, 1 - SCALE_STEP * (PILLARS.length - 1))})`
        } else {
          card.style.transform = 'scale(1)'
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduce])

  return (
    <section id="pourquoi-phyxel" className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-10 lg:flex-row lg:gap-16">

          {/* Titre à gauche — sticky */}
          <div className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <ScrollReveal>
                <h2 className="text-[22px] font-bold leading-tight text-foreground sm:text-4xl">
                  Pourquoi choisir Phyxel&nbsp;?
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className="mt-3 text-sm text-text-secondary sm:mt-4 sm:text-base">
                  La marketplace qui comprend les marques e-commerce.
                </p>
              </ScrollReveal>
            </div>
          </div>

          {/* Cards empilées */}
          <div className="flex flex-1 flex-col">
            {PILLARS.map(({ title, desc, Icon, iconBg, iconColor }, i) => (
              <motion.div
                key={title}
                className="sticky"
                style={{ top: `${CARD_TOP}px`, zIndex: i + 1 }}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  ref={(el) => { cardRefs.current[i] = el }}
                  className="mb-3 origin-top rounded-2xl border border-border-custom bg-white p-4 shadow-sm transition-transform duration-75 sm:mb-4 sm:p-8"
                >
                  <div
                    className="mb-3 inline-flex size-10 items-center justify-center rounded-full sm:mb-5 sm:size-12"
                    style={{
                      backgroundColor: iconBg,
                      animation: `iconLoop 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    }}
                  >
                    <Icon className="size-4 sm:size-5" style={{ color: iconColor }} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground sm:text-lg">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:mt-2">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
