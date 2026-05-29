'use client'

import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

export default function DashboardPage() {
  const { profile, loading } = useProfile()

  if (loading) return <div className="animate-pulse space-y-4">{Array.from({length: 3}).map((_,i) => <div key={i} className="h-20 bg-white rounded-2xl" />)}</div>

  return (
    <div className="space-y-6">
      <div className="bg-[#0A0A0A] text-white rounded-2xl p-8">
        <p className="text-white/60 text-sm mb-1">Bonjour 👋</p>
        <h1 className="text-2xl font-bold">{profile?.full_name ?? 'Utilisateur'}</h1>
        {profile?.brand_name && <p className="text-[#E91E8C] text-sm mt-1">{profile.brand_name}</p>}
        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
          {profile?.role === 'brand' ? 'Marque' : 'Hôte'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/reservations"
          className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 hover:border-[#E91E8C]/30 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FDE8F4] flex items-center justify-center">
            <Calendar size={22} className="text-[#E91E8C]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#0A0A0A]">Mes réservations</p>
            <p className="text-sm text-[#6B6B6B]">Gérer vos demandes</p>
          </div>
          <ArrowRight size={18} className="text-[#9B9B9B]" />
        </Link>

        <Link
          href="/explorer"
          className="bg-white rounded-2xl border border-[#E5E5E5] p-6 flex items-center gap-4 hover:border-[#E91E8C]/30 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FDE8F4] flex items-center justify-center">
            <MapPin size={22} className="text-[#E91E8C]" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#0A0A0A]">Explorer</p>
            <p className="text-sm text-[#6B6B6B]">Trouver des espaces</p>
          </div>
          <ArrowRight size={18} className="text-[#9B9B9B]" />
        </Link>
      </div>
    </div>
  )
}
