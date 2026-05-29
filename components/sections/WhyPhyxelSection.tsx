const reasons = [
  {
    icon: "✦",
    title: "Recommandations personnalisées",
    description:
      "Notre algorithme analyse votre profil marque pour ne proposer que les lieux qui matchent vraiment.",
  },
  {
    icon: "✦",
    title: "Gain de temps considérable",
    description:
      "Fini les heures de prospection. Trouvez le lieu idéal en moins d'une heure, réservation incluse.",
  },
  {
    icon: "✦",
    title: "Lieux adaptés à votre budget",
    description:
      "Des espaces pour tous les budgets, filtrés selon vos capacités financières réelles.",
  },
  {
    icon: "✦",
    title: "Expérience mesurable",
    description:
      "Suivez vos performances physiques et mesurez l'impact de chaque activation sur vos ventes.",
  },
];

export default function WhyPhyxelSection() {
  return (
    <section id="why" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Pourquoi choisir Phyxel ?
          </h2>
          <p className="mt-3 text-muted-foreground">
            La marketplace qui comprend les marques e-commerce.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-accent-foreground">
                {reason.icon}
              </div>
              <h3 className="font-semibold text-foreground">{reason.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
