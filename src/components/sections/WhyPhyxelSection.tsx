const PILLARS = [
  {
    icon:  '✦',
    title: 'Recommandations personnalisées',
    desc:  'Notre algorithme analyse votre marque et vos objectifs pour vous proposer uniquement les espaces vraiment adaptés.',
  },
  {
    icon:  '⚡',
    title: 'Gain de temps radical',
    desc:  'Fini la prospection manuelle. Trouvez et contactez le bon espace en quelques minutes, pas en plusieurs semaines.',
  },
  {
    icon:  '●',
    title: 'Flexibilité budgétaire',
    desc:  'Des options pour tous les budgets — du corner ponctuel au showroom longue durée. Vous maîtrisez vos coûts.',
  },
  {
    icon:  '◎',
    title: 'Performance mesurable',
    desc:  'Suivez l\'impact de chaque pop-up grâce à votre tableau de bord : trafic, conversions, retour sur investissement.',
  },
]

export default function WhyPhyxelSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0A0A0A]">Pourquoi choisir Phyxel</h2>
          <p className="mt-4 text-[#6B6B6B]">
            Une plateforme pensée pour les marques e-commerce qui veulent passer au physique.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-2xl border border-[#E5E5E5] p-6 text-center transition-shadow hover:shadow-md"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
                style={{ background: '#FDE8F4', color: '#E91E8C' }}
              >
                {icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#0A0A0A]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
