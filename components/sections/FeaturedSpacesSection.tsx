import Link from "next/link";
import SpaceCard from "@/components/ui/SpaceCard";

const spaces = [
  {
    title: "Loft Haussmann",
    type: "Showroom",
    city: "Paris",
    district: "8e",
    priceDay: 1200,
    areaSqm: 80,
    matchScore: 91,
    gradient: "linear-gradient(135deg, oklch(0.85 0.08 295), color-mix(in oklch, oklch(0.85 0.08 295) 60%, white))",
    slug: "loft-haussmann",
  },
  {
    title: "Corner Marais",
    type: "Pop-up store",
    city: "Paris",
    district: "3e",
    priceDay: 850,
    areaSqm: 45,
    matchScore: 87,
    gradient: "linear-gradient(135deg, oklch(0.88 0.12 80), color-mix(in oklch, oklch(0.88 0.12 80) 60%, white))",
    slug: "corner-marais",
  },
  {
    title: "Appartement Saint-Germain",
    type: "Corner",
    city: "Paris",
    district: "6e",
    priceDay: 970,
    areaSqm: 60,
    matchScore: 82,
    gradient: "linear-gradient(135deg, oklch(0.85 0.1 145), color-mix(in oklch, oklch(0.85 0.1 145) 60%, white))",
    slug: "appt-st-germain",
  },
];

export default function FeaturedSpacesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Espaces à la une
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sélection premium de lieux disponibles cette semaine.
          </p>
        </div>
        <Link
          href="/search"
          className="hidden text-sm font-medium text-primary hover:underline md:inline"
        >
          Voir tous les espaces →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.slug} {...space} />
        ))}
      </div>
    </section>
  );
}
