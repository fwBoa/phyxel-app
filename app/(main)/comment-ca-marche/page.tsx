import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import Link from 'next/link'

export default function CommentCaMarchePage() {
  return (
    <div>
      <div className="bg-[#0A0A0A] text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Comment ça marche</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Phyxel simplifie la rencontre entre marques et espaces physiques.
        </p>
      </div>

      <HowItWorksSection />

      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#0A0A0A] mb-4">Prêt à commencer ?</h2>
        <p className="text-[#6B6B6B] mb-8">Rejoignez des centaines de marques qui développent leur présence physique.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/explorer" className="px-8 py-3 bg-[#E91E8C] text-white font-semibold rounded-xl hover:bg-[#B0156A] transition-colors">
            Explorer les espaces
          </Link>
          <Link href="/register" className="px-8 py-3 border border-[#0A0A0A] text-[#0A0A0A] font-semibold rounded-xl hover:bg-[#F9F9F9] transition-colors">
            Créer un compte
          </Link>
        </div>
      </section>
    </div>
  )
}
