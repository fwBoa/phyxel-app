import Link from "next/link";

type SpaceCardProps = {
  title: string;
  type: string;
  city: string;
  district: string;
  priceDay: number;
  areaSqm: number;
  matchScore: number;
  gradient: string;
  slug: string;
};

export default function SpaceCard({
  title,
  type,
  city,
  district,
  priceDay,
  areaSqm,
  matchScore,
  gradient,
  slug,
}: SpaceCardProps) {
  return (
    <Link
      href={`/place/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 grid place-items-center opacity-60">
          <div className="h-12 w-12 rounded-md border-2 border-foreground/30" />
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-foreground uppercase shadow-card">
          {type}
        </span>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {district} · {city}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary whitespace-nowrap">
            Match {matchScore}%
          </span>
        </div>

        <div className="flex items-end justify-between pt-2">
          <div>
            <span className="text-lg font-semibold text-foreground">{priceDay}</span>
            <span className="text-xs text-muted-foreground"> € / jour</span>
            <p className="text-xs text-muted-foreground">{areaSqm} m²</p>
          </div>
          <span className="text-xs font-medium text-success">● Dispo</span>
        </div>
      </div>
    </Link>
  );
}
