'use client'

import { useMemo } from 'react'
import type { OnboardingData } from '@/types/onboarding'

export default function StepSummary({ data }: { data: OnboardingData }) {
  const rows = useMemo(
    () => [
      { label: 'Secteur', value: data.sector },
      { label: 'Produits', value: data.productTypes.join(', ') || '—' },
      { label: 'Taille', value: data.companySize || '—' },
      { label: 'Budget approx.', value: data.approxBudget || '—' },
      { label: 'Objectifs', value: data.physicalObjectives.join(', ') || '—' },
      { label: 'Ville recherchée', value: data.targetCity || '—' },
      { label: 'Durée', value: data.desiredDuration || '—' },
      { label: 'Types de lieu', value: data.spaceTypes.join(', ') || '—' },
      { label: 'Surface', value: data.desiredArea || '—' },
      { label: 'Services', value: data.neededServices.join(', ') || '—' },
      { label: 'Quartiers', value: data.preferredDistricts.join(', ') || '—' },
      { label: 'Ambiance', value: data.desiredAmbiance.join(', ') || '—' },
      { label: 'Dates idéales', value: data.idealDates || '—' },
    ],
    [data]
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Récapitulatif
      </h2>
      <p className="text-muted-foreground">
        Vérifiez vos informations avant de découvrir vos recommandations.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border bg-card p-3 text-card-foreground"
          >
            <div className="text-xs font-medium text-muted-foreground">
              {label}
            </div>
            <div className="mt-1 text-sm font-medium">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
