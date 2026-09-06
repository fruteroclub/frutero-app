"use client"

import { useRouter } from 'next/navigation'
import { VeranoHero } from './verano-hero'

interface VeranoHeroWrapperProps {
  deadline: Date
}

export function VeranoHeroWrapper({ deadline }: VeranoHeroWrapperProps) {
  const router = useRouter()

  return (
    <VeranoHero
      deadline={deadline}
      onCtaClick={() => {
        // Track event
        console.log('CTA clicked')
        // Navigate to application form
        router.push('/programa/apply')
      }}
      onVideoClick={() => {
        // Track event
        console.log('Video clicked')
        // Navigate to program details
        router.push('/programa/details')
      }}
    />
  )
} 