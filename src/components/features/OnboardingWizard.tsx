'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { saveOnboarding } from '@/app/onboarding/actions'
import {
  EMPTY_ONBOARDING_DATA,
  ONBOARDING_STEPS,
  type OnboardingData,
  SECTOR_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  APPROX_BUDGET_OPTIONS,
  PHYSICAL_OBJECTIVES_OPTIONS,
  DURATION_OPTIONS,
  SPACE_TYPE_OPTIONS,
  AREA_OPTIONS,
  SERVICES_OPTIONS,
  MAX_BUDGET_OPTIONS,
  DISTRICT_OPTIONS,
  AMBIANCE_OPTIONS,
} from '@/types/onboarding'
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'

const STORAGE_KEY = 'phyxel_onboarding_draft'

function TogglePill({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-input bg-background text-foreground hover:bg-accent'
      }`}
    >
      {label}
    </button>
  )
}

function StepHeader({ step, total }: { step: number; total: number }) {
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

/* ─── Step 1 : Infos marque ─── */
function StepBrandInfo({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Parlez-nous de votre marque
      </h2>
      <p className="text-muted-foreground">
        Ces informations nous aideront à mieux comprendre votre univers.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Secteur d&apos;activité</Label>
          <Select
            value={data.sector}
            onValueChange={(v) => v && onChange({ sector: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisissez un secteur" />
            </SelectTrigger>
            <SelectContent>
              {SECTOR_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type de produits</Label>
          <Textarea
            placeholder="Ex : Vêtements, accessoires, chaussures…"
            value={data.productTypes.join(', ')}
            onChange={(e) =>
              onChange({
                productTypes: e.target.value
                  .split(/[,;]/)
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
          <p className="text-xs text-muted-foreground">
            Séparez par des virgules.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Ville principale</Label>
          <Input
            placeholder="Ex : Paris, Lyon, Bordeaux…"
            value={data.mainCity}
            onChange={(e) => onChange({ mainCity: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Taille de l&apos;entreprise</Label>
          <Select
            value={data.companySize}
            onValueChange={(v) => v && onChange({ companySize: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Budget approximatif</Label>
          <Select
            value={data.approxBudget}
            onValueChange={(v) => v && onChange({ approxBudget: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {APPROX_BUDGET_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 2 : Objectifs physiques ─── */
function StepObjectives({
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

/* ─── Step 3 : Besoins du lieu ─── */
function StepSpaceNeeds({
  data,
  onChange,
}: {
  data: OnboardingData
  onChange: (patch: Partial<OnboardingData>) => void
}) {
  const toggleSpaceType = (val: string) => {
    const set = new Set(data.spaceTypes)
    if (set.has(val)) set.delete(val)
    else set.add(val)
    onChange({ spaceTypes: Array.from(set) })
  }

  const toggleService = (val: string) => {
    const set = new Set(data.neededServices)
    if (set.has(val)) set.delete(val)
    else set.add(val)
    onChange({ neededServices: Array.from(set) })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Besoins du lieu
      </h2>
      <p className="text-muted-foreground">
        Décrivez l&apos;espace idéal pour votre projet.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Ville recherchée</Label>
          <Input
            placeholder="Ex : Paris"
            value={data.targetCity}
            onChange={(e) => onChange({ targetCity: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Durée souhaitée</Label>
          <Select
            value={data.desiredDuration}
            onValueChange={(v) => v && onChange({ desiredDuration: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type de lieu</Label>
          <div className="flex flex-wrap gap-2">
            {SPACE_TYPE_OPTIONS.map((opt) => (
              <TogglePill
                key={opt}
                label={opt}
                selected={data.spaceTypes.includes(opt)}
                onClick={() => toggleSpaceType(opt)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Surface souhaitée</Label>
          <Select
            value={data.desiredArea}
            onValueChange={(v) => v && onChange({ desiredArea: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {AREA_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Services nécessaires</Label>
          <div className="flex flex-wrap gap-2">
            {SERVICES_OPTIONS.map((opt) => (
              <TogglePill
                key={opt}
                label={opt}
                selected={data.neededServices.includes(opt)}
                onClick={() => toggleService(opt)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4 : Préférences ─── */
function StepPreferences({
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
          <Label>Budget maximum</Label>
          <Select
            value={data.maxBudget}
            onValueChange={(v) => v && onChange({ maxBudget: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              {MAX_BUDGET_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          <Input
            placeholder="Ex : Octobre 2025, ou 'ASAP'"
            value={data.idealDates}
            onChange={(e) => onChange({ idealDates: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Step 5 : Résumé ─── */
function StepSummary({ data }: { data: OnboardingData }) {
  const rows = useMemo(
    () => [
      { label: 'Secteur', value: data.sector },
      { label: 'Produits', value: data.productTypes.join(', ') || '—' },
      { label: 'Ville principale', value: data.mainCity || '—' },
      { label: 'Taille', value: data.companySize || '—' },
      { label: 'Budget approx.', value: data.approxBudget || '—' },
      { label: 'Objectifs', value: data.physicalObjectives.join(', ') || '—' },
      { label: 'Ville recherchée', value: data.targetCity || '—' },
      { label: 'Durée', value: data.desiredDuration || '—' },
      { label: 'Types de lieu', value: data.spaceTypes.join(', ') || '—' },
      { label: 'Surface', value: data.desiredArea || '—' },
      { label: 'Services', value: data.neededServices.join(', ') || '—' },
      { label: 'Budget max', value: data.maxBudget || '—' },
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

/* ─── Wizard principal ─── */
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

  // Charge le draft depuis localStorage (uniquement en mode create)
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

  // Sauvegarde le draft à chaque changement (uniquement en mode create)
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
      case 1:
        return !!(data.sector && data.mainCity && data.companySize)
      case 2:
        return data.physicalObjectives.length > 0
      case 3:
        return !!(data.targetCity && data.desiredDuration && data.spaceTypes.length > 0)
      case 4:
        return true // toutes les préférences sont optionnelles
      case 5:
        return true
      default:
        return false
    }
  }, [data])

  const goNext = () => {
    if (step < 5 && isStepValid(step)) setStep((p) => p + 1)
  }

  const goBack = () => {
    if (step > 1) setStep((p) => p - 1)
  }

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
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.'
      setError(msg)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Panneau image gauche */}
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
        {/* Logo overlay */}
        <div className="absolute left-6 top-6">
          <span className="text-xl font-bold text-white drop-shadow">phyxel<span className="text-blue-300">.</span></span>
        </div>
      </div>

      {/* Contenu formulaire droite */}
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
          <Button
            variant="outline"
            onClick={goBack}
            disabled={step === 1 || isSubmitting}
          >
            <ChevronLeft className="mr-2 size-4" />
            Précédent
          </Button>

          {step < 5 ? (
            <Button onClick={goNext} disabled={!isStepValid(step)}>
              Suivant
              <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Check className="mr-2 size-4" />
              )}
              Voir mes recommandations
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
