'use client'

import { useState } from 'react'
import { MapPin, SlidersHorizontal, LayoutList, Map } from 'lucide-react'
import { SpaceGrid } from '@/components/features/SpaceGrid'
import { SPACE_TYPES, CITIES } from '@/constants/spaces'

export const dynamic = 'force-dynamic'

const FILTER_TABS = ['Recommandés', 'Pop-up', 'Showroom', 'Événementiel', '≤ Budget']

export default function ExplorerPage() {
  const [city, setCity] = useState('Paris')
  const [type, setType] = useState('')
  const [activeTab, setActiveTab] = useState('Recommandés')
  const [view, setView] = useState<'liste' | 'carte'>('liste')

  const filters = { city: city || undefined, type: type || undefined }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header barre de recherche */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl px-4 py-2 flex-1 max-w-xs">
            <MapPin size={14} className="text-[#7C3AED] shrink-0" />
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="text-sm text-[#0A0A0A] bg-transparent outline-none w-full"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl px-4 py-2">
            <span className="text-sm text-[#6B7280]">Juin 10 – 17</span>
          </div>

          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl px-4 py-2">
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="text-sm text-[#0A0A0A] bg-transparent outline-none"
            >
              <option value="">≤ 5 000 €</option>
              {SPACE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <button className="flex items-center gap-2 border border-[#E5E7EB] rounded-xl px-4 py-2 text-sm text-[#6B7280] hover:border-[#7C3AED] transition-colors">
            <SlidersHorizontal size={14} />
          </button>

          <div className="ml-auto flex items-center gap-1 border border-[#E5E7EB] rounded-xl p-1">
            <button
              onClick={() => setView('liste')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'liste' ? 'bg-[#0A0A0A] text-white' : 'text-[#6B7280]'}`}
            >
              <LayoutList size={13} /> Liste
            </button>
            <button
              onClick={() => setView('carte')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'carte' ? 'bg-[#0A0A0A] text-white' : 'text-[#6B7280]'}`}
            >
              <Map size={13} /> Carte
            </button>
          </div>
        </div>
      </div>

      {/* Onglets filtres */}
      <div className="bg-white border-b border-[#E5E7EB] px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#7C3AED] text-white'
                  : 'bg-[#F5F3FF] text-[#7C3AED] hover:bg-[#EDE9FE]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Section recommandés */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0A0A0A]">+ Recommandés pour votre marque</h2>
            </div>
            <span className="text-xs text-[#9CA3AF]">4 espaces</span>
          </div>
          <SpaceGrid filters={filters} />
        </div>

        {/* Section budget */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0A0A0A]">+ Adaptés à votre budget</h2>
            <span className="text-xs text-[#9CA3AF]">4 espaces</span>
          </div>
          <SpaceGrid filters={{ ...filters, maxPrice: 500 }} />
        </div>
      </div>
    </div>
  )
}
