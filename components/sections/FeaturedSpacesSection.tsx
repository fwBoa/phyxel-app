import Link from "next/link";
import SpaceCard from "@/components/ui/SpaceCard";
import type { SpaceWithPhotos } from "@/lib/queries/spaces";

type FeaturedSpacesSectionProps = {
  spaces: SpaceWithPhotos[];
};

export default function FeaturedSpacesSection({ spaces }: FeaturedSpacesSectionProps) {
  if (spaces.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Espaces à la une</h2>
          <p className="mt-2 text-sm text-muted-foreground">Aucun espace disponible pour le moment.</p>
        </div>
      </section>
    );
  }

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
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </section>
  );
}
