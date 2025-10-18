/**
 * Admin Controller
 * Business logic for admin-specific operations
 */

import { db } from '@/db'
import { userQuests, projectQuests, users, projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface QuestSubmission {
  id: string
  questId: string
  userId?: string
  userName?: string
  userEmail?: string
  projectId?: string
  projectName?: string
  status: string
  progress: number
  submissionText?: string | null
  submissionUrls?: string[] | null
  submissionLink?: string | null
  startedAt?: Date | null
  completedAt?: Date | null
  submittedAt?: Date | null
  submittedBy?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Get all submissions for a specific quest (both individual and team)
 */
export async function getQuestSubmissions(questId: string): Promise<QuestSubmission[]> {
  try {
    // Fetch individual user quest submissions
    const individualSubmissions = await db
      .select({
        id: userQuests.id,
        questId: userQuests.questId,
        userId: userQuests.userId,
        status: userQuests.status,
        progress: userQuests.progress,
        submissionText: userQuests.submissionText,
        submissionUrls: userQuests.submissionUrls,
        startedAt: userQuests.startedAt,
        completedAt: userQuests.completedAt,
        createdAt: userQuests.createdAt,
        updatedAt: userQuests.updatedAt,
        userName: users.displayName,
        userEmail: users.email,
      })
      .from(userQuests)
      .leftJoin(users, eq(userQuests.userId, users.id))
      .where(eq(userQuests.questId, questId))

    // Fetch team/project quest submissions
    const teamSubmissions = await db
      .select({
        id: projectQuests.id,
        questId: projectQuests.questId,
        projectId: projectQuests.projectId,
        status: projectQuests.status,
        progress: projectQuests.progress,
        submissionText: projectQuests.submissionText,
        submissionLink: projectQuests.submissionLink,
        submittedAt: projectQuests.submittedAt,
        submittedBy: projectQuests.submittedBy,
        createdAt: projectQuests.createdAt,
        updatedAt: projectQuests.updatedAt,
        projectName: projects.name,
      })
      .from(projectQuests)
      .leftJoin(projects, eq(projectQuests.projectId, projects.id))
      .where(eq(projectQuests.questId, questId))

    // Combine and normalize submissions
    const allSubmissions: QuestSubmission[] = [
      ...individualSubmissions.map((sub) => ({
        id: sub.id,
        questId: sub.questId,
        userId: sub.userId,
        userName: sub.userName || undefined,
        userEmail: sub.userEmail || undefined,
        status: sub.status,
        progress: sub.progress,
        submissionText: sub.submissionText || undefined,
        submissionUrls: sub.submissionUrls || undefined,
        startedAt: sub.startedAt || undefined,
        completedAt: sub.completedAt || undefined,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      })),
      ...teamSubmissions.map((sub) => ({
        id: sub.id,
        questId: sub.questId,
        projectId: sub.projectId,
        projectName: sub.projectName || undefined,
        status: sub.status,
        progress: sub.progress,
        submissionText: sub.submissionText || undefined,
        submissionLink: sub.submissionLink || undefined,
        submittedAt: sub.submittedAt || undefined,
        submittedBy: sub.submittedBy || undefined,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      })),
    ]

    // Sort by most recent first
    allSubmissions.sort((a, b) => {
      const dateA = a.completedAt || a.submittedAt || a.startedAt || a.createdAt
      const dateB = b.completedAt || b.submittedAt || b.startedAt || b.createdAt
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

    return allSubmissions
  } catch (error) {
    console.error('Get quest submissions error:', error)
    throw new Error('Failed to get quest submissions')
  }
}
