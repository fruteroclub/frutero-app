import { db } from '@/db'
import {
  users,
  projects,
  projectMembers,
  userQuests,
  projectQuests,
  quests,
  mentorships,
  userSettings,
} from '@/db/schema'
import { eq, and, gte, desc, or } from 'drizzle-orm'
import type {
  DashboardStats,
  QuestStats,
  ProjectInfo,
  MentorshipInfo,
  Deadline,
  Activity,
  UserSettings,
} from '@/types/jam'

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [questStats, project, mentorship, deadlines, recentActivities, settings] =
    await Promise.all([
      getQuestStats(userId),
      getUserProject(userId),
      getUserMentorship(userId),
      getUpcomingDeadlines(userId),
      getRecentActivities(),
      getUserSettings(userId),
    ])

  return {
    quests: questStats,
    project,
    mentorship,
    deadlines,
    recentActivities,
    userSettings: settings,
  }
}

async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)

  return settings || null
}

async function getQuestStats(userId: string): Promise<QuestStats> {
  // Get user's individual quests
  const individualQuests = await db
    .select()
    .from(userQuests)
    .where(eq(userQuests.userId, userId))

  // Get user's team quests (through project membership)
  const userProjects = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId))

  const projectIds = userProjects.map((p) => p.projectId)

  let teamQuests: Array<{ status: string }> = []
  if (projectIds.length > 0) {
    teamQuests = await db
      .select({ status: projectQuests.status })
      .from(projectQuests)
      .where(
        or(
          ...projectIds.map((id) => eq(projectQuests.projectId, id))
        )
      )
  }

  const individualCompleted = individualQuests.filter(
    (q) => q.status === 'COMPLETED'
  ).length

  const teamCompleted = teamQuests.filter(
    (q) => q.status === 'VERIFIED'
  ).length

  const completed = individualCompleted + teamCompleted
  const total = individualQuests.length + teamQuests.length
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    completed,
    total,
    percentComplete,
    individualCompleted,
    teamCompleted,
  }
}

async function getUserProject(userId: string): Promise<ProjectInfo | null> {
  // Find user's primary project (first one they're a member of)
  const membership = await db
    .select({
      projectId: projectMembers.projectId,
    })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId))
    .limit(1)

  if (membership.length === 0) {
    return null
  }

  const projectId = membership[0].projectId

  // Get project details
  const [projectData] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))

  if (!projectData) {
    return null
  }

  // Get all project members
  const members = await db
    .select({
      userId: projectMembers.userId,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(projectMembers)
    .innerJoin(users, eq(projectMembers.userId, users.id))
    .where(eq(projectMembers.projectId, projectId))
    .limit(5)

  // Count total members
  const allMembers = await db
    .select({ userId: projectMembers.userId })
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId))

  return {
    id: projectData.id,
    slug: projectData.slug,
    name: projectData.name,
    stage: projectData.stage,
    memberCount: allMembers.length,
    members: members.map((m) => ({
      id: m.userId,
      displayName: m.displayName,
      avatarUrl: m.avatarUrl,
    })),
  }
}

async function getUserMentorship(userId: string): Promise<MentorshipInfo | null> {
  // Find user's active mentorship
  const [mentorshipData] = await db
    .select({
      id: mentorships.id,
      mentorId: mentorships.mentorId,
      status: mentorships.status,
      sessionNotes: mentorships.sessionNotes,
      createdAt: mentorships.createdAt,
    })
    .from(mentorships)
    .where(eq(mentorships.participantId, userId))
    .orderBy(desc(mentorships.createdAt))
    .limit(1)

  if (!mentorshipData) {
    return null
  }

  // Get mentor details
  const [mentor] = await db
    .select({
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, mentorshipData.mentorId))

  if (!mentor) {
    return null
  }

  // Count completed sessions from session notes
  const sessionNotes = (mentorshipData.sessionNotes as Record<string, unknown>) || {}
  const sessions = (sessionNotes.sessions as Array<{ date?: string }>) || []
  const sessionsCompleted = sessions.length

  return {
    id: mentorshipData.id,
    mentorName: mentor.displayName,
    mentorAvatar: mentor.avatarUrl,
    nextSession: null, // TODO: Implement session scheduling
    sessionsCompleted,
    status: mentorshipData.status as 'active' | 'paused' | 'completed',
  }
}

async function getUpcomingDeadlines(userId: string): Promise<Deadline[]> {
  const now = new Date()

  // Get individual quest deadlines
  const individualQuestDeadlines = await db
    .select({
      id: quests.id,
      title: quests.title,
      dueDate: quests.dueDate,
      programId: quests.programId,
    })
    .from(quests)
    .innerJoin(userQuests, eq(quests.id, userQuests.questId))
    .where(
      and(
        eq(userQuests.userId, userId),
        gte(quests.dueDate, now)
      )
    )
    .orderBy(quests.dueDate)
    .limit(5)

  return individualQuestDeadlines
    .filter((q) => q.dueDate !== null)
    .map((q) => ({
      id: q.id,
      title: q.title,
      dueDate: q.dueDate!,
      type: 'quest' as const,
      questId: q.id,
      programId: q.programId || undefined,
    }))
}

async function getRecentActivities(): Promise<Activity[]> {
  // For now, return empty array since we don't have activity tracking yet
  // TODO: Implement activity tracking system (will use userId parameter)
  return []
}
