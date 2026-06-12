'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Globe } from 'lucide-react'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'
import type { ReactNode } from 'react'

function CardReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>({ threshold: 0.15 })
  return (
    <div
      ref={ref}
      className="card-gradient-border rounded-2xl p-8 shadow-sm transition-all duration-700 ease-out"
      style={{
        opacity:         visible ? 1 : 0,
        transform:       visible ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: visible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
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
  const { ref: titleRef, visible: titleVisible }       = useRevealOnScroll<HTMLHeadingElement>()
  const { ref: subtitleRef, visible: subtitleVisible } = useRevealOnScroll<HTMLParagraphElement>({ threshold: 0.3 })

  return (
    <section id="comment-ca-marche" className="bg-white py-24">
      <style>{`
        @property --ba {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes spin-border {
          to { --ba: 360deg; }
        }
        .card-gradient-border {
          border: 1.5px solid transparent;
          background:
            linear-gradient(white, white) padding-box,
            conic-gradient(
              from var(--ba),
              #e2e8f0 0%,
              #818CF8 20%,
              #4361EE 40%,
              #A5B4FC 60%,
              #4361EE 80%,
              #e2e8f0 100%
            ) border-box;
          animation: spin-border 6s linear infinite;
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* En-tête centré avec animation au scroll */}
        <div className="text-center">
          <h2
            ref={titleRef}
            className="text-3xl font-bold text-foreground transition-all duration-700 ease-out"
            style={{
              opacity:   titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateY(0)' : 'translateY(28px)',
            }}
          >
            Comment ça marche&nbsp;?
          </h2>
          <p
            ref={subtitleRef}
            className="mt-4 text-text-secondary transition-all duration-700 ease-out"
            style={{
              opacity:          subtitleVisible ? 1 : 0,
              transform:        subtitleVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay:  subtitleVisible ? '150ms' : '0ms',
            }}
          >
            De votre profil marque à votre première expérience physique, en 3 étapes.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map(({ title, desc }, i) => (
            <CardReveal key={title} delay={i * 120}>
              <span className="text-primary text-xl leading-none">✦</span>
              <h3 className="mt-5 text-xl font-bold leading-snug text-foreground">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {desc}
              </p>
            </CardReveal>
          ))}
        </div>

      </div>

      {/* Bloc accompagnement */}
      <div className="mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-16 lg:flex-row">

            {/* Image avec badges flottants */}
            <div className="relative w-full shrink-0 lg:w-[480px]">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=960&q=80"
                  alt="Accompagnement Phyxel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>

              {/* Badge 1 */}
              <div className="absolute bottom-20 left-6 flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 shadow-md backdrop-blur-sm">
                <Plus size={16} className="text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">500 marques accompagnées</span>
              </div>

              {/* Badge 2 */}
              <div className="absolute bottom-6 left-10 flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 shadow-md backdrop-blur-sm">
                <Globe size={16} className="text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">Un réseau qualifié de partenaires et de lieux</span>
              </div>
            </div>

            {/* Texte */}
            <div className="flex-1">
              <h2 className="text-4xl font-bold leading-tight text-foreground">
                Choisissez l&apos;accompagnement{' '}
                <span className="shimmer-blue">qui vous convient le mieux&nbsp;!</span>
              </h2>

              <p className="mt-6 leading-relaxed text-text-secondary">
                Que vous souhaitiez gérer votre projet en autonomie ou être accompagné de A à Z,
                Phyxel vous aide à transformer votre présence digitale en expérience réelle.
              </p>

              <p className="mt-4 leading-relaxed text-text-secondary">
                Nous trouvons les lieux adaptés à votre marque et, si besoin, nous coordonnons
                également l&apos;ensemble de votre projet avec notre réseau de partenaires spécialisés.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#003D99]"
              >
                Demander un devis personnalisé
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
