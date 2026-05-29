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
    <section id="comment-ca-marche" className="bg-bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Comment ça marche</h2>
          <p className="mt-4 text-text-secondary">
            De la création de votre profil à la réservation en quelques étapes simples.
          </p>
        </div>

        {/* Wrapper relatif pour les connecteurs */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map(({ number, title, desc }, i) => (
            <div key={number} className="relative flex flex-col items-center text-center">
              {/* Ligne de connexion entre les cercles (desktop uniquement) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute top-7 hidden md:block"
                  style={{ left: 'calc(50% + 1.75rem)', right: 'calc(-50% + 1.75rem)', height: '1px', background: '#E5E5E5' }}
                />
              )}

              {/* Numéro */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg">
                {number}
              </div>

              <h3 className="mt-6 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
