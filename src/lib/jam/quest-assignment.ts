/**
 * Quest Assignment Logic
 * Automatic quest assignment based on user track and program week
 */

import { db } from '@/db'
import { quests, userQuests, userSettings, programUsers } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import type { Track } from '@/types/jam'

/**
 * Assign weekly quests to a user based on their track and program participation
 * @param userId User ID
 * @param programId Program ID (optional, if null assigns all available quests)
 * @returns Number of quests assigned
 */
export async function assignWeeklyQuests(
  userId: string,
  programId?: string
): Promise<number> {
  // Get user's track from settings
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)

  if (!settings?.track) {
    throw new Error('User must complete onboarding and select a track first')
  }

  const userTrack = settings.track as Track

  // Build quest query
  const questQuery = db
    .select()
    .from(quests)
    .where(
      and(
        // Quest type must be INDIVIDUAL or BOTH
        or(eq(quests.questType, 'INDIVIDUAL'), eq(quests.questType, 'BOTH'))
        // Quest must be available (availableFrom <= now)
        // TODO: Add date comparison when we have proper date handling
      )
    )

  // If programId provided, filter by program
  if (programId) {
    // Check if user is enrolled in the program
    const [enrollment] = await db
      .select()
      .from(programUsers)
      .where(
        and(
          eq(programUsers.userId, userId),
          eq(programUsers.programId, programId),
          eq(programUsers.status, 'ACTIVE')
        )
      )
      .limit(1)

    if (!enrollment) {
      throw new Error('User is not enrolled in this program')
    }

    // Get program to calculate current week
    // TODO: Implement week-based quest filtering when we have program data
  }

  const availableQuests = await questQuery

  // Filter quests by track compatibility
  const compatibleQuests = availableQuests.filter((quest) => {
    // If quest has no programId, it's available to all
    if (!quest.programId && programId) {
      return false
    }

    // Match programId if specified
    if (programId && quest.programId !== programId) {
      return false
    }

    // Check track compatibility through category
    const trackCategories: Record<Track, string[]> = {
      LEARNING: ['learning', 'fundamentals', 'tutorial', 'beginner'],
      FOUNDER: ['product', 'market', 'fundraising', 'startup'],
      PROFESSIONAL: ['technical', 'portfolio', 'networking', 'career'],
      FREELANCER: ['client', 'delivery', 'business', 'freelance'],
    }

    const userCategories = trackCategories[userTrack]
    return (
      !quest.category ||
      quest.category === 'all' ||
      userCategories.includes(quest.category.toLowerCase())
    )
  })

  // Assign quests to user (skip if already assigned)
  let assignedCount = 0

  for (const quest of compatibleQuests) {
    try {
      await db.insert(userQuests).values({
        userId,
        questId: quest.id,
        status: 'NOT_STARTED',
        progress: 0,
      })
      assignedCount++
    } catch (error) {
      // Ignore duplicate key errors (quest already assigned)
      if (
        error instanceof Error &&
        error.message.includes('duplicate key')
      ) {
        continue
      }
      throw error
    }
  }

  return assignedCount
}

/**
 * Assign quest to specific user (manual assignment)
 * @param userId User ID
 * @param questId Quest ID
 * @returns True if assigned successfully
 */
export async function assignQuestToUser(
  userId: string,
  questId: string
): Promise<boolean> {
  try {
    await db.insert(userQuests).values({
      userId,
      questId,
      status: 'NOT_STARTED',
      progress: 0,
    })
    return true
  } catch (error) {
    // Quest already assigned
    if (
      error instanceof Error &&
      error.message.includes('duplicate key')
    ) {
      return false
    }
    throw error
  }
}

/**
 * Remove quest assignment from user
 * @param userId User ID
 * @param questId Quest ID
 * @returns True if removed successfully
 */
export async function unassignQuestFromUser(
  userId: string,
  questId: string
): Promise<boolean> {
  await db
    .delete(userQuests)
    .where(
      and(eq(userQuests.userId, userId), eq(userQuests.questId, questId))
    )

  return true
}
