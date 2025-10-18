/**
 * Stages Controller
 * Business logic for project stage advancement
 */

import { db } from '@/db'
import { projects, projectQuests, projectMembers } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { STAGES, getNextStage, type ProjectStage } from '@/lib/jam/stages'

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
export async function checkStageAdvancement(projectId: string): Promise<StageAdvancementCheck> {
  try {
    // Get project details
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))

    if (!project) {
      throw new Error('Project not found')
    }

    const currentStage = project.stage as ProjectStage
    const nextStage = getNextStage(currentStage)

    if (!nextStage) {
      return {
        canAdvance: false,
        currentStage,
        nextStage: null,
        missingRequirements: ['Already at highest stage'],
        questsCompleted: 0,
        teamMembersCount: 0,
      }
    }

    const nextStageConfig = STAGES[nextStage]
    const missingRequirements: string[] = []

    // Check quests completed
    const [questStats] = await db
      .select({ count: count() })
      .from(projectQuests)
      .where(
        and(
          eq(projectQuests.projectId, projectId),
          eq(projectQuests.status, 'VERIFIED')
        )
      )

    const questsCompleted = questStats?.count || 0

    if (nextStageConfig.minQuestsCompleted && questsCompleted < nextStageConfig.minQuestsCompleted) {
      missingRequirements.push(
        `Completar ${nextStageConfig.minQuestsCompleted} quests (actualmente: ${questsCompleted})`
      )
    }

    // Check team members
    const [memberStats] = await db
      .select({ count: count() })
      .from(projectMembers)
      .where(eq(projectMembers.projectId, projectId))

    const teamMembersCount = memberStats?.count || 0

    if (nextStageConfig.minTeamMembers && teamMembersCount < nextStageConfig.minTeamMembers) {
      missingRequirements.push(
        `Tener al menos ${nextStageConfig.minTeamMembers} miembros (actualmente: ${teamMembersCount})`
      )
    }

    // Check required deliverables
    if (nextStageConfig.requiredDeliverables) {
      for (const deliverable of nextStageConfig.requiredDeliverables) {
        const value = project[deliverable as keyof typeof project]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingRequirements.push(`Completar: ${deliverable}`)
        }
      }
    }

    return {
      canAdvance: missingRequirements.length === 0,
      currentStage,
      nextStage,
      missingRequirements,
      questsCompleted,
      teamMembersCount,
    }
  } catch (error) {
    console.error('Check stage advancement error:', error)
    throw new Error('Failed to check stage advancement')
  }
}

/**
 * Advance a project to the next stage
 */
export async function advanceProjectStage(projectId: string): Promise<ProjectStage> {
  try {
    // Check if advancement is allowed
    const check = await checkStageAdvancement(projectId)

    if (!check.canAdvance) {
      throw new Error(
        `Cannot advance: ${check.missingRequirements.join(', ')}`
      )
    }

    if (!check.nextStage) {
      throw new Error('Project is already at highest stage')
    }

    // Update project stage
    const [updated] = await db
      .update(projects)
      .set({
        stage: check.nextStage,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning()

    if (!updated) {
      throw new Error('Failed to update project stage')
    }

    return updated.stage as ProjectStage
  } catch (error) {
    console.error('Advance project stage error:', error)
    throw error instanceof Error ? error : new Error('Failed to advance project stage')
  }
}

/**
 * Manually set a project stage (admin only)
 */
export async function setProjectStage(
  projectId: string,
  newStage: ProjectStage
): Promise<ProjectStage> {
  try {
    const [updated] = await db
      .update(projects)
      .set({
        stage: newStage,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning()

    if (!updated) {
      throw new Error('Failed to update project stage')
    }

    return updated.stage as ProjectStage
  } catch (error) {
    console.error('Set project stage error:', error)
    throw new Error('Failed to set project stage')
  }
}

/**
 * Get stage history for a project (future feature - needs audit table)
 */
// export async function getStageHistory(projectId: string) {
//   // TODO: Implement with audit log table
//   return []
// }
