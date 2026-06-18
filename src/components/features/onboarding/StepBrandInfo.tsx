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
  SECTOR_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  APPROX_BUDGET_OPTIONS,
} from '@/types/onboarding'

export default function StepBrandInfo({
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
          <Input
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
