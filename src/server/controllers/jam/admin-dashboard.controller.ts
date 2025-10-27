/**
 * Admin Dashboard Controller
 * Business logic for admin dashboard statistics and overview
 */

import { db } from '@/db'
import { users, projects, quests, userQuests, projectQuests, programs } from '@/db/schema'
import { sql, eq, and, gte } from 'drizzle-orm'
import { getTrackAnalytics } from '../admin'
import type { Track } from '@/types/jam'

export interface AdminDashboardStats {
  users: {
    total: number
    admins: number
    recentlyJoined: number
  }
  projects: {
    total: number
    byStage: Record<string, number>
    activeProjects: number
  }
  quests: {
    total: number
    individual: number
    team: number
    completed: number
    pending: number
  }
  submissions: {
    pendingVerification: number
    verifiedToday: number
    totalBountiesPaid: number
  }
  programs: {
    total: number
    active: number
  }
  tracks: {
    distribution: Record<Track, number>
    activeByTrack: Record<Track, number>
    totalWithTrack: number
    noTrack: number
    totalUsers: number
  }
}

/**
 * Get comprehensive admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    // User statistics
    const [totalUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)

    const [totalAdminsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isAdmin, true))

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [recentUsersResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, sevenDaysAgo))

    // Project statistics
    const [totalProjectsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)

    const projectsByStage = await db
      .select({
        stage: projects.stage,
        count: sql<number>`count(*)`,
      })
      .from(projects)
      .groupBy(projects.stage)

    const byStage: Record<string, number> = {}
    projectsByStage.forEach((row) => {
      byStage[row.stage] = Number(row.count)
    })

    // Active projects (with activity in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [activeProjectsResult] = await db
      .select({ count: sql<number>`count(DISTINCT ${projects.id})` })
      .from(projects)
      .where(gte(projects.updatedAt, thirtyDaysAgo))

    // Quest statistics
    const [totalQuestsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quests)

    const [individualQuestsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quests)
      .where(eq(quests.questType, 'INDIVIDUAL'))

    const [teamQuestsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quests)
      .where(eq(quests.questType, 'TEAM'))

    const [completedUserQuestsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userQuests)
      .where(eq(userQuests.status, 'COMPLETED'))

    const [completedProjectQuestsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectQuests)
      .where(eq(projectQuests.status, 'VERIFIED'))

    const completedQuests = Number(completedUserQuestsResult.count) + Number(completedProjectQuestsResult.count)

    const [pendingQuestsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectQuests)
      .where(eq(projectQuests.status, 'SUBMITTED'))

    // Submission statistics
    const [pendingVerificationResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectQuests)
      .where(eq(projectQuests.status, 'SUBMITTED'))

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

    const [totalBountiesPaidResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${quests.bountyUsd}), 0)` })
      .from(projectQuests)
      .innerJoin(quests, eq(projectQuests.questId, quests.id))
      .where(
        and(
          eq(projectQuests.status, 'VERIFIED'),
          sql`${projectQuests.paidAt} IS NOT NULL`
        )
      )

    // Program statistics
    const [totalProgramsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(programs)

    const [activeProgramsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(programs)
      .where(eq(programs.status, 'ACTIVE'))

    // Track analytics (JAM-013)
    const trackStats = await getTrackAnalytics()

    return {
      users: {
        total: Number(totalUsersResult.count),
        admins: Number(totalAdminsResult.count),
        recentlyJoined: Number(recentUsersResult.count),
      },
      projects: {
        total: Number(totalProjectsResult.count),
        byStage,
        activeProjects: Number(activeProjectsResult.count),
      },
      quests: {
        total: Number(totalQuestsResult.count),
        individual: Number(individualQuestsResult.count),
        team: Number(teamQuestsResult.count),
        completed: completedQuests,
        pending: Number(pendingQuestsResult.count),
      },
      submissions: {
        pendingVerification: Number(pendingVerificationResult.count),
        verifiedToday: Number(verifiedTodayResult.count),
        totalBountiesPaid: Number(totalBountiesPaidResult.total),
      },
      programs: {
        total: Number(totalProgramsResult.count),
        active: Number(activeProgramsResult.count),
      },
      tracks: trackStats,
    }
  } catch (error) {
    console.error('Get admin dashboard stats error:', error)
    throw new Error('Failed to get admin dashboard stats')
  }
}

/**
 * Get recent activity for admin dashboard
 */
export async function getRecentActivity(limit = 10) {
  try {
    // Recent user registrations
    const recentUsers = await db
      .select({
        id: users.id,
        displayName: users.displayName,
        email: users.email,
        createdAt: users.createdAt,
        type: sql<string>`'user'`,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} DESC`)
      .limit(limit)

    // Recent project creations
    const recentProjects = await db
      .select({
        id: projects.id,
        name: projects.name,
        stage: projects.stage,
        createdAt: projects.createdAt,
        type: sql<string>`'project'`,
      })
      .from(projects)
      .orderBy(sql`${projects.createdAt} DESC`)
      .limit(limit)

    // Recent quest verifications
    const recentVerifications = await db
      .select({
        id: projectQuests.id,
        questId: projectQuests.questId,
        projectId: projectQuests.projectId,
        verifiedAt: projectQuests.verifiedAt,
        type: sql<string>`'verification'`,
      })
      .from(projectQuests)
      .where(eq(projectQuests.status, 'VERIFIED'))
      .orderBy(sql`${projectQuests.verifiedAt} DESC`)
      .limit(limit)

    return {
      recentUsers,
      recentProjects,
      recentVerifications,
    }
  } catch (error) {
    console.error('Get recent activity error:', error)
    throw new Error('Failed to get recent activity')
  }
}
