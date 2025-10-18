/**
 * Quest Management Controller
 * Business logic for quest operations
 */

import { db } from '@/db'
import { quests, userQuests, projectQuests } from '@/db/schema'
import { eq, and, or, sql } from 'drizzle-orm'

export interface GetQuestsFilters {
  type?: 'INDIVIDUAL' | 'TEAM' | 'BOTH'
  category?: string
  difficulty?: string
  programId?: string
  status?: string
}

/**
 * Get all quests with optional filtering
 */
export async function getAllQuests(filters?: GetQuestsFilters) {
  let query = db.select().from(quests)

  const conditions = []

  // Filter by quest type
  if (filters?.type) {
    if (filters.type === 'INDIVIDUAL') {
      conditions.push(or(eq(quests.questType, 'INDIVIDUAL'), eq(quests.questType, 'BOTH')))
    } else if (filters.type === 'TEAM') {
      conditions.push(or(eq(quests.questType, 'TEAM'), eq(quests.questType, 'BOTH')))
    } else {
      conditions.push(eq(quests.questType, filters.type))
    }
  }

  // Filter by category
  if (filters?.category) {
    conditions.push(eq(quests.category, filters.category))
  }

  // Filter by difficulty
  if (filters?.difficulty) {
    conditions.push(eq(quests.difficulty, filters.difficulty))
  }

  // Filter by program
  if (filters?.programId) {
    conditions.push(eq(quests.programId, filters.programId))
  }

  // Apply conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query
  }

  const questList = await query.orderBy(quests.availableFrom)

  // Calculate current submissions for each quest
  const questsWithSubmissions = await Promise.all(
    questList.map(async (quest) => {
      const [userSubmissionCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userQuests)
        .where(eq(userQuests.questId, quest.id))

      const [projectSubmissionCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(projectQuests)
        .where(eq(projectQuests.questId, quest.id))

      const currentSubmissions =
        Number(userSubmissionCount.count) + Number(projectSubmissionCount.count)

      return {
        ...quest,
        currentSubmissions,
        // Add mock requirements and deliverables (temporary until schema update)
        requirements: [
          'Completa todos los pasos descritos',
          'Documenta tu proceso',
          'Comparte tu trabajo',
        ],
        deliverables: [
          'Link al código/demo',
          'Screenshots o evidencia',
          'Resumen de aprendizajes',
        ],
      }
    })
  )

  return questsWithSubmissions
}

/**
 * Get a single quest by ID
 */
export async function getQuestById(questId: string) {
  const [quest] = await db.select().from(quests).where(eq(quests.id, questId))

  if (!quest) {
    return null
  }

  // Calculate current submissions
  const [userSubmissionCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userQuests)
    .where(eq(userQuests.questId, questId))

  const [projectSubmissionCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectQuests)
    .where(eq(projectQuests.questId, questId))

  const currentSubmissions =
    Number(userSubmissionCount.count) + Number(projectSubmissionCount.count)

  return {
    ...quest,
    currentSubmissions,
    // Add mock requirements and deliverables (temporary until schema update)
    requirements: [
      'Completa todos los pasos descritos',
      'Documenta tu proceso',
      'Comparte tu trabajo',
    ],
    deliverables: [
      'Link al código/demo',
      'Screenshots o evidencia',
      'Resumen de aprendizajes',
    ],
  }
}

/**
 * Get all quests for a specific user (individual quests)
 */
export async function getUserQuests(
  userId: string,
  filters?: GetQuestsFilters
) {
  const query = db
    .select({
      userQuest: userQuests,
      quest: quests,
    })
    .from(userQuests)
    .innerJoin(quests, eq(userQuests.questId, quests.id))
    .where(eq(userQuests.userId, userId))

  const questData = await query

  // Apply type filtering
  let filtered = questData
  if (filters?.type) {
    if (filters.type === 'INDIVIDUAL') {
      filtered = questData.filter(
        (item) =>
          item.quest.questType === 'INDIVIDUAL' || item.quest.questType === 'BOTH'
      )
    } else if (filters.type === 'TEAM') {
      filtered = questData.filter(
        (item) => item.quest.questType === 'TEAM' || item.quest.questType === 'BOTH'
      )
    }
  }

  return filtered.map((item) => ({
    ...item.userQuest,
    quest: item.quest,
  }))
}

/**
 * Get all quests for a specific project (team quests)
 */
export async function getProjectQuests(
  projectId: string,
  filters?: GetQuestsFilters
) {
  const query = db
    .select({
      projectQuest: projectQuests,
      quest: quests,
    })
    .from(projectQuests)
    .innerJoin(quests, eq(projectQuests.questId, quests.id))
    .where(eq(projectQuests.projectId, projectId))

  const questData = await query

  // Apply type filtering
  let filtered = questData
  if (filters?.type) {
    if (filters.type === 'TEAM') {
      filtered = questData.filter(
        (item) => item.quest.questType === 'TEAM' || item.quest.questType === 'BOTH'
      )
    }
  }

  return filtered.map((item) => ({
    ...item.projectQuest,
    quest: item.quest,
  }))
}

/**
 * Get quests for a specific program
 */
export async function getQuestsByProgram(programId: string) {
  const questList = await db
    .select()
    .from(quests)
    .where(eq(quests.programId, programId))
    .orderBy(quests.availableFrom)

  return questList
}
