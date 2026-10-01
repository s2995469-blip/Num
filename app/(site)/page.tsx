import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { HeroSection } from "@/components/home/HeroSection";
import { InsightsSection } from "@/components/home/InsightsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ServiceNavigation } from "@/components/home/ServiceNavigation";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceNavigation />
      <AboutSection />
      <ProcessSection />
      <TestimonialsSection />
      <InsightsSection />
      <FinalCTA />
    </>
  );
}
