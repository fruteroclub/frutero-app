/**
 * Project Stage Logic
 * Utilities for managing project progression through stages
 */

export type ProjectStage = 'IDEA' | 'PROTOTYPE' | 'BUILD' | 'PROJECT' | 'INCUBATE' | 'ACCELERATE' | 'SCALE'

export interface StageConfig {
  stage: ProjectStage
  title: string
  description: string
  icon: string
  color: string
  requirements: string[]
  minQuestsCompleted?: number
  minTeamMembers?: number
  requiredDeliverables?: string[]
}

/**
 * Stage definitions with progression requirements
 */
export const STAGES: Record<ProjectStage, StageConfig> = {
  IDEA: {
    stage: 'IDEA',
    title: 'Idea',
    description: 'Conceptualización y validación inicial',
    icon: '💡',
    color: 'gray',
    requirements: ['Definir problema a resolver', 'Identificar usuarios objetivo'],
  },
  PROTOTYPE: {
    stage: 'PROTOTYPE',
    title: 'Prototype',
    description: 'Primer prototipo funcional',
    icon: '🔧',
    color: 'blue',
    requirements: ['Completar prototipo funcional', 'Validar con usuarios'],
    minQuestsCompleted: 2,
  },
  BUILD: {
    stage: 'BUILD',
    title: 'Build',
    description: 'Desarrollo del MVP',
    icon: '🏗️',
    color: 'yellow',
    requirements: ['MVP funcional', 'Primeros usuarios activos'],
    minQuestsCompleted: 5,
    minTeamMembers: 2,
  },
  PROJECT: {
    stage: 'PROJECT',
    title: 'Project',
    description: 'Producto en producción',
    icon: '🚀',
    color: 'green',
    requirements: ['Producto en producción', 'Tracción medible'],
    minQuestsCompleted: 8,
    requiredDeliverables: ['production_url'],
  },
  INCUBATE: {
    stage: 'INCUBATE',
    title: 'Incubate',
    description: 'Crecimiento inicial',
    icon: '🌱',
    color: 'emerald',
    requirements: ['Modelo de negocio validado', 'Usuarios recurrentes'],
    minQuestsCompleted: 12,
  },
  ACCELERATE: {
    stage: 'ACCELERATE',
    title: 'Accelerate',
    description: 'Aceleración y escala',
    icon: '⚡',
    color: 'orange',
    requirements: ['Revenue generado', 'Equipo completo'],
    minQuestsCompleted: 15,
    minTeamMembers: 3,
  },
  SCALE: {
    stage: 'SCALE',
    title: 'Scale',
    description: 'Escalamiento masivo',
    icon: '🎯',
    color: 'purple',
    requirements: ['Product-market fit', 'Crecimiento sostenible'],
    minQuestsCompleted: 20,
  },
}

/**
 * Stage progression order
 */
export const STAGE_ORDER: ProjectStage[] = [
  'IDEA',
  'PROTOTYPE',
  'BUILD',
  'PROJECT',
  'INCUBATE',
  'ACCELERATE',
  'SCALE',
]

/**
 * Get stage index in progression
 */
export function getStageIndex(stage: ProjectStage): number {
  return STAGE_ORDER.indexOf(stage)
}

/**
 * Get next stage in progression
 */
export function getNextStage(currentStage: ProjectStage): ProjectStage | null {
  const currentIndex = getStageIndex(currentStage)
  if (currentIndex === -1 || currentIndex === STAGE_ORDER.length - 1) {
    return null
  }
  return STAGE_ORDER[currentIndex + 1]
}

/**
 * Get previous stage in progression
 */
export function getPreviousStage(currentStage: ProjectStage): ProjectStage | null {
  const currentIndex = getStageIndex(currentStage)
  if (currentIndex <= 0) {
    return null
  }
  return STAGE_ORDER[currentIndex - 1]
}

/**
 * Check if a stage is higher than another
 */
export function isStageHigherThan(stage: ProjectStage, compareStage: ProjectStage): boolean {
  return getStageIndex(stage) > getStageIndex(compareStage)
}

/**
 * Calculate stage progress percentage (0-100)
 */
export function calculateStageProgress(currentStage: ProjectStage): number {
  const currentIndex = getStageIndex(currentStage)
  const totalStages = STAGE_ORDER.length
  return Math.round(((currentIndex + 1) / totalStages) * 100)
}

/**
 * Get stage color class for Tailwind
 */
export function getStageColorClass(stage: ProjectStage): string {
  const config = STAGES[stage]
  return `text-${config.color}-600`
}

/**
 * Get stage background color class for Tailwind
 */
export function getStageBgColorClass(stage: ProjectStage): string {
  const config = STAGES[stage]
  return `bg-${config.color}-100`
}

/**
 * Check if project can advance to next stage based on quest completion
 */
export function canAdvanceStage(
  currentStage: ProjectStage,
  questsCompleted: number,
  teamMemberCount?: number
): { canAdvance: boolean; reason?: string } {
  const nextStage = getNextStage(currentStage)

  if (!nextStage) {
    return { canAdvance: false, reason: 'Ya estás en la última etapa' }
  }

  const nextStageConfig = STAGES[nextStage]

  // Check quest requirements
  if (nextStageConfig.minQuestsCompleted && questsCompleted < nextStageConfig.minQuestsCompleted) {
    const remaining = nextStageConfig.minQuestsCompleted - questsCompleted
    return {
      canAdvance: false,
      reason: `Necesitas completar ${remaining} quest${remaining > 1 ? 's' : ''} más`,
    }
  }

  // Check team member requirements
  if (nextStageConfig.minTeamMembers && teamMemberCount && teamMemberCount < nextStageConfig.minTeamMembers) {
    const needed = nextStageConfig.minTeamMembers - teamMemberCount
    return {
      canAdvance: false,
      reason: `Necesitas ${needed} miembro${needed > 1 ? 's' : ''} más en tu equipo`,
    }
  }

  return { canAdvance: true }
}

/**
 * Get progress toward next stage
 */
export function getProgressToNextStage(
  currentStage: ProjectStage,
  questsCompleted: number
): { progress: number; questsNeeded: number; questsRemaining: number } | null {
  const nextStage = getNextStage(currentStage)

  if (!nextStage) {
    return null
  }

  const nextStageConfig = STAGES[nextStage]
  const questsNeeded = nextStageConfig.minQuestsCompleted || 0

  if (questsNeeded === 0) {
    return { progress: 100, questsNeeded: 0, questsRemaining: 0 }
  }

  const progress = Math.min(100, Math.round((questsCompleted / questsNeeded) * 100))
  const questsRemaining = Math.max(0, questsNeeded - questsCompleted)

  return { progress, questsNeeded, questsRemaining }
}
