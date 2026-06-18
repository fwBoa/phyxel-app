'use client'

import { Label } from '@/components/ui/label'
import type { OnboardingData } from '@/types/onboarding'
import { DISTRICT_OPTIONS, AMBIANCE_OPTIONS } from '@/types/onboarding'
import TogglePill from './TogglePill'

export default function StepPreferences({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
}) {
  const toggleDistrict = (val: string) => {
    const set = new Set(data.preferredDistricts)
    if (set.has(val)) set.delete(val)
    else set.add(val)
    onChange({ preferredDistricts: Array.from(set) })
  }

  const toggleAmbiance = (val: string) => {
    const set = new Set(data.desiredAmbiance)
    if (set.has(val)) set.delete(val)
    else set.add(val)
    onChange({ desiredAmbiance: Array.from(set) })
  }

  const [startDate, endDate] = (data.idealDates ?? '').split(' → ')

  function handleDateChange(start: string, end: string) {
    const both = start && end ? `${start} → ${end}` : start || end || ''
    onChange({ idealDates: both })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Préférences
      </h2>
      <p className="text-muted-foreground">
        Affinez vos critères pour des recommandations sur mesure.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Quartiers préférés</Label>
          <div className="flex flex-wrap gap-2">
            {DISTRICT_OPTIONS.map((opt) => (
              <TogglePill
                key={opt}
                label={opt}
                selected={data.preferredDistricts.includes(opt)}
                onClick={() => toggleDistrict(opt)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ambiance recherchée</Label>
          <div className="flex flex-wrap gap-2">
            {AMBIANCE_OPTIONS.map((opt) => (
              <TogglePill
                key={opt}
                label={opt}
                selected={data.desiredAmbiance.includes(opt)}
                onClick={() => toggleAmbiance(opt)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dates idéales</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Date de début</span>
              <input
                type="date"
                value={startDate ?? ''}
                onChange={(e) => handleDateChange(e.target.value, endDate ?? '')}
                className="rounded-xl border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Date de fin</span>
              <input
                type="date"
                value={endDate ?? ''}
                min={startDate ?? ''}
                onChange={(e) => handleDateChange(startDate ?? '', e.target.value)}
                className="rounded-xl border border-input px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
