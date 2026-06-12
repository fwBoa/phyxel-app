'use client'

import { useEffect, useRef } from 'react'

const PILLARS = [
  {
    title: 'Recommandations personnalisées',
    desc:  'Notre algorithme analyse votre profil marque pour ne proposer que les lieux qui matchent vraiment.',
  },
  {
    title: 'Gain de temps considérable',
    desc:  'Fini les heures de prospection. Trouvez le lieu idéal en moins d\'une heure, réservation incluse.',
  },
  {
    title: 'Lieux adaptés à votre budget',
    desc:  'Des espaces pour tous les budgets, filtrés selon vos capacités financières réelles.',
  },
  {
    title: 'Expérience mesurable',
    desc:  'Suivez vos performances physiques et mesurez l\'impact de chaque activation sur vos ventes.',
  },
]

const CARD_TOP    = 100  // px — position sticky de chaque card
const SCALE_STEP  = 0.04 // réduction de scale par card enterrée

export default function WhyPhyxelSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    function onScroll() {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        // La card est "enterrée" quand une card suivante la recouvre
        // On mesure combien la card est au-dessus du top sticky
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
  }, [])

  return (
    <section id="pourquoi-phyxel" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">

          {/* Titre à gauche — sticky */}
          <div className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-4xl font-bold leading-tight text-foreground">
                Pourquoi choisir Phyxel&nbsp;?
              </h2>
              <p className="mt-4 text-text-secondary">
                La marketplace qui comprend les marques e-commerce.
              </p>
            </div>
          </div>

          {/* Cards empilées */}
          <div className="flex flex-1 flex-col">
            {PILLARS.map(({ title, desc }, i) => (
              <div
                key={title}
                className="sticky"
                style={{ top: `${CARD_TOP}px`, zIndex: i + 1 }}
              >
                <div
                  ref={(el) => { cardRefs.current[i] = el }}
                  className="mb-4 origin-top rounded-2xl border border-border-custom bg-white p-8 shadow-sm transition-transform duration-75"
                >
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 leading-relaxed text-text-secondary">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
