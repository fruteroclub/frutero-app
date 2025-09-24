import { Metadata } from 'next'
import PageWrapper from '@/components/layout/page-wrapper'
import EcosystemHeader from '@/components/ecosystem/ecosystem-header'
import ArenaChannels from '@/components/ecosystem/arena-channels'

export const metadata: Metadata = {
  title: 'Ecosistema | Frutero Club',
  description: 'Explora el ecosistema de contenido curado y recursos compartidos por la comunidad Frutero',
}

export default function EcosistemaPage() {
  return (
    <PageWrapper>
      <div className="section">
        <div className="container">
          <EcosystemHeader />
          <ArenaChannels />
        </div>
      </div>
    </PageWrapper>
  )
}