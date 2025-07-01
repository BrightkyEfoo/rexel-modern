import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { CategoriesGrid } from '@/components/sections/CategoriesGrid';
import { HeroSection } from '@/components/sections/HeroSection';
import { MobileAppSection } from '@/components/sections/MobileAppSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* <StatsSection /> */}
        <CategoriesGrid />
        {/* <PromotionsSection /> */}
        <BrandsSection />
        <ServicesSection />
        {/* <ToolsSection /> */}
        {/* <TestimonialsSection /> */}
        <MobileAppSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
