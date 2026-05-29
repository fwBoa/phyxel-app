import Link from 'next/link'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Découverte',
    price: 'Gratuit',
    period: '',
    desc: 'Pour explorer la plateforme',
    features: [
      'Accès au catalogue',
      'Recherche avancée',
      '3 demandes de réservation/mois',
      'Support email',
    ],
    cta: 'Commencer gratuitement',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Marque',
    price: '49',
    period: '€/mois',
    desc: 'Pour les marques en croissance',
    features: [
      'Tout du plan Découverte',
      'Réservations illimitées',
      'Score de matching avancé',
      'Tableau de bord analytics',
      'Support prioritaire',
    ],
    cta: 'Démarrer l\'essai',
    href: '/register',
    highlight: true,
  },
  {
    name: 'Host',
    price: '29',
    period: '€/mois',
    desc: 'Pour les propriétaires d\'espaces',
    features: [
      'Publication d\'espaces illimitée',
      'Gestion des réservations',
      'Profil hôte vérifié',
      'Statistiques d\'occupation',
    ],
    cta: 'Référencer mon espace',
    href: '/register',
    highlight: false,
  },
]

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="bg-[#0A0A0A] text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Tarifs simples et transparents</h1>
        <p className="text-white/60">Commencez gratuitement, évoluez selon vos besoins.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${plan.highlight
                ? 'bg-[#0A0A0A] text-white ring-2 ring-[#E91E8C]'
                : 'bg-white border border-[#E5E5E5]'
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-bold text-[#E91E8C] uppercase tracking-widest mb-4">Populaire</div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/60' : 'text-[#6B6B6B]'}`}>{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.highlight ? 'text-white/60' : 'text-[#9B9B9B]'}`}>{plan.period}</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-[#E91E8C] shrink-0 mt-0.5" />
                    <span className={plan.highlight ? 'text-white/80' : 'text-[#6B6B6B]'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${plan.highlight
                  ? 'bg-[#E91E8C] text-white hover:bg-[#B0156A]'
                  : 'border border-[#E5E5E5] text-[#0A0A0A] hover:bg-[#F9F9F9]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
