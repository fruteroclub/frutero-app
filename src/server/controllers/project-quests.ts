/**
 * Project Quest Controller
 * Business logic for team quest submission workflow
 */

import { db } from '@/db'
import {
  quests,
  projectQuests,
  projectMembers,
  programProjects,
} from '@/db/schema'
import { eq, and, or, sql, inArray } from 'drizzle-orm'

export interface GetProjectQuestsFilters {
  type?: 'TEAM' | 'BOTH'
  category?: string
  difficulty?: string
  status?: string
}

/**
 * Get available team quests for a project based on program participation
 */
export async function getAvailableTeamQuestsForProject(projectId: string) {
  // Get programs this project is participating in
  const projectPrograms = await db
    .select()
    .from(programProjects)
    .where(eq(programProjects.projectId, projectId))

  const programIds = projectPrograms.map((pp) => pp.programId)

  if (programIds.length === 0) {
    return []
  }

  // Get team quests for these programs
  const query = db
    .select()
    .from(quests)
    .where(
      and(
        or(eq(quests.questType, 'TEAM'), eq(quests.questType, 'BOTH')),
        inArray(quests.programId, programIds)
      )
    )

  const availableQuests = await query.orderBy(quests.availableFrom)

  // Calculate current submissions for each quest in a single query
  const questsWithSubmissions = await db
    .select({
      quest: quests,
      submissionCount: sql<number>`count(${projectQuests.id})`.as('submission_count'),
    })
    .from(quests)
    .leftJoin(projectQuests, eq(quests.id, projectQuests.questId))
    .where(
      and(
        or(eq(quests.questType, 'TEAM'), eq(quests.questType, 'BOTH')),
        inArray(quests.id, availableQuests.map((q) => q.id))
      )
    )
    .groupBy(quests.id)
    .orderBy(quests.availableFrom)

  return questsWithSubmissions.map((item) => ({
    ...item.quest,
    currentSubmissions: Number(item.submissionCount),
  }))
}

/**
 * Get all quests for a project (applied/active quests)
 */
export async function getProjectQuests(projectId: string) {
  const projectQuestsList = await db
    .select({
      projectQuest: projectQuests,
      quest: quests,
    })
    .from(projectQuests)
    .innerJoin(quests, eq(projectQuests.questId, quests.id))
    .where(eq(projectQuests.projectId, projectId))

  return projectQuestsList.map((item) => ({
    ...item.projectQuest,
    quest: item.quest,
  }))
}

/**
 * Get a single project quest by ID
 */
export async function getProjectQuestById(
  projectId: string,
  questId: string
) {
  const [projectQuest] = await db
    .select({
      projectQuest: projectQuests,
      quest: quests,
    })
    .from(projectQuests)
    .innerJoin(quests, eq(projectQuests.questId, quests.id))
    .where(
      and(
        eq(projectQuests.projectId, projectId),
        eq(projectQuests.questId, questId)
      )
    )

  if (!projectQuest) {
    return null
  }

  return {
    ...projectQuest.projectQuest,
    quest: projectQuest.quest,
  }
}

/**
 * Check if user is a member of the project
 */
export async function checkProjectMembership(
  projectId: string,
  userId: string
): Promise<boolean> {
  const [membership] = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId)
      )
    )
    .limit(1)

  return !!membership
}

/**
 * Create a project quest application (apply to quest)
 */
export async function createProjectQuest(
  projectId: string,
  questId: string,
  userId: string
) {
  // Check if user is a project member
  const isMember = await checkProjectMembership(projectId, userId)
  if (!isMember) {
    throw new Error('Only team members can apply to quests')
  }

  // Check if already applied
  const [existing] = await db
    .select()
    .from(projectQuests)
    .where(
      and(eq(projectQuests.projectId, projectId), eq(projectQuests.questId, questId))
    )
    .limit(1)

  if (existing) {
    throw new Error('Project already applied to this quest')
  }

  // Check quest availability
  const [quest] = await db
    .select()
    .from(quests)
    .where(eq(quests.id, questId))
    .limit(1)

  if (!quest) {
    throw new Error('Quest not found')
  }

  // Check max submissions
  if (quest.maxSubmissions) {
    const [submissionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectQuests)
      .where(eq(projectQuests.questId, questId))

    if (Number(submissionCount.count) >= quest.maxSubmissions) {
      throw new Error('Quest has reached maximum submissions')
    }
  }

  // Create project quest entry
  const [newProjectQuest] = await db
    .insert(projectQuests)
    .values({
      projectId,
      questId,
      status: 'NOT_STARTED',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return newProjectQuest
}

/**
 * Update project quest progress
 */
export async function updateProjectQuest(
  projectId: string,
  questId: string,
  data: {
    progress?: number
    submissionLink?: string
    submissionText?: string
    status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED'
  },
  userId: string
) {
  // Check if user is a project member
  const isMember = await checkProjectMembership(projectId, userId)
  if (!isMember) {
    throw new Error('Only team members can update quest progress')
  }

  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date(),
  }

  // Auto-set IN_PROGRESS if progress > 0 and < 100
  if (data.progress && data.progress > 0 && data.progress < 100) {
    updateData.status = 'IN_PROGRESS'
  }

  const [updated] = await db
    .update(projectQuests)
    .set(updateData)
    .where(
      and(
        eq(projectQuests.projectId, projectId),
        eq(projectQuests.questId, questId)
      )
    )
    .returning()

  return updated
}

/**
 * Submit project quest for verification
 */
export async function submitProjectQuest(
  projectId: string,
  questId: string,
  submissionData: {
    submissionLink: string
    submissionText: string
  },
  userId: string
) {
  // Check if user is a project member
  const isMember = await checkProjectMembership(projectId, userId)
  if (!isMember) {
    throw new Error('Only team members can submit quests')
  }

  // Get current quest status
  const [projectQuest] = await db
    .select()
    .from(projectQuests)
    .where(
      and(
        eq(projectQuests.projectId, projectId),
        eq(projectQuests.questId, questId)
      )
    )
    .limit(1)

  if (!projectQuest) {
    throw new Error('Project quest not found')
  }

  if (projectQuest.status === 'SUBMITTED' || projectQuest.status === 'VERIFIED') {
    throw new Error('Quest already submitted')
  }

  // Update with submission data
  const [updated] = await db
    .update(projectQuests)
    .set({
      status: 'SUBMITTED',
      progress: 100,
      submissionLink: submissionData.submissionLink,
      submissionText: submissionData.submissionText,
      submittedAt: new Date(),
      submittedBy: userId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(projectQuests.projectId, projectId),
        eq(projectQuests.questId, questId)
      )
    )
    .returning()

  return updated
}
