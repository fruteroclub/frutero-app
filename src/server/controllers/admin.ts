/**
 * Admin Controller
 * Business logic for admin operations and quest verification
 */

import { db } from '@/db'
import { users, projectQuests, quests, projects, userSettings } from '@/db/schema'
import { eq, and, sql, gte } from 'drizzle-orm'
import { checkStageAdvancement } from './jam/stages.controller'
import type { Track } from '@/types/jam'

/**
 * Check if user has admin permissions
 */
export async function checkAdminPermissions(userId: string): Promise<boolean> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  return user?.isAdmin === true
}

/**
 * Get submissions by status
 */
export async function getSubmissionsByStatus(
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED'
) {
  const submissions = await db
    .select({
      projectQuest: projectQuests,
      quest: quests,
      project: projects,
      submitter: users,
    })
    .from(projectQuests)
    .innerJoin(quests, eq(projectQuests.questId, quests.id))
    .innerJoin(projects, eq(projectQuests.projectId, projects.id))
    .leftJoin(users, eq(projectQuests.submittedBy, users.id))
    .where(eq(projectQuests.status, status))
    .orderBy(projectQuests.submittedAt)

  return submissions.map((item) => ({
    ...item.projectQuest,
    quest: item.quest,
    project: {
      id: item.project.id,
      name: item.project.name,
      walletAddress: item.project.walletAddress,
    },
    submitter: item.submitter
      ? {
          id: item.submitter.id,
          displayName: item.submitter.displayName,
          avatarUrl: item.submitter.avatarUrl,
        }
      : null,
  }))
}

/**
 * Get verification statistics
 */
