/**
 * User Quests Controller
 * Business logic for individual quest submissions and progress tracking
 */

import { db } from '@/db'
import { quests, userQuests } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

/**
 * Get a user's quest by quest ID
 */
export async function getUserQuest(userId: string, questId: string) {
  const [userQuest] = await db
    .select({
      userQuest: userQuests,
      quest: quests,
    })
    .from(userQuests)
    .innerJoin(quests, eq(userQuests.questId, quests.id))
    .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)))

  if (!userQuest) {
    return null
  }

  return {
    ...userQuest.userQuest,
    quest: userQuest.quest,
  }
}

/**
 * Start a quest for a user (assign quest to user)
 */
export async function startQuest(userId: string, questId: string) {
  // Check if quest exists
  const [quest] = await db.select().from(quests).where(eq(quests.id, questId))

  if (!quest) {
    throw new Error('Quest not found')
  }

  // Check if quest is individual or both
  if (quest.questType === 'TEAM') {
    throw new Error('This quest is team-only. Apply through your project.')
  }

  // Check if already started
  const existing = await getUserQuest(userId, questId)
  if (existing) {
    throw new Error('Quest already started')
  }

  // Check max submissions if applicable
  if (quest.maxSubmissions) {
    const [submissionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userQuests)
      .where(eq(userQuests.questId, questId))

    if (Number(submissionCount.count) >= quest.maxSubmissions) {
      throw new Error('Quest has reached maximum submissions')
    }
  }

  // Create user quest
  const [newUserQuest] = await db
    .insert(userQuests)
    .values({
      userId,
      questId,
      status: 'NOT_STARTED',
      progress: 0,
    })
    .returning()

  return newUserQuest
}

/**
 * Update quest progress
 */
export async function updateQuestProgress(
  userId: string,
  questId: string,
  data: {
    progress?: number
    submissionText?: string
    submissionUrls?: string[]
  }
) {
  // Validate progress range
  if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
    throw new Error('Progress must be between 0 and 100')
  }

  // Check if user has this quest
  const existing = await getUserQuest(userId, questId)
  if (!existing) {
    throw new Error('Quest not found for user')
  }

  if (existing.status === 'COMPLETED') {
    throw new Error('Quest already completed')
  }

  // Determine new status based on progress
  let newStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' =
    existing.status
  if (data.progress !== undefined) {
    if (data.progress === 100) {
      newStatus = 'COMPLETED'
    } else if (data.progress > 0) {
      newStatus = 'IN_PROGRESS'
    }
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (data.progress !== undefined) {
    updateData.progress = data.progress
    updateData.status = newStatus
  }

  if (data.submissionText !== undefined) {
    updateData.submissionText = data.submissionText
  }

  if (data.submissionUrls !== undefined) {
    updateData.submissionUrls = data.submissionUrls
  }

  if (newStatus === 'COMPLETED') {
    updateData.completedAt = new Date()
  }

  // Update user quest
  const [updated] = await db
    .update(userQuests)
    .set(updateData)
    .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)))
    .returning()

  return updated
}

/**
 * Submit quest for completion (convenience method)
 */
export async function submitQuest(
  userId: string,
  questId: string,
  data: {
    submissionText: string
    submissionUrls?: string[]
  }
) {
  // Check if user has this quest
  const existing = await getUserQuest(userId, questId)
  if (!existing) {
    throw new Error('Quest not found for user')
  }

  if (existing.status === 'COMPLETED') {
    throw new Error('Quest already completed')
  }

  // Submit with 100% progress
  return updateQuestProgress(userId, questId, {
    progress: 100,
    submissionText: data.submissionText,
    submissionUrls: data.submissionUrls,
  })
}

/**
 * Get submission history for a user's quest
 * Note: Currently uses the main userQuests record
 * TODO: Add separate submissions table for full history tracking
 */
export async function getQuestSubmissionHistory(userId: string, questId: string) {
  const userQuest = await getUserQuest(userId, questId)

  if (!userQuest || !userQuest.submissionText) {
    return []
  }

  // Return the current submission as history
  // In the future, this would query a separate submissions table
  return [
    {
      id: userQuest.id,
      progress: userQuest.progress,
      description: userQuest.submissionText,
      links: userQuest.submissionUrls || [],
      submittedAt: userQuest.updatedAt,
    },
  ]
}
