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
