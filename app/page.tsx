import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { TrustBar } from '@/components/sections/TrustBar';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ScorePreview } from '@/components/sections/ScorePreview';
import { Testimonials } from '@/components/sections/Testimonials';
import { FinalCTA } from '@/components/sections/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-canvas)] pb-24 font-sans">
      <Navbar />
      
      <div className="pt-8 space-y-6 md:space-y-8 flex flex-col overflow-hidden">
        <Hero />
        <TrustBar />
        <HowItWorks />
        <ScorePreview />
        <Testimonials />
        <FinalCTA />
      </div>
    </main>
  );
}
