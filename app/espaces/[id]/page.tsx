import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSpaceById } from "@/lib/queries/spaces";
import BookingForm from "./BookingForm";

export const revalidate = 60;

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const space = await getSpaceById(id);

  if (!space) {
    return notFound();
  }

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

  const coverPhoto = space.photos.find((p) => p.is_cover)?.url;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <a href="/search" className="hover:text-foreground transition-colors">
            Explorer
          </a>
          {" "}<span>/</span>{" "}
          <span className="text-foreground">{space.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column: photos + description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-secondary"
              >
                {coverPhoto ? (
                  <img
                    src={coverPhoto}
                    alt={space.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-20 w-20 rounded-xl border-2 border-foreground/20" />
                  </div>
                )}
                <span className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-card"
                >
                  {typeLabel}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {space.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {space.district && (
                  <span>📍 {space.district}, {space.city}</span>
                )}
                {space.area_sqm && <span>📐 {space.area_sqm} m²</span>}
                <span className="text-success font-medium">● Disponible</span>
              </div>

              {space.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {space.description}
                </p>
              )}
            </div>
          </div>

          {/* Right column: booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-elegant"
            >
              <div className="mb-4">
                <span className="text-3xl font-semibold text-foreground">
                  {Math.round(space.price_day).toLocaleString("fr-FR")} €
                </span>
                <span className="text-muted-foreground"> / jour</span>
              </div>

              <BookingForm spaceId={space.id} priceDay={space.price_day} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
