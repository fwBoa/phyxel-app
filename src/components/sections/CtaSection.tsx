'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import ScrollReveal from '@/components/motion/ScrollReveal'

export default function CtaSection() {
  const reduce = useReducedMotion()

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
        <ScrollReveal>
          <motion.div
            className="cta-shimmer rounded-3xl px-8 py-16 text-center text-white"
            initial={reduce ? false : { scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  )
}
