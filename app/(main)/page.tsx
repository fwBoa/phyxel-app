import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { FeaturedSpacesSection } from '@/components/sections/FeaturedSpacesSection'
import { WhyPhyxelSection } from '@/components/sections/WhyPhyxelSection'
import { CTASection } from '@/components/sections/CTASection'
import { getFeaturedSpaces } from '@/lib/queries/spaces'
import type { SpaceWithPhotos } from '@/types/spaces'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { data: featuredSpaces } = await getFeaturedSpaces().catch(() => ({ data: null }))

  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedSpacesSection spaces={(featuredSpaces as SpaceWithPhotos[]) ?? []} />
      <WhyPhyxelSection />
      <CTASection />
    </>
  )
}
