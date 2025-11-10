import { NextResponse } from 'next/server'
import { db } from '@/db'
import { projects, quests, projectQuests, mentorships, users } from '@/db/schema'
import { sql, eq } from 'drizzle-orm'

export async function GET() {
  try {
    // Get total active projects
    const [projectCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)

    // Get active quests (questType = TEAM or BOTH)
    const [activeQuestCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quests)
      .where(sql`${quests.questType} IN ('TEAM', 'BOTH')`)

    // Get completed quests
    const [completedQuestCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectQuests)
      .where(eq(projectQuests.status, 'VERIFIED'))

    // Get active mentorships
    const [activeMentorshipCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(mentorships)
      .where(eq(mentorships.status, 'active'))

    // Get total participants (users with profiles)
    const [participantCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)

    const stats = {
      totalProjects: Number(projectCount.count),
      activeQuests: Number(activeQuestCount.count),
      completedQuests: Number(completedQuestCount.count),
      activeMentorships: Number(activeMentorshipCount.count),
      totalParticipants: Number(participantCount.count),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching JAM stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
