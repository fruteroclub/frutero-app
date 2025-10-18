/**
 * Stages Service
 * Frontend service layer for stage advancement API calls
 */

import type { ProjectStage } from '@/lib/jam/stages'

export interface StageAdvancementCheck {
  canAdvance: boolean
  currentStage: ProjectStage
  nextStage: ProjectStage | null
  missingRequirements: string[]
  questsCompleted: number
  teamMembersCount: number
}

/**
 * Check if a project can advance to the next stage
 */
export async function checkStageAdvancement(projectSlug: string): Promise<StageAdvancementCheck> {
  try {
    const res = await fetch(`/api/jam/projects/${projectSlug}/stage/check`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to check stage advancement' }))
      throw new Error(error.error || 'Failed to check stage advancement')
    }

    return res.json()
  } catch (error) {
    console.error('Check stage advancement error:', error)
    throw error
  }
}

/**
 * Advance a project to the next stage
 */
export async function advanceProjectStage(projectSlug: string): Promise<{ stage: ProjectStage }> {
  try {
    const res = await fetch(`/api/jam/projects/${projectSlug}/stage/advance`, {
      method: 'POST',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to advance stage' }))
      throw new Error(error.error || 'Failed to advance stage')
    }

    return res.json()
  } catch (error) {
    console.error('Advance project stage error:', error)
    throw error
  }
}

/**
 * Manually set a project stage (admin only)
 */
export async function setProjectStage(
  projectSlug: string,
  newStage: ProjectStage
): Promise<{ stage: ProjectStage }> {
  try {
    const res = await fetch(`/api/jam/projects/${projectSlug}/stage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stage: newStage }),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to set stage' }))
      throw new Error(error.error || 'Failed to set stage')
    }

    return res.json()
  } catch (error) {
    console.error('Set project stage error:', error)
    throw error
  }
}
