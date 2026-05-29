import Link from "next/link";
import type { SpaceWithPhotos } from "@/lib/queries/spaces";

type SpaceCardProps = {
  space: SpaceWithPhotos;
};

// Gradient palette for space cards (deterministic based on title length)
const gradients = [
  "linear-gradient(135deg, oklch(0.85 0.08 295), color-mix(in oklch, oklch(0.85 0.08 295) 60%, white))",
  "linear-gradient(135deg, oklch(0.88 0.12 80), color-mix(in oklch, oklch(0.88 0.12 80) 60%, white))",
  "linear-gradient(135deg, oklch(0.85 0.1 145), color-mix(in oklch, oklch(0.85 0.1 145) 60%, white))",
  "linear-gradient(135deg, oklch(0.82 0.15 200), color-mix(in oklch, oklch(0.82 0.15 200) 60%, white))",
  "linear-gradient(135deg, oklch(0.86 0.08 30), color-mix(in oklch, oklch(0.86 0.08 30) 60%, white))",
  "linear-gradient(135deg, oklch(0.84 0.12 260), color-mix(in oklch, oklch(0.84 0.12 260) 60%, white))",
];

function getGradient(title: string) {
  return gradients[title.length % gradients.length];
}

function getMatchScore(title: string) {
  // Deterministic mock score based on title char codes
  const sum = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 75 + (sum % 20);
}

export default function SpaceCard({ space }: SpaceCardProps) {
  const gradient = getGradient(space.title);
  const matchScore = getMatchScore(space.title);
  const coverPhoto = space.photos.find((p) => p.is_cover)?.url;

  const typeLabel =
    space.type === "showroom"
      ? "Showroom"
      : space.type === "popup"
      ? "Pop-up store"
      : space.type === "corner"
      ? "Corner"
      : space.type === "gallery"
      ? "Galerie"
      : "Boutique";

  return (
    <Link
      href={`/espaces/${space.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{ background: coverPhoto ? undefined : gradient }}
      >
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={space.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center opacity-60">
            <div className="h-12 w-12 rounded-md border-2 border-foreground/30" />
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-foreground uppercase shadow-card">
          {typeLabel}
        </span>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{space.title}</h3>
            <p className="text-xs text-muted-foreground">
              {space.district || space.city} · {space.city}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary whitespace-nowrap">
            Match {matchScore}%
          </span>
        </div>

        <div className="flex items-end justify-between pt-2">
          <div>
            <span className="text-lg font-semibold text-foreground">
              {Math.round(space.price_day).toLocaleString("fr-FR")}
            </span>
            <span className="text-xs text-muted-foreground"> € / jour</span>
            {space.area_sqm && (
              <p className="text-xs text-muted-foreground">{space.area_sqm} m²</p>
            )}
          </div>
          <span className="text-xs font-medium text-success">● Dispo</span>
        </div>
      </div>
    </Link>
  );
}
