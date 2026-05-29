import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-3xl p-12 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Prêt à passer du digital au réel ?</h2>
        <p className="text-white/80 text-sm mb-8">
          Créez votre compte gratuitement et recevez vos premières recommandations en 5 minutes.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#7C3AED] font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
        >
          Commencer gratuitement <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
