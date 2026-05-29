'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { CITIES } from '@/constants/spaces'

const TOTAL_STEPS = 5

const SECTORS = ['Mode & Accessoires', 'Beauté & Cosmétiques', 'Lifestyle & Déco', 'Alimentation & Boissons', 'Tech & Gadgets', 'Sport & Outdoor', 'Autre']
const PRODUCT_TYPES = ['Prêt-à-porter féminin', 'Prêt-à-porter masculin', 'Enfant', 'Maroquinerie', 'Bijoux', 'Soins', 'Autre']
const COMPANY_SIZES = ['Solopreneur', '2-5 personnes', '6-20 personnes', '20+ personnes']
const BUDGETS = ['< 500 €', '500-2 000 €', '2 000-5 000 €', '5 000-10 000 €', '> 10 000 €']

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    sector: 'Mode & Accessoires',
    productType: 'Prêt-à-porter féminin',
    city: 'Paris',
    companySize: 'Solopreneur',
    budget: '500-2 000 €',
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleFinish = async () => {
    if (user) {
      const supabase = createClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('profiles') as any).update({ bio: JSON.stringify(form) }).eq('id', user.id)
    }
    router.push('/explorer')
  }

  const selectClass = "w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#0A0A0A] bg-white focus:outline-none focus:border-[#7C3AED] transition-colors"

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold">P</div>
          <span className="font-semibold text-sm">Phyxel</span>
        </Link>
        <span className="text-sm text-[#6B7280]">Onboarding marque · étape {step} / {TOTAL_STEPS}</span>
        <button onClick={() => router.push('/explorer')} className="text-sm text-[#6B7280] hover:text-[#0A0A0A]">Passer</button>
      </header>

      {/* Barre de progression */}
      <div className="h-1 bg-[#E5E7EB]">
        <div
          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Contenu */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold text-[#7C3AED] uppercase tracking-widest mb-2">
          Étape {step}/{TOTAL_STEPS}
        </p>
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-8">Infos marque</h1>

        <div className="border border-[#E5E7EB] rounded-2xl p-8 space-y-5">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">Secteur</label>
                  <select value={form.sector} onChange={e => set('sector', e.target.value)} className={selectClass}>
                    {SECTORS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">Type de produits</label>
                  <select value={form.productType} onChange={e => set('productType', e.target.value)} className={selectClass}>
                    {PRODUCT_TYPES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">Ville principale</label>
                  <select value={form.city} onChange={e => set('city', e.target.value)} className={selectClass}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">Taille de l&apos;entreprise</label>
                  <select value={form.companySize} onChange={e => set('companySize', e.target.value)} className={selectClass}>
                    {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">Budget approximatif (mois)</label>
                <select value={form.budget} onChange={e => set('budget', e.target.value)} className={selectClass}>
                  {BUDGETS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </>
          )}

          {step > 1 && step < TOTAL_STEPS && (
            <div className="text-center py-8 text-[#9CA3AF] text-sm">
              Étape {step} — à personnaliser selon vos besoins
            </div>
          )}

          {step === TOTAL_STEPS && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎉</div>
              <p className="font-semibold text-[#0A0A0A]">Votre profil est prêt !</p>
              <p className="text-sm text-[#6B7280] mt-2">Découvrez vos recommandations personnalisées.</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0A0A0A]"
            >
              <ArrowLeft size={16} /> Retour
            </button>
          ) : <div />}

          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0A0A0A] text-white text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
            >
              Suivant <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#7C3AED] text-white text-sm font-medium rounded-full hover:bg-[#5B21B6] transition-colors"
            >
              Voir mes recommandations <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
