'use client'

import {
  Bus, Truck, Wrench, Wifi, Accessibility, Shield,
  Thermometer, Sparkles, Plug, CreditCard, Armchair,
  Warehouse, Lightbulb, Speaker, type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  bus:           Bus,
  truck:         Truck,
  wrench:        Wrench,
  wifi:          Wifi,
  accessibility: Accessibility,
  shield:        Shield,
  thermometer:   Thermometer,
  sparkles:      Sparkles,
  plug:          Plug,
  'credit-card': CreditCard,
  armchair:      Armchair,
  warehouse:     Warehouse,
  lightbulb:     Lightbulb,
  speaker:       Speaker,
}

type FeatureItem = { label: string; icon?: string }

type Props = {
  items:    FeatureItem[]
  /** Si true, renvoie un fallback silencieux quand la liste est vide (utile pour ne pas afficher de section vide) */
  hideEmpty?: boolean
}

export default function FeatureBadgeList({ items, hideEmpty = true }: Props) {
  if (!items || items.length === 0) {
    return hideEmpty ? null : null
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon ? ICON_MAP[item.icon] : null
        return (
          <span
            key={item.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-custom bg-white px-3 py-1.5 text-sm text-foreground"
          >
            {Icon && <Icon size={14} className="text-text-secondary shrink-0" strokeWidth={1.75} />}
            {item.label}
          </span>
        )
      })}
    </div>
  )
}
