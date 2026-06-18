'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { OnboardingData } from '@/types/onboarding'
import {
  DURATION_OPTIONS,
  SPACE_TYPE_OPTIONS,
  AREA_OPTIONS,
  SERVICES_OPTIONS,
} from '@/types/onboarding'
import { Sofa, Lightbulb, Monitor, Wifi, Shirt, Package, Accessibility, ChefHat, Car, Bus, type LucideIcon } from 'lucide-react'
import TogglePill from './TogglePill'

const SERVICE_ICONS: Record<string, LucideIcon> = {
  'Mobilier':               Sofa,
  'Éclairage':              Lightbulb,
  'Système de caisse (POS)': Monitor,
  'Wi-Fi':                  Wifi,
  'Vestiaires':             Shirt,
  'Stockage':               Package,
  'Accès handicapé':        Accessibility,
  'Cuisine / Bar':          ChefHat,
  'Parking':                Car,
  'Transports à proximité': Bus,
}

export default function StepSpaceNeeds({
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
            {SERVICES_OPTIONS.map((opt) => {
              const Icon = SERVICE_ICONS[opt]
              const selected = data.neededServices.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleService(opt)}
                  className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background text-foreground hover:bg-accent'
                  }`}
                >
                  {Icon && <Icon size={15} className="shrink-0" />}
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
