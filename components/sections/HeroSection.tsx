import Link from 'next/link'
import { SearchBar } from '@/components/features/SearchBar'
import { ArrowRight } from 'lucide-react'

const STATS = [
  { dot: true,  label: '+340 espaces disponibles' },
  { dot: true,  label: '12 villes en France' },
  { dot: true,  label: 'Réservation en 48h' },
]

export function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Blobs décoratifs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EDE9FE] rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EDE9FE] rounded-full blur-3xl opacity-40 -translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Label */}
        <p className="text-xs font-semibold tracking-[0.2em] text-[#7C3AED] uppercase mb-6">
          Marketplace Phygitale
        </p>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A0A0A] leading-tight mb-6">
          Trouvez le lieu physique
          <br />
          idéal pour{' '}
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
            faire vivre votre
            <br />
            marque
          </span>{' '}
          e-commerce
        </h1>

        {/* Sous-titre */}
        <p className="text-[#6B7280] text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Phyxel recommande des pop-up stores, showrooms, corners et espaces événementiels adaptés à votre budget, votre cible et vos objectifs.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-white font-medium rounded-full hover:bg-[#333] transition-colors"
          >
            Trouver mon lieu <ArrowRight size={16} />
          </Link>
          <Link href="/explorer" className="text-sm text-[#6B7280] hover:text-[#0A0A0A] transition-colors">
            Explorer les espaces
          </Link>
        </div>

        {/* SearchBar */}
        <div className="max-w-2xl mx-auto mb-10">
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {STATS.map(s => (
            <div key={s.label} className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
