"use client";

import Link from "next/link";

interface FilterOption {
  value: string;
  label: string;
}

type SearchFiltersProps = {
  cities: string[];
  types: FilterOption[];
  currentFilters: Record<string, string | undefined>;
};

export default function SearchFilters({
  cities,
  types,
  currentFilters,
}: SearchFiltersProps) {
  const buildUrl = (key: string, value: string | null) => {
    const params = new URLSearchParams();

    // Preserve existing filters except the one being changed
    Object.entries(currentFilters).forEach(([k, v]) => {
      if (v && k !== key) params.set(k, v);
    });

    // Set or remove the new filter
    if (value) params.set(key, value);

    return `/search?${params.toString()}`;
  };

  const clearUrl = () => "/search";

  const hasActiveFilters = Object.values(currentFilters).some((v) => v !== undefined);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* City filter */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl("city", null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              !currentFilters.city
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground"
            }`}
          >
            Toutes les villes
          </Link>
          {cities.map((city) => (
            <Link
              key={city}
              href={buildUrl("city", city)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                currentFilters.city === city
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground"
              }`}
            >
              {city}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildUrl("type", null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
              !currentFilters.type
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground"
            }`}
          >
            Tous les types
          </Link>
          {types.map((t) => (
            <Link
              key={t.value}
              href={buildUrl("type", t.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                currentFilters.type === t.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Link
          href={clearUrl()}
          className="inline-block text-xs text-primary hover:underline"
        >
          Réinitialiser les filtres
        </Link>
      )}
    </div>
  );
}
