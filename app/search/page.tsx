import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpaceCard from "@/components/ui/SpaceCard";
import { getAllSpaces, getSpaceCities } from "@/lib/queries/spaces";
import SearchFilters from "./SearchFilters";
import Pagination from "./Pagination";

export const revalidate = 60;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const limit = 6;

  const filters = {
    city: params.city,
    type: params.type,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    page,
    limit,
  };

  const [result, cities] = await Promise.all([
    getAllSpaces(filters),
    getSpaceCities(),
  ]);

  const { spaces, total } = result;
  const totalPages = Math.ceil(total / limit);

  const types = [
    { value: "showroom", label: "Showroom" },
    { value: "popup", label: "Pop-up store" },
    { value: "corner", label: "Corner" },
    { value: "gallery", label: "Galerie" },
    { value: "boutique", label: "Boutique" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Explorer les espaces
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total} espace{total > 1 ? "s" : ""} disponible
            {total > 1 ? "s" : ""} pour votre prochaine expérience
            physique.
          </p>
        </div>

        <SearchFilters cities={cities} types={types} currentFilters={params} />

        {spaces.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              filters={params}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-card">
            <p className="text-muted-foreground">
              Aucun espace ne correspond à vos critères.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Essayez d&apos;élargir votre recherche ou de modifier les filtres.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
