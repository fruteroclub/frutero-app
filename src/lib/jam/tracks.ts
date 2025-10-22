/**
 * Track System - JAM-013
 * Defines the 4 development tracks for JAM participants
 */

import type { Track } from '@/types/jam'

// Re-export Track type for convenience
export type { Track }

export interface TrackConfig {
  title: string
  titleEs: string
  description: string
  descriptionEs: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
  goals: string[]
  goalsEs: string[]
  questTypes: string[]
  mentorExpertise: string[]
}

export const TRACKS: Record<Track, TrackConfig> = {
  LEARNING: {
    title: 'Learning Track',
    titleEs: 'Ruta de Aprendizaje',
    description: 'For people getting started in tech and AI',
    descriptionEs: 'Para personas que están comenzando en tecnología e IA',
    icon: '🌱',
    color: 'green',
    goals: [
      'Learn fundamental programming concepts',
      'Build your first AI-powered project',
      'Understand web development basics',
      'Join the tech community',
    ],
    goalsEs: [
      'Aprender conceptos fundamentales de programación',
      'Construir tu primer proyecto con IA',
      'Entender los fundamentos del desarrollo web',
      'Unirte a la comunidad tech',
    ],
    questTypes: ['learning', 'fundamentals', 'tutorial', 'beginner'],
    mentorExpertise: ['teaching', 'fundamentals', 'beginner-friendly', 'education'],
  },

  FOUNDER: {
    title: 'Founder Track',
    titleEs: 'Ruta Founder',
    description: 'Build and launch your startup',
    descriptionEs: 'Construye y lanza tu startup',
    icon: '🚀',
    color: 'blue',
    goals: [
      'Validate your product idea',
      'Build an MVP',
      'Get first users',
      'Raise pre-seed funding',
    ],
    goalsEs: [
      'Validar tu idea de producto',
      'Construir un MVP',
      'Conseguir tus primeros usuarios',
      'Levantar financiamiento pre-seed',
    ],
    questTypes: ['product', 'market', 'fundraising', 'startup'],
    mentorExpertise: ['startup', 'product', 'fundraising', 'entrepreneurship'],
  },

  PROFESSIONAL: {
    title: 'Professional Track',
    titleEs: 'Ruta Profesional',
    description: 'Level up your tech career',
    descriptionEs: 'Eleva tu carrera tecnológica',
    icon: '💼',
    color: 'purple',
    goals: [
      'Land a senior dev role',
      'Master new technologies',
      'Build a strong portfolio',
      'Expand your network',
    ],
    goalsEs: [
      'Conseguir un rol senior de desarrollador',
      'Dominar nuevas tecnologías',
      'Construir un portafolio sólido',
      'Expandir tu red profesional',
    ],
    questTypes: ['technical', 'portfolio', 'networking', 'career'],
    mentorExpertise: ['engineering', 'career', 'leadership', 'technical'],
  },

  FREELANCER: {
    title: 'Freelancer Track',
    titleEs: 'Ruta Freelancer',
    description: 'Build your independent practice',
    descriptionEs: 'Construye tu práctica independiente',
    icon: '🎯',
    color: 'orange',
    goals: [
      'Build a client base',
      'Master service delivery',
      'Scale your rates',
      'Achieve location independence',
    ],
    goalsEs: [
      'Construir una base de clientes',
      'Dominar la entrega de servicios',
      'Escalar tus tarifas',
      'Lograr independencia de ubicación',
    ],
    questTypes: ['client', 'delivery', 'business', 'freelance'],
    mentorExpertise: ['consulting', 'business', 'marketing', 'freelancing'],
  },
}

/**
 * Get track configuration by track type
 */
export function getTrackConfig(track: Track): TrackConfig {
  return TRACKS[track]
}

/**
 * Get all available tracks
 */
export function getAllTracks(): Track[] {
  return Object.keys(TRACKS) as Track[]
}

/**
 * Check if quest category matches track
 */
export function doesQuestMatchTrack(questCategory: string, track: Track): boolean {
  const trackConfig = TRACKS[track]
  return trackConfig.questTypes.includes(questCategory.toLowerCase())
}

/**
 * Check if mentor expertise matches track
 */
export function doesMentorMatchTrack(mentorExpertise: string[], track: Track): boolean {
  const trackConfig = TRACKS[track]
  return mentorExpertise.some((expertise) =>
    trackConfig.mentorExpertise.includes(expertise.toLowerCase())
  )
}

/**
 * Get color class for track
 */
export function getTrackColorClass(track: Track): string {
  const config = TRACKS[track]
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
  }
  return colorMap[config.color]
}

/**
 * Validate track change eligibility
 * Users can change track once per month
 */
export function canChangeTrack(
  trackChangedAt: Date | null,
  trackChangeCount: number
): { canChange: boolean; reason?: string } {
  // First time selection
  if (!trackChangedAt) {
    return { canChange: true }
  }

  // Check if 30 days have passed
  const now = new Date()
  const daysSinceChange = Math.floor(
    (now.getTime() - trackChangedAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysSinceChange < 30) {
    return {
      canChange: false,
      reason: `Puedes cambiar de ruta nuevamente en ${30 - daysSinceChange} días`,
    }
  }

  // Limit total changes (optional safeguard)
  if (trackChangeCount >= 12) {
    return {
      canChange: false,
      reason: 'Has alcanzado el límite de cambios de ruta. Contacta soporte.',
    }
  }

  return { canChange: true }
}
