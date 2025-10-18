/**
 * Quests Service
 * Frontend service layer for quest API calls
 */

export interface Quest {
  id: string
  title: string
  description: string | null
  category: string | null
  difficulty: string | null
  questType: string
  bountyUsd: number | null
  maxSubmissions: number | null
  currentSubmissions: number
  rewardPoints: number
  start: string
  end: string
  availableFrom: string | null
  dueDate: string | null
  programId?: string | null
  projectId?: string | null
  badgeId?: string | null
  createdAt: string
  updatedAt: string
  // Computed fields (not in DB)
  requirements: string[]
  deliverables: string[]
}

export interface UserQuest {
  id: string
  userId: string
  questId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  progress: number
  submissionText?: string
  submissionUrls?: string[]
  startedAt?: string
  completedAt?: string
  quest: Quest
}

export interface ProjectQuest {
  id: string
  projectId: string
  questId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED'
  progress: number
  submissionLink?: string
  submissionText?: string
  submittedAt?: string
  submittedBy?: string
  isVerified: boolean
  verifiedBy?: string
  paymentTxHash?: string
  paidAt?: string
  quest: Quest
}

export type QuestType = 'ALL' | 'INDIVIDUAL' | 'TEAM' | 'BOTH'

// Re-export types for convenience
export type { Quest as QuestData }

export async function getAllQuests(type?: QuestType): Promise<Quest[]> {
  try {
    const params = new URLSearchParams()
    if (type && type !== 'ALL') {
      params.append('type', type)
    }

    const res = await fetch(`/api/jam/quests?${params.toString()}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch quests' }))
      throw new Error(error.error || 'Failed to fetch quests')
    }

    return res.json()
  } catch (error) {
    console.error('Get all quests error:', error)
    throw error
  }
}

export async function getQuest(id: string): Promise<Quest | null> {
  try {
    const res = await fetch(`/api/jam/quests/${id}`)

    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch quest' }))
      throw new Error(error.error || 'Failed to fetch quest')
    }

    return res.json()
  } catch (error) {
    console.error('Get quest error:', error)
    throw error
  }
}

export async function getUserQuests(
  userId: string,
  type?: QuestType
): Promise<UserQuest[]> {
  try {
    const params = new URLSearchParams({ userId })
    if (type && type !== 'ALL') {
      params.append('type', type)
    }

    const res = await fetch(`/api/jam/quests/user?${params.toString()}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch user quests' }))
      throw new Error(error.error || 'Failed to fetch user quests')
    }

    return res.json()
  } catch (error) {
    console.error('Get user quests error:', error)
    throw error
  }
}

export async function getProjectQuests(
  projectId: string,
  type?: QuestType
): Promise<ProjectQuest[]> {
  try {
    const params = new URLSearchParams({ projectId })
    if (type && type !== 'ALL') {
      params.append('type', type)
    }

    const res = await fetch(`/api/jam/quests/project?${params.toString()}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch project quests' }))
      throw new Error(error.error || 'Failed to fetch project quests')
    }

    return res.json()
  } catch (error) {
    console.error('Get project quests error:', error)
    throw error
  }
}

export async function getQuestsByProgram(programId: string): Promise<Quest[]> {
  try {
    const res = await fetch(`/api/jam/quests?programId=${programId}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch program quests' }))
      throw new Error(error.error || 'Failed to fetch program quests')
    }

    return res.json()
  } catch (error) {
    console.error('Get program quests error:', error)
    throw error
  }
}
