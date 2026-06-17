import SearchBar from '@/components/features/SearchBar'
import { COLORS } from '@/constants/colors'

const STATS = [
  '+340 espaces disponibles',
  '12 villes en France',
  'Réservation en 48h',
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
{/* Fond décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full opacity-10 bg-[radial-gradient(circle,#0052CC_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Titre */}
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
          Trouvez le lieu physique idéal pour{' '}
          <span className="shimmer-blue">
            faire vivre votre marque
          </span>{' '}
          e-commerce
        </h1>

        {/* Sous-titre */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
          Phyxel vous recommande les espaces physiques les plus adaptés à votre marque —
          showrooms, pop-ups, corners — et vous permet de réserver en quelques clics.
        </p>

        {/* Boutons de navigation */}
        <div className="mt-10 flex justify-center gap-2">
          <button className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white">
            Trouver mon lieu
          </button>
          <button className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors">
            Explorer les espaces
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mt-4">
          <SearchBar variant="hero" />
        </div>

        {/* Stats */}
        <div className="mt-5 flex flex-wrap justify-center gap-6">
          {STATS.map((stat) => (
            <div key={stat} className="flex items-center gap-1.5 font-semibold uppercase tracking-wide" style={{ fontSize: '12px', color: COLORS.brand.periwinkle }}>
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.brand.periwinkle }} />
              {stat}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
