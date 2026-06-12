import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes shimmerBg {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
        .cta-shimmer {
          background: linear-gradient(
            90deg,
            #0A192F 0%,
            #3B4FD8 25%,
            #A5B4FC 50%,
            #3B4FD8 75%,
            #0A192F 100%
          );
          background-size: 200% 100%;
          animation: shimmerBg 5s linear infinite;
        }
      `}</style>
      <div className="mx-auto max-w-7xl">
        <div className="cta-shimmer rounded-3xl px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Prêt à passer du digital au réel&nbsp;?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/85">
            Créez votre compte gratuitement et recevez vos premières recommandations en 5 minutes.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Commencer gratuitement
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
