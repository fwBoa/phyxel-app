import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="bg-[#F9F9F9] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="rounded-3xl px-8 py-16 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #9B5DE5 0%, #E91E8C 100%)' }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Prêt à passer du digital au réel&nbsp;?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/85">
            Créez votre compte gratuitement et recevez vos premières recommandations en 5 minutes.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Commencer gratuitement
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
