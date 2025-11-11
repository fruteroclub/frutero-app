'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/page-wrapper'
import { Section } from '@/components/layout/section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Rocket, Globe, Code2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Project = {
  id: string
  name: string
  slug: string
  description: string | null
  stage: string
}

// Partners data from landing page
const partners = [
  {
    name: 'Base',
    description: 'L2 blockchain de Coinbase, diseñada para traer el próximo billón de usuarios on-chain.',
    logo: '/images/logos/partners/base-logo-black.svg',
    url: 'https://base.org',
    category: 'Blockchain Infrastructure',
  },
  {
    name: 'Scroll',
    description: 'zkEVM Layer 2 que escala Ethereum manteniendo su seguridad y descentralización.',
    logo: '/images/logos/partners/scroll-logo-black.svg',
    url: 'https://scroll.io',
    category: 'Blockchain Infrastructure',
  },
  {
    name: '0x Protocol',
    description: 'Protocolo de intercambio descentralizado que permite el trading de tokens ERC20.',
    logo: '/images/logos/partners/0x-logo-black.svg',
    url: 'https://0x.org',
    category: 'DeFi Protocol',
  },
  {
    name: 'BuidlGuidl',
    description: 'Comunidad de builders de Ethereum enfocados en crear productos que importan.',
    logo: '/images/logos/partners/buidlguidl-logo-black.svg',
    url: 'https://buidlguidl.com',
    category: 'Builder Community',
  },
  {
    name: 'Monad',
    description: 'Blockchain de alto rendimiento con EVM paralela para aplicaciones de consumo masivo.',
    logo: '/images/logos/partners/monad-logo-blacl.svg',
    url: 'https://monad.xyz',
    category: 'Blockchain Infrastructure',
  },
  {
    name: 'ETHGlobal',
    description: 'La organización líder de hackathons de Ethereum a nivel mundial.',
    logo: '/images/logos/partners/ethglobal-logo-color.svg',
    url: 'https://ethglobal.com',
    category: 'Hackathon Organizer',
  },
  {
    name: 'The Graph',
    description: 'Protocolo de indexación para consultar redes como Ethereum y IPFS.',
    logo: '/images/logos/partners/thegraph-logo-black.svg',
    url: 'https://thegraph.com',
    category: 'Infrastructure',
  },
  {
    name: 'Polygon',
    description: 'Plataforma de escalamiento para Ethereum que construye infraestructura web3.',
    logo: '/images/logos/partners/polygon-logo-black.svg',
    url: 'https://polygon.com',
    category: 'Blockchain Infrastructure',
  },
]

type TabType = 'projects' | 'partners'

export default function EcosistemaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('projects')

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['all-projects'],
    queryFn: async () => {
      const res = await fetch('/api/jam/projects/all')
      if (!res.ok) throw new Error('Failed to fetch projects')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const tabConfig = [
    { id: 'projects' as TabType, label: 'Proyectos', icon: Rocket },
    { id: 'partners' as TabType, label: 'Partners', icon: Globe },
  ]

  return (
    <PageWrapper>
      <Section>
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-center text-4xl font-bold"
        >
          Ecosistema Frutero
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center text-lg text-foreground"
        >
          Proyectos, comunidades y partners construyendo el futuro de web3 en Latinoamérica
        </motion.p>

        {/* Tab Navigation - matching club page role filter style */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex gap-2 rounded-lg">
            {tabConfig.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-1/3 flex-col items-center gap-1 rounded-md p-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent hover:bg-primary/10'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Cargando proyectos...</p>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No hay proyectos registrados aún
                </p>
              </div>
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-8 px-6 md:grid-cols-2 md:px-0 lg:grid-cols-3"
              >
                {projects.map((project) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href={`/jam/projects/${project.slug}`}>
                      <Card className="h-full rounded-2xl border-2 px-2 py-6 text-center transition-all hover:border-primary hover:shadow-lg">
                        <CardHeader className="flex flex-col items-center gap-2">
                          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Code2 className="h-8 w-8 text-primary" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-primary">
                            {project.name}
                          </CardTitle>
                          <Badge variant="outline">{project.stage}</Badge>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <CardDescription className="line-clamp-2 text-gray-600">
                            {project.description || 'Sin descripción'}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Partners Section */}
        {activeTab === 'partners' && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-8 px-6 md:grid-cols-2 md:px-0 lg:grid-cols-3"
          >
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <a href={partner.url} target="_blank" rel="noopener noreferrer">
                  <Card className="h-full rounded-2xl border-2 px-2 py-6 text-center transition-all hover:border-primary hover:shadow-lg">
                    <CardHeader className="flex flex-col items-center gap-2">
                      <div className="mb-2 flex h-16 w-32 items-center justify-center">
                        <div className="relative h-full w-full">
                          <Image
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            fill
                            className="object-contain opacity-80 transition-opacity hover:opacity-100"
                          />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-primary">
                        {partner.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {partner.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <CardDescription className="line-clamp-2 text-gray-600">
                        {partner.description}
                      </CardDescription>
                      <div className="flex items-center justify-center gap-2 text-sm text-primary">
                        <ExternalLink className="h-4 w-4" />
                        <span>Visitar</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>
    </PageWrapper>
  )
}
