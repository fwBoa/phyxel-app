'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { CITIES, SPACE_TYPES } from '@/constants/spaces'
import type { SpaceFilters } from '@/types/spaces'

type SearchSheetProps = {
  initialFilters?: SpaceFilters
}

export default function SearchSheet({ initialFilters }: SearchSheetProps) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [city, setCity] = useState(initialFilters?.city ?? '')
  const [date, setDate] = useState('')
  const [type, setType] = useState(initialFilters?.type ?? '')

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (city) params.set('city', city)
    if (date) params.set('date', date)
    if (type) params.set('type', type)
    setOpen(false)
    router.push(`/explorer${params.toString() ? `?${params.toString()}` : ''}`)
  }

  function handleReset() {
    setQuery('')
    setCity('')
    setDate('')
    setType('')
  }

  return (
    <>
      {/* Mobile : bouton qui ouvre la sheet */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border-custom bg-white px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-[#0A0A0A] sm:hidden"
      >
        <Search size={16} className="text-text-secondary" />
        Commencer ma recherche
      </button>

      {/* Desktop : SearchBar inline (rounded-full) */}
      <div className="hidden sm:block">
        <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-lg">
          <label className="flex-1">
            <span className="sr-only">Ville</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-full bg-bg-secondary px-4 py-2.5 text-sm text-foreground outline-none"
            >
              <option value="">Toutes les villes</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="sr-only">Type d&apos;espace</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-full bg-bg-secondary px-4 py-2.5 text-sm text-foreground outline-none"
            >
              <option value="">Type d&apos;espace</option>
              {SPACE_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <Search size={16} />
            Rechercher
          </button>
        </div>
      </div>

      {/* Bottom sheet mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="search-sheet"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F3F4F6] sm:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-sheet-title"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={
              reduce
                ? { duration: 0.15 }
                : { type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }
            }
          >
            {/* Bouton fermer (overlay) */}
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-default"
            />

            {/* Bouton X (visible) */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer la recherche"
              className="absolute right-5 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-[#0D58C6] text-[#0D58C6] hover:bg-blue-50"
            >
              <X size={18} />
            </button>

            {/* Card sheet */}
            <div className="relative mx-6 w-full max-w-md rounded-[40px] bg-white p-8 shadow-sm">
              <h2 id="search-sheet-title" className="text-[26px] font-bold text-[#0D58C6]">
                Explorer les espaces
              </h2>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                {/* Champ recherche libre */}
                <label className="flex items-center gap-3 rounded-full border border-[#0D58C6] bg-white px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#0D58C6]/20">
                  <Search size={18} className="text-[#0D58C6] shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un lieu..."
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-text-secondary outline-none"
                  />
                </label>

                {/* Où ? */}
                <label className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-[#E5E7EB]">
                  <span className="text-sm text-text-secondary">Où ?</span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none text-right"
                  >
                    <option value="">Choisir une ville</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                {/* Quand ? */}
                <label className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-[#E5E7EB]">
                  <span className="text-sm text-text-secondary">Quand ?</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none text-right"
                  />
                </label>

                {/* Le lieu ? */}
                <label className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-[#E5E7EB]">
                  <span className="text-sm text-text-secondary">Le lieu ?</span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none text-right"
                  >
                    <option value="">Choisir un type de lieu</option>
                    {SPACE_TYPES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    Tout effacer
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full bg-[#0D58C6] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0A4AB0]"
                  >
                    Rechercher
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
