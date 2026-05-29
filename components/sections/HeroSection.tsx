import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
      <div className="absolute -top-40 -right-40 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground shadow-card">
          Marketplace phygitale
        </span>

        <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          Trouvez le lieu physique idéal pour{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            faire vivre votre marque
          </span>{" "}
          e-commerce
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Phyxel recommande des pop-up stores, showrooms, corners et espaces
          événementiels adaptés à votre budget, votre cible et vos objectifs.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-elegant hover:opacity-90"
          >
            Trouver mon lieu →
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Explorer les espaces
          </Link>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center gap-2 rounded-full border border-border bg-card p-2 shadow-card">
          <div className="flex-1 px-4 py-2 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ville
            </p>
            <p className="text-sm text-foreground">Paris</p>
          </div>
          <span className="hidden h-8 w-px bg-border md:block" />
          <div className="flex-1 px-4 py-2 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Dates
            </p>
            <p className="text-sm text-foreground">Juin 10 – 17</p>
          </div>
          <span className="hidden h-8 w-px bg-border md:block" />
          <div className="flex-1 px-4 py-2 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Type de lieu
            </p>
            <p className="text-sm text-foreground">Tous</p>
          </div>
          <Link
            href="/search"
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Rechercher
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <span>● +340 espaces disponibles</span>
          <span>● 12 villes en France</span>
          <span>● Réservation en 48h</span>
        </div>
      </div>
    </section>
  );
}
