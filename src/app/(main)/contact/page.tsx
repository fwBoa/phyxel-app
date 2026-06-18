'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus, Globe } from 'lucide-react'
import { motion } from 'motion/react'
import { CITIES } from '@/constants/spaces'

const PROJECT_TYPES = [
  'Pop-up store',
  'Showroom',
  'Corner',
  'Boutique éphémère',
  'Événementiel',
  'Autre',
]

const TOPICS = [
  'Recherche de lieux',
  'Accompagnement sur-mesure',
  'Conseil stratégique',
  'Gestion complète',
  'Budget maîtrisé',
  'Expert dédié',
]

const BUDGETS = [
  '5 000€',
  '10 000€',
  '25 000€',
  '50 000€',
  '100 000€',
  '+100 000€',
]

export default function ContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    brandName: '',
    website: '',
    projectType: '',
    city: '',
    date: '',
    budget: '',
    topics: [] as string[],
    consent: false,
  })

  function toggleTopic(topic: string) {
    setForm((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulation d'envoi — remplacer par un appel API réel si besoin
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)
    setSubmitted(true)
    router.push('/devis/confirmation')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left panel — photo + overlay ── */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden">
        <Image
          src="/assets/img/boutique-accompagnement.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <Link href="/">
            <Image src="/logo-phyxel.svg" alt="Phyxel" width={120} height={32} className="object-contain" priority />
          </Link>

          <div className="max-w-xs rounded-2xl p-5 bg-white/12 backdrop-blur-md border border-white/20">
            <p className="text-xl font-semibold text-white leading-tight" style={{ fontFamily: 'var(--font-bricolage)' }}>Agnès Grant</p>
            <p className="mt-1 text-sm text-white/80 italic">
              « On a créé plus de lien en un week-end qu’en plusieurs mois sur Instagram »
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/40 px-4 py-3 text-white text-sm font-medium">
              <Plus size={18} className="text-[#6F8BEF] shrink-0" />
              500 marques accompagnées
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/40 px-4 py-3 text-white text-sm font-medium">
              <Globe size={18} className="text-[#6F8BEF] shrink-0" />
              Un réseau qualifié de partenaires et de lieux
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right panel — form ── */}
      <main className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-white">
        {/* Mobile logo */}
        <div className="w-full lg:hidden pb-6">
          <Link href="/">
            <Image src="/logo-phyxel.svg" alt="Phyxel" width={110} height={30} className="object-contain" priority />
          </Link>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="w-full max-w-2xl rounded-3xl border border-[#E4E4EB] bg-white p-6 sm:p-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#10111A]" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Besoin d’un accompagnement personnalisé ?
          </h1>
          <p className="mt-3 text-[#65677A]">
            Expliquez-nous votre projet et recevez une proposition adaptée à vos besoins.
          </p>

          {/* Identité */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Prénom</span>
              <input
                required
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Sophie"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Nom</span>
              <input
                required
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Martin"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Email professionnel</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="sophie@lumio.fr"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
          </div>

          {/* Contact / marque */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Numéro de téléphone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="00 00 00 00 00"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Nom de votre marque</span>
              <input
                required
                type="text"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                placeholder="Lumio Studio"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Site e-commerce</span>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://lumiostudio.fr"
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
          </div>

          {/* Projet */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Quel type de projet souhaitez-vous organiser ?</span>
              <select
                required
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20 appearance-none"
              >
                <option value="">Sélectionner</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Où souhaitez-vous organiser votre projet ?</span>
              <select
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20 appearance-none"
              >
                <option value="">Sélectionner la ville</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Date / budget */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Quand souhaitez-vous organiser votre projet ?</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-[#10111A]">Budget estimé du projet</span>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#E4E4EB] bg-white px-4 py-2.5 text-sm text-[#10111A] outline-none focus:border-[#0D58C6] focus:ring-2 focus:ring-[#0D58C6]/20 appearance-none"
              >
                <option value="">Sélectionner</option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Sujets */}
          <div className="mt-5">
            <span className="block text-sm font-medium text-[#10111A]">Sur quels sujets souhaitez-vous être accompagné ?</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {TOPICS.map((topic) => {
                const selected = form.topics.includes(topic)
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      selected
                        ? 'border-[#0D58C6] bg-[#0D58C6] text-white'
                        : 'border-[#E4E4EB] bg-white text-[#10111A] hover:border-[#0D58C6]'
                    }`}
                  >
                    {topic}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Consentement */}
          <label className="mt-6 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              required
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-[#E4E4EB] text-[#0D58C6] focus:ring-[#0D58C6]/20"
            />
            <span className="text-[#65677A]">
              Je reconnais transmettre mes informations à Phyxel qui s’engage à ne les utiliser que dans le cadre exclusif de cette demande.
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || submitted}
            className="mt-6 w-full rounded-full bg-[#10111A] px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : submitted ? 'Envoyé' : 'Être recontacté par un expert'}
          </button>
        </motion.form>
      </main>
    </div>
  )
}
