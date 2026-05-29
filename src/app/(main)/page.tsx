import HeroSection            from '@/components/sections/HeroSection'
import HowItWorksSection      from '@/components/sections/HowItWorksSection'
import FeaturedSpacesSection  from '@/components/sections/FeaturedSpacesSection'
import WhyPhyxelSection       from '@/components/sections/WhyPhyxelSection'
import CtaSection             from '@/components/sections/CtaSection'
import { getFeaturedSpaces }  from '@/lib/queries/spaces'
import { getCurrentUser }     from '@/lib/queries/users'

export default async function HomePage() {
  const [featuredSpaces, user] = await Promise.all([
    getFeaturedSpaces().catch(() => []),
    getCurrentUser().catch(() => null),
  ])

  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedSpacesSection spaces={featuredSpaces} />
      <WhyPhyxelSection />
      {!user && <CtaSection />}
    </>
  )
}
