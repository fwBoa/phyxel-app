'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CITIES, SPACE_TYPES } from '@/constants/spaces'

export function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState('Paris')
  const [type, setType] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (type) params.set('type', type)
    router.push(`/explorer?${params.toString()}`)
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] overflow-hidden">
      {/* Ville */}
      <div className="flex flex-col px-5 py-3 flex-1">
        <label className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Ville</label>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="text-sm text-[#0A0A0A] bg-transparent outline-none"
        >
          <option value="">Toutes</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Dates — statique pour la démo */}
      <div className="flex flex-col px-5 py-3 flex-1">
        <label className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Dates</label>
        <span className="text-sm text-[#6B7280]">Choisir des dates</span>
      </div>

      {/* Type de lieu */}
      <div className="flex flex-col px-5 py-3 flex-1">
        <label className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Type de lieu</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="text-sm text-[#0A0A0A] bg-transparent outline-none"
        >
          <option value="">Tous</option>
          {SPACE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Bouton */}
      <div className="flex items-center px-4 py-3">
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-[#7C3AED] text-white text-sm font-medium rounded-xl hover:bg-[#5B21B6] transition-colors whitespace-nowrap"
        >
          Rechercher
        </button>
      </div>
    </div>
  )
}
