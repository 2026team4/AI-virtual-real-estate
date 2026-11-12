import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import PropertyTypes from '../components/home/PropertyTypes';
import HowItWorks from '../components/home/HowItWorks';
import AIFeatures from '../components/home/AIFeatures';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <StatsSection />
      <FeaturedProperties />
      <PropertyTypes />
      <HowItWorks />
      <AIFeatures />
      <Testimonials />
      <CTASection />
    </div>
  );
}
