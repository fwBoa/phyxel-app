const STEPS = [
  {
    num:   '1',
    title: 'Complétez votre profil marque',
    desc:  'Secteur, objectifs, budget, cible — Phyxel apprend à connaître votre marque en 5 minutes.',
  },
  {
    num:   '2',
    title: 'Recevez des lieux recommandés',
    desc:  'Notre algorithme sélectionne les espaces les plus compatibles avec votre marque et votre budget.',
  },
  {
    num:   '3',
    title: 'Réservez et lancez votre expérience',
    desc:  'Demande de réservation en 2 clics, confirmation sous 48h, et votre pop-up prend vie.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-3">Comment ça marche ?</h2>
          <p className="text-[#6B7280] text-sm">
            De votre profil marque à votre première expérience physique, en 3 étapes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(step => (
            <div key={step.num} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] text-sm font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-[#0A0A0A] mb-2 leading-snug">{step.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
