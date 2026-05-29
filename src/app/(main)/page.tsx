import HeroSection            from '@/components/sections/HeroSection'
import HowItWorksSection      from '@/components/sections/HowItWorksSection'
import FeaturedSpacesSection  from '@/components/sections/FeaturedSpacesSection'
import WhyPhyxelSection       from '@/components/sections/WhyPhyxelSection'
import { getFeaturedSpaces }  from '@/lib/queries/spaces'

export default async function HomePage() {
  const featuredSpaces = await getFeaturedSpaces().catch(() => [])

  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedSpacesSection spaces={featuredSpaces} />
      <WhyPhyxelSection />
    </>
  )
}
