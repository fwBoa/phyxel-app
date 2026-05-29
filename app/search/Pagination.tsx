import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  filters: Record<string, string | undefined>;
}

export default function Pagination({ page, totalPages, total, filters }: PaginationProps) {
  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    if (p > 1) params.set("page", p.toString());
    return `/search?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <Link
          href={buildUrl(page - 1)}
          className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
            page <= 1
              ? "pointer-events-none opacity-50 bg-muted text-muted-foreground border-border"
              : "bg-background text-foreground border-border hover:border-foreground"
          }`}
        >
          ← Précédent
        </Link>

        <span className="text-sm text-muted-foreground px-2">
          Page {page} / {totalPages}
        </span>

        <Link
          href={buildUrl(page + 1)}
          className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
            page >= totalPages
              ? "pointer-events-none opacity-50 bg-muted text-muted-foreground border-border"
              : "bg-background text-foreground border-border hover:border-foreground"
          }`}
        >
          Suivant →
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">
        {total} résultat{total > 1 ? "s" : ""} au total
      </p>
    </div>
  );
}
