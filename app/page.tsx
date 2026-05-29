import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturedSpacesSection from "@/components/sections/FeaturedSpacesSection";
import WhyPhyxelSection from "@/components/sections/WhyPhyxelSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturedSpacesSection />
        <WhyPhyxelSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
