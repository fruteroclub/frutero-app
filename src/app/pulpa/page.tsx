import PageWrapper from '@/components/layout/page-wrapper'
import PulpaHeroSection from '@/components/pulpa/pulpa-hero-section'
import PulpaValueSection from '@/components/pulpa/pulpa-value-section'
import PulpaEarnSection from '@/components/pulpa/pulpa-earn-section'
import PulpaBenefitsSection from '@/components/pulpa/pulpa-benefits-section'
import PulpaUseCasesSection from '@/components/pulpa/pulpa-use-cases-section'
import PulpaFAQSection from '@/components/pulpa/pulpa-faq-section'
import PulpaCTASection from '@/components/pulpa/pulpa-cta-section'

export default function PulpaPage() {
  return (
    <PageWrapper>
      <PulpaHeroSection />
      <PulpaValueSection />
      <PulpaEarnSection />
      <PulpaBenefitsSection />
      <PulpaUseCasesSection />
      <PulpaFAQSection />
      <PulpaCTASection />
    </PageWrapper>
  )
}
