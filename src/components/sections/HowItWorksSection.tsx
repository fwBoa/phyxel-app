const STEPS = [
  {
    number: '1',
    title:  'Créez votre profil marque',
    desc:   'Décrivez votre marque, vos besoins et votre budget en 5 minutes. Notre algorithme analyse votre profil pour vous proposer les espaces les plus pertinents.',
  },
  {
    number: '2',
    title:  'Recevez vos recommandations',
    desc:   'Accédez en 2 clics à une sélection personnalisée d\'espaces avec un score de matching. Comparez, filtrez, et trouvez l\'espace idéal.',
  },
  {
    number: '3',
    title:  'Réservez en 48h',
    desc:   'Envoyez votre demande directement au propriétaire. Confirmation sous 48h, suivi de votre réservation et mesure des performances inclus.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-[#F9F9F9] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0A0A0A]">Comment ça marche</h2>
          <p className="mt-4 text-[#6B6B6B]">
            De la création de votre profil à la réservation en quelques étapes simples.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map(({ number, title, desc }) => (
            <div key={number} className="relative flex flex-col items-center text-center">
              {/* Numéro */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E91E8C] text-xl font-bold text-white shadow-lg">
                {number}
              </div>

              {/* Ligne de connexion (desktop) */}
              {number !== '3' && (
                <div
                  aria-hidden
                  className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-4rem)] bg-[#E5E5E5] md:block"
                />
              )}

              <h3 className="mt-6 text-lg font-semibold text-[#0A0A0A]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
