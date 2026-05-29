import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturedSpacesSection from "@/components/sections/FeaturedSpacesSection";
import WhyPhyxelSection from "@/components/sections/WhyPhyxelSection";
import CTASection from "@/components/sections/CTASection";
import { getFeaturedSpaces } from "@/lib/queries/spaces";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const spaces = await getFeaturedSpaces(3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturedSpacesSection spaces={spaces} />
        <WhyPhyxelSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
