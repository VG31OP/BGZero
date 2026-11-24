import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SocialProofMarquee from "@/components/SocialProofMarquee";
import ProblemVsSolution from "@/components/ProblemVsSolution";
import FeatureGrid from "@/components/FeatureGrid";
import HowItWorks from "@/components/HowItWorks";
import UseCasePersonas from "@/components/UseCasePersonas";
import Testimonials from "@/components/Testimonials";
import InteractiveStudio from "@/components/InteractiveStudio";
import FinalCTAAndFooter from "@/components/FinalCTAAndFooter";

const Index = () => {
  const scrollToStudio = () => {
    const studioEl = document.getElementById("studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#ffe17c] text-black font-satoshi selection:bg-black selection:text-[#ffe17c]">
      {/* 1. Fixed Header Navigation */}
      <Navbar onStartClick={scrollToStudio} />

      {/* 2. Hero Section */}
      <HeroSection onStartClick={scrollToStudio} />

      {/* 3. Interactive Studio (Functional In-Browser Tool + FAQ) - Directly under Hero */}
      <InteractiveStudio />

      {/* 4. Social Proof Marquee */}
      <SocialProofMarquee />

      {/* 5. Problem vs Solution */}
      <ProblemVsSolution />

      {/* 6. Feature Grid */}
      <FeatureGrid />

      {/* 7. How It Works (Dark Mode) */}
      <HowItWorks />

      {/* 8. Use Case Personas Bento Grid */}
      <UseCasePersonas />

      {/* 9. Testimonials with Asymmetric Rounding */}
      <Testimonials />

      {/* 10. Final CTA & 4-Column Charcoal Footer */}
      <FinalCTAAndFooter />
    </div>
  );
};

export default Index;
