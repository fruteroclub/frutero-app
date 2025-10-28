import PageWrapper from '@/components/layout/page-wrapper'
import HeroSection from '@/components/landing/hero-section'
import StatsSection from '@/components/landing/stats-section'
import JourneySection from '@/components/landing/journey-section'
import TestimonialsSection from '@/components/landing/testimonials-section'
import PulpaSection from '@/components/landing/pulpa-section'
import FAQSection from '@/components/landing/faq-section'
import FinalCTASection from '@/components/landing/final-cta-section'
import CustomersPartnersSection from '@/components/landing/customers-partners-section'
import PainPointsSection from '@/components/landing/pain-points-section'

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <PainPointsSection />
      <JourneySection />
      <TestimonialsSection />
      <StatsSection />
      <CustomersPartnersSection />
      <PulpaSection />
      <FAQSection />
      <FinalCTASection />
    </PageWrapper>
  )
}
