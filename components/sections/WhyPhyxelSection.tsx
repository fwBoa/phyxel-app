const REASONS = [
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

export function WhyPhyxelSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-3">Pourquoi choisir Phyxel ?</h2>
          <p className="text-[#6B7280] text-sm">La marketplace qui comprend les marques e-commerce.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REASONS.map(r => (
            <div key={r.title} className="border border-[#E5E7EB] rounded-2xl p-6 hover:border-[#7C3AED]/30 hover:shadow-sm transition-all">
              <div className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] text-sm font-bold mb-4">
                +
              </div>
              <h3 className="font-semibold text-[#0A0A0A] mb-2">{r.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
