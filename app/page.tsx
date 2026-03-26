import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import DemoVideo from '@/components/landing/DemoVideo';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface selection:bg-brand-500/30">
      <Hero />
      <DemoVideo />
      <Features />
      <Pricing />
    </main>
  );
}