export async function getVerificationStats() {
  // Pending submissions
  const [pendingResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectQuests)
    .where(eq(projectQuests.status, 'SUBMITTED'))

  // Verified today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [verifiedTodayResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectQuests)
    .where(
      and(
        eq(projectQuests.status, 'VERIFIED'),
        gte(projectQuests.verifiedAt, today)
      )
    )

  // Total bounties paid
  const [totalPaidResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(${quests.bountyUsd}), 0)` })
    .from(projectQuests)
    .innerJoin(quests, eq(projectQuests.questId, quests.id))
    .where(
      and(
        eq(projectQuests.status, 'VERIFIED'),
        sql`${projectQuests.paidAt} IS NOT NULL`
      )
    )

  return {
    pending: Number(pendingResult.count),
    verifiedToday: Number(verifiedTodayResult.count),
    totalPaid: Number(totalPaidResult.total),
  }
}

/**
 * Verify a submission
 */
export async function verifySubmission(
  projectQuestId: string,
  adminId: string,
  data: {
    verificationNotes?: string
    paymentTxHash?: string
  }
) {
  // Check admin permissions
  const isAdmin = await checkAdminPermissions(adminId)
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin permissions required')
  }

  // Get current submission
  const [submission] = await db
    .select()
    .from(projectQuests)
    .where(eq(projectQuests.id, projectQuestId))
    .limit(1)

  if (!submission) {
    throw new Error('Submission not found')
  }

  if (submission.status !== 'SUBMITTED') {
    throw new Error('Only submitted quests can be verified')
  }

  // Update with verification data
  const updateData: Record<string, unknown> = {
    status: 'VERIFIED',
    isVerified: true,
    verifiedBy: adminId,
    verificationNotes: data.verificationNotes || null,
    verifiedAt: new Date(),
    updatedAt: new Date(),
  }

  // Add payment data if provided
  if (data.paymentTxHash) {
    updateData.paymentTxHash = data.paymentTxHash
    updateData.paidAt = new Date()
  }

  const [updated] = await db
    .update(projectQuests)
    .set(updateData)
    .where(eq(projectQuests.id, projectQuestId))
    .returning()

  // Check if project can advance to next stage after quest verification
  try {
    const advancementCheck = await checkStageAdvancement(submission.projectId)

    // Log advancement opportunity (could be used for notifications)
    if (advancementCheck.canAdvance && advancementCheck.nextStage) {
      console.log(
        `[Stage Advancement] Project ${submission.projectId} can advance to ${advancementCheck.nextStage}`
      )
      // Note: Actual advancement is manual via UI to give teams control
    }
  } catch (error) {
    // Don't fail verification if stage check fails
    console.error('Stage advancement check failed:', error)
  }

  return updated
}

/**
 * Reject a submission
 */
export async function rejectSubmission(
  projectQuestId: string,
  adminId: string,
  reason: string
) {
  // Check admin permissions
  const isAdmin = await checkAdminPermissions(adminId)
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin permissions required')
  }

  // Get current submission
  const [submission] = await db
    .select()
    .from(projectQuests)
    .where(eq(projectQuests.id, projectQuestId))
    .limit(1)

  if (!submission) {
    throw new Error('Submission not found')
  }

  if (submission.status !== 'SUBMITTED') {
    throw new Error('Only submitted quests can be rejected')
  }

  // Update with rejection data
  const [updated] = await db
    .update(projectQuests)
    .set({
      status: 'REJECTED',
      isVerified: false,
      verifiedBy: adminId,
      verificationNotes: reason,
      verifiedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(projectQuests.id, projectQuestId))
    .returning()

  return updated
}

/**
 * Create a new quest (admin only)
 */
export async function createQuest(
  adminId: string,
  data: {
    title: string
    description?: string
    start: Date
    end: Date
    rewardPoints?: number
    category?: string
    difficulty?: string
    availableFrom?: Date
    dueDate?: Date
    questType: 'INDIVIDUAL' | 'TEAM' | 'BOTH'
    bountyUsd?: number
    maxSubmissions?: number
    programId?: string
    projectId?: string
    badgeId?: string
  }
) {
  // Check admin permissions
  const isAdmin = await checkAdminPermissions(adminId)
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin permissions required')
  }

  // Validate required fields
  if (!data.title || !data.start || !data.end) {
    throw new Error('Title, start date, and end date are required')
  }

  // Validate quest type
  if (!['INDIVIDUAL', 'TEAM', 'BOTH'].includes(data.questType)) {
    throw new Error('Invalid quest type. Must be INDIVIDUAL, TEAM, or BOTH')
  }

  // Create quest
  const [quest] = await db
    .insert(quests)
    .values({
      title: data.title,
      description: data.description || null,
      start: data.start,
      end: data.end,
      rewardPoints: data.rewardPoints || 0,
      category: data.category || null,
      difficulty: data.difficulty || null,
      availableFrom: data.availableFrom || null,
      dueDate: data.dueDate || null,
      questType: data.questType,
      bountyUsd: data.bountyUsd || null,
      maxSubmissions: data.maxSubmissions || null,
      programId: data.programId || null,
      projectId: data.projectId || null,
      badgeId: data.badgeId || null,
    })
    .returning()

  return quest
}

/**
 * Update an existing quest (admin only)
 */
export async function updateQuest(
  questId: string,
  adminId: string,
  data: {
    title?: string
    description?: string
    start?: Date
    end?: Date
    rewardPoints?: number
    category?: string
    difficulty?: string
    availableFrom?: Date
    dueDate?: Date
    questType?: 'INDIVIDUAL' | 'TEAM' | 'BOTH'
    bountyUsd?: number
    maxSubmissions?: number
    programId?: string
    projectId?: string
    badgeId?: string
  }
) {
  // Check admin permissions
  const isAdmin = await checkAdminPermissions(adminId)
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin permissions required')
  }

  // Check if quest exists
  const [existingQuest] = await db
    .select()
    .from(quests)
    .where(eq(quests.id, questId))
    .limit(1)

  if (!existingQuest) {
    throw new Error('Quest not found')
  }

  // Validate quest type if provided
  if (data.questType && !['INDIVIDUAL', 'TEAM', 'BOTH'].includes(data.questType)) {
    throw new Error('Invalid quest type. Must be INDIVIDUAL, TEAM, or BOTH')
  }

  // Build update data
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (data.title !== undefined) updateData.title = data.title
  if (data.description !== undefined) updateData.description = data.description
  if (data.start !== undefined) updateData.start = data.start
  if (data.end !== undefined) updateData.end = data.end
  if (data.rewardPoints !== undefined) updateData.rewardPoints = data.rewardPoints
  if (data.category !== undefined) updateData.category = data.category
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty
  if (data.availableFrom !== undefined) updateData.availableFrom = data.availableFrom
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate
  if (data.questType !== undefined) updateData.questType = data.questType
  if (data.bountyUsd !== undefined) updateData.bountyUsd = data.bountyUsd
  if (data.maxSubmissions !== undefined) updateData.maxSubmissions = data.maxSubmissions
  if (data.programId !== undefined) updateData.programId = data.programId
  if (data.projectId !== undefined) updateData.projectId = data.projectId
  if (data.badgeId !== undefined) updateData.badgeId = data.badgeId

  // Update quest
  const [updated] = await db
    .update(quests)
    .set(updateData)
    .where(eq(quests.id, questId))
    .returning()

  return updated
}

/**
 * Delete a quest (admin only)
 */
export async function deleteQuest(questId: string, adminId: string) {
  // Check admin permissions
  const isAdmin = await checkAdminPermissions(adminId)
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin permissions required')
  }

  // Check if quest exists
  const [existingQuest] = await db
    .select()
    .from(quests)
    .where(eq(quests.id, questId))
    .limit(1)

  if (!existingQuest) {
    throw new Error('Quest not found')
  }

  // Delete quest (cascade will handle related records)
  await db.delete(quests).where(eq(quests.id, questId))

  return { success: true }
}

/**
 * Get track analytics for admin dashboard
 * JAM-013: Track Selection System
 */
export async function getTrackAnalytics() {
  // Get total users per track
  const trackDistribution = await db
    .select({
      track: userSettings.track,
      count: sql<number>`count(*)`,
    })
    .from(userSettings)
    .where(sql`${userSettings.track} IS NOT NULL`)
    .groupBy(userSettings.track)

  // Get users without track selected
  const [noTrackResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userSettings)
    .where(sql`${userSettings.track} IS NULL`)

  // Calculate track completion rates (users who changed tracks at least once)
  const activeTrackers = await db
    .select({
      track: userSettings.track,
      count: sql<number>`count(*)`,
    })
    .from(userSettings)
    .where(
      and(
        sql`${userSettings.track} IS NOT NULL`,
        sql`${userSettings.trackChangeCount} > 0`
      )
    )
    .groupBy(userSettings.track)

  // Format results
  const distribution: Record<Track, number> = {
    LEARNING: 0,
    FOUNDER: 0,
    PROFESSIONAL: 0,
    FREELANCER: 0,
  }

  const activeByTrack: Record<Track, number> = {
    LEARNING: 0,
    FOUNDER: 0,
    PROFESSIONAL: 0,
    FREELANCER: 0,
  }

  trackDistribution.forEach((item) => {
    if (item.track) {
      distribution[item.track as Track] = Number(item.count)
    }
  })

  activeTrackers.forEach((item) => {
    if (item.track) {
      activeByTrack[item.track as Track] = Number(item.count)
    }
  })

  const totalWithTrack = Object.values(distribution).reduce((a, b) => a + b, 0)
  const noTrack = Number(noTrackResult.count)

  return {
    distribution,
    activeByTrack,
    totalWithTrack,
    noTrack,
    totalUsers: totalWithTrack + noTrack,
  }
}
