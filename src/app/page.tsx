'use client';

import GSAPHeroClient from './(public)/components/GSAPHeroClient';
import VehicleShowcase3D from './(public)/components/VehicleShowcase3D';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';
import BrandsMarquee from './(public)/components/sections/BrandsMarquee';
import StepsSection from './(public)/components/sections/StepsSection';
import FullbleedSection from './(public)/components/sections/FullbleedSection';
import ComparatorSection from './(public)/components/sections/ComparatorSection';
import FeaturesSection from './(public)/components/sections/FeaturesSection';
import GallerySection from './(public)/components/sections/GallerySection';
import TestimonialsSection from './(public)/components/sections/TestimonialsSection';
import PricingSection from './(public)/components/sections/PricingSection';
import UseCasesSection from './(public)/components/sections/UseCasesSection';
import CtaFinalSection from './(public)/components/sections/CtaFinalSection';

export default function HomePage() {
  useScrollAnimations();

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar activePage="plataforma" />

      {/* GSAP hero — first section */}
      <GSAPHeroClient />

      {/* All sections below the hero */}
      <div className="content-wrapper-overlap">
        <BrandsMarquee />
        <StepsSection />
        <VehicleShowcase3D />
        <FullbleedSection />
        <ComparatorSection />
        <FeaturesSection />
        <GallerySection />
        <TestimonialsSection />
        <PricingSection />
        <UseCasesSection />
        <CtaFinalSection />
        <Footer />
      </div>
    </div>
  );
}
