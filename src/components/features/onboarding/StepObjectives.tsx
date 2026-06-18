'use client'

import type { OnboardingData } from '@/types/onboarding'
import { PHYSICAL_OBJECTIVES_OPTIONS } from '@/types/onboarding'
import TogglePill from './TogglePill'

export default function StepObjectives({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
}) {
  const toggle = (val: string) => {
    const set = new Set(data.physicalObjectives)
    if (set.has(val)) set.delete(val)
    else set.add(val)
    onChange({ physicalObjectives: Array.from(set) })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Vos objectifs en physique
      </h2>
      <p className="text-muted-foreground">
        Qu&apos;est-ce que vous cherchez à accomplir avec un espace temporaire ?
      </p>

      <div className="flex flex-wrap gap-3">
        {PHYSICAL_OBJECTIVES_OPTIONS.map((opt) => (
          <TogglePill
            key={opt}
            label={opt}
            selected={data.physicalObjectives.includes(opt)}
            onClick={() => toggle(opt)}
          />
        ))}
      </div>
    </div>
  )
}
