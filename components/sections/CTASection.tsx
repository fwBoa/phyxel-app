import Link from "next/link";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div
        className="overflow-hidden rounded-3xl border border-border p-12 text-center shadow-elegant"
        style={{ background: "var(--gradient-hero)" }}
      >
        <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl">
          Prêt à passer du digital au réel ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
          Créez votre compte gratuitement et recevez vos premières
          recommandations en 5 minutes.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90"
        >
          Commencer gratuitement →
        </Link>
      </div>
    </section>
  );
}
