const steps = [
  {
    number: "1",
    title: "Complétez votre profil marque",
    description:
      "Secteur, objectifs, budget, cible — Phyxel apprend à connaître votre marque en 5 minutes.",
  },
  {
    number: "2",
    title: "Recevez des lieux recommandés",
    description:
      "Notre algorithme sélectionne les espaces les plus compatibles avec votre marque et votre budget.",
  },
  {
    number: "3",
    title: "Réservez et lancez votre expérience",
    description:
      "Demande de réservation en 2 clics, confirmation sous 48h, et votre pop-up prend vie.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Comment ça marche ?
        </h2>
        <p className="mt-3 text-muted-foreground">
          De votre profil marque à votre première expérience physique, en 3 étapes.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {step.number}
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
