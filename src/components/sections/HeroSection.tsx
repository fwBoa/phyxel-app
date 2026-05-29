import SearchBar from '@/components/features/SearchBar'

const STATS = [
  { value: '+340', label: 'espaces disponibles' },
  { value: '12',   label: 'villes en France' },
  { value: '48h',  label: 'pour réserver' },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Fond décoratif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #E91E8C 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Titre */}
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#0A0A0A] sm:text-6xl">
          Trouvez le lieu physique idéal{' '}
          <span style={{ color: '#E91E8C' }}>pour faire vivre</span>{' '}
          votre marque e-commerce
        </h1>

        {/* Sous-titre */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#6B6B6B]">
          Phyxel vous recommande les espaces physiques les plus adaptés à votre marque —
          showrooms, pop-ups, corners — et vous permet de réserver en quelques clics.
        </p>

        {/* Barre de recherche */}
        <div className="mt-10">
          <SearchBar variant="hero" />
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-16">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-3xl font-bold text-[#0A0A0A]">{value}</span>
              <span className="mt-1 text-sm text-[#9B9B9B]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
