'use client'

import { ONBOARDING_STEPS } from '@/types/onboarding'

export default function StepHeader({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Étape {step} sur {total}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {ONBOARDING_STEPS[step - 1]?.label}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
