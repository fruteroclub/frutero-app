import { db } from '@/db'
import { projects, projectMembers, programProjects, projectQuests } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import type { ProjectStage } from '@/lib/jam/stages'
import { canAdvanceStage, getNextStage } from '@/lib/jam/stages'
import { AppError } from '@/server/utils'

/**
 * Generate URL-friendly slug from project name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate unique slug with collision handling
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  let slug = generateSlug(name)
  let counter = 1

  while (true) {
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1)

    if (existing.length === 0) {
      return slug
    }

    slug = `${generateSlug(name)}-${counter}`
    counter++
  }
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1)

  return project || null
}

/**
 * Get project members with user details
 */
export async function getProjectMembers(projectId: string) {
  const members = await db
    .select({
      userId: projectMembers.userId,
      role: projectMembers.role,
      joinedAt: projectMembers.joinedAt,
    })
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId))

  return members
}

/**
 * Get programs a project is participating in
 */
export async function getProjectPrograms(projectId: string) {
  const programs = await db
    .select()
    .from(programProjects)
    .where(eq(programProjects.projectId, projectId))

  return programs
}

/**
 * Get completed quest count for a project
 */
export async function getCompletedQuestCount(projectSlug: string): Promise<number> {
  const project = await getProjectBySlug(projectSlug)

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  const result = await db
    .select({ count: count() })
    .from(projectQuests)
    .where(
      and(
        eq(projectQuests.projectId, project.id),
        eq(projectQuests.status, 'VERIFIED')
      )
    )

  return result[0]?.count || 0
}

/**
 * Check if project can advance to next stage
 */
export async function checkStageAdvancement(projectSlug: string): Promise<{
  canAdvance: boolean
  currentStage: ProjectStage
  nextStage: ProjectStage | null
  questsCompleted: number
  reason?: string
}> {
  const project = await getProjectBySlug(projectSlug)

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  const questsCompleted = await getCompletedQuestCount(projectSlug)
  const members = await getProjectMembers(project.id)
  const teamMemberCount = members.length

  const currentStage = project.stage as ProjectStage
  const nextStage = getNextStage(currentStage)

  const { canAdvance, reason } = canAdvanceStage(
    currentStage,
    questsCompleted,
    teamMemberCount
  )

  return {
    canAdvance,
    currentStage,
    nextStage,
    questsCompleted,
    reason,
  }
}

/**
 * Advance project to next stage
 */
export async function advanceProjectStage(
  projectSlug: string,
  manualOverride = false
): Promise<{ project: typeof projects.$inferSelect; previousStage: ProjectStage }> {
  const project = await getProjectBySlug(projectSlug)

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  const currentStage = project.stage as ProjectStage
  const nextStage = getNextStage(currentStage)

  if (!nextStage) {
    throw new AppError('Ya estás en la última etapa', 400)
  }

  // Check if advancement is allowed (unless manual override)
  if (!manualOverride) {
    const advancement = await checkStageAdvancement(projectSlug)

    if (!advancement.canAdvance) {
      throw new AppError(advancement.reason || 'No se puede avanzar de etapa', 400)
    }
  }

  // Update project stage
  const [updatedProject] = await db
    .update(projects)
    .set({
      stage: nextStage,
      updatedAt: new Date()
    })
    .where(eq(projects.id, project.id))
    .returning()

  return {
    project: updatedProject,
    previousStage: currentStage,
  }
}
