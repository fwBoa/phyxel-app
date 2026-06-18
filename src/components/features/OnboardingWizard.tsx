'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { saveOnboarding } from '@/app/onboarding/actions'
import { EMPTY_ONBOARDING_DATA, type OnboardingData } from '@/types/onboarding'
import StepHeader from './onboarding/StepHeader'
import StepBrandInfo from './onboarding/StepBrandInfo'
import StepObjectives from './onboarding/StepObjectives'
import StepSpaceNeeds from './onboarding/StepSpaceNeeds'
import StepPreferences from './onboarding/StepPreferences'
import StepSummary from './onboarding/StepSummary'

const STORAGE_KEY = 'phyxel_onboarding_draft'

type WizardProps = {
  mode?: 'create' | 'edit'
  initialData?: OnboardingData
  onSave?: (data: OnboardingData) => Promise<void>
}

export default function OnboardingWizard({ mode = 'create', initialData, onSave }: WizardProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData ?? EMPTY_ONBOARDING_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'edit' || initialData) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as OnboardingData
        setData((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore corrupted storage
    }
  }, [mode, initialData])

  useEffect(() => {
    if (mode === 'edit') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // ignore storage errors
    }
  }, [data, mode])

  const update = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }, [])

  const isStepValid = useCallback((s: number) => {
    switch (s) {
      case 1: return !!(data.sector && data.companySize)
      case 2: return data.physicalObjectives.length > 0
      case 3: return !!(data.targetCity && data.desiredDuration && data.spaceTypes.length > 0)
      case 4: return true
      case 5: return true
      default: return false
    }
  }, [data])

  const goNext = () => { if (step < 5 && isStepValid(step)) setStep((p) => p + 1) }
  const goBack = () => { if (step > 1) setStep((p) => p - 1) }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      if (onSave) {
        await onSave(data)
      } else {
        await saveOnboarding(data)
      }
      if (mode === 'create') localStorage.removeItem(STORAGE_KEY)
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.'
      setError(msg)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[38%] shrink-0 lg:block">
        <Image
          key={step}
          src={`/assets/img/image-${step}.jpg`}
          alt={`Étape ${step}`}
          fill
          sizes="38vw"
          className="object-cover"
          priority
        />
        <div className="absolute left-6 top-6">
          <span className="text-xl font-bold text-white drop-shadow">phyxel<span className="text-blue-300">.</span></span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-8 py-10 lg:px-16">
        <div>
          <StepHeader step={step} total={5} />
          <div className="min-h-[400px]">
            {step === 1 && <StepBrandInfo data={data} onChange={update} />}
            {step === 2 && <StepObjectives data={data} onChange={update} />}
            {step === 3 && <StepSpaceNeeds data={data} onChange={update} />}
            {step === 4 && <StepPreferences data={data} onChange={update} />}
            {step === 5 && <StepSummary data={data} />}
          </div>
          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={goBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-40"
            >
              <ArrowLeft size={16} className="text-foreground" />
              Précédent
            </button>
          ) : mode === 'edit' ? (
            <Link
              href="/dashboard/profil"
              className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <X size={16} className="text-foreground" />
              Fermer
            </Link>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={goNext}
              disabled={!isStepValid(step)}
              className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Suivant
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Voir mes recommandations
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
