/**
 * User Quests Service
 * Frontend service for individual quest operations
 */

export interface UserQuest {
  id: string
  userId: string
  questId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  progress: number
  submissionText?: string | null
  submissionUrls?: string[] | null
  startedAt?: Date | null
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Start/assign a quest to the user
 */
export async function startQuest(
  questId: string,
  userId: string
): Promise<UserQuest> {
  const response = await fetch(`/api/jam/quests/${questId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'start',
      userId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to start quest')
  }

  return response.json()
}

/**
 * Update quest progress (partial submission)
 */
export async function updateQuestProgress(
  questId: string,
  userId: string,
  data: {
    progress: number
    submissionText?: string
    submissionUrls?: string[]
  }
): Promise<UserQuest> {
  const response = await fetch(`/api/jam/quests/${questId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update',
      userId,
      ...data,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update progress')
  }

  return response.json()
}

/**
 * Submit quest for completion (100%)
 */
export async function submitQuestForCompletion(
  questId: string,
  userId: string,
  data: {
    submissionText: string
    submissionUrls?: string[]
  }
): Promise<UserQuest> {
  const response = await fetch(`/api/jam/quests/${questId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'submit',
      userId,
      ...data,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to submit quest')
  }

  return response.json()
}

/**
 * Get user's quest submission history
 */
export async function getQuestSubmissionHistory(
  questId: string,
  userId: string
): Promise<
  Array<{
    id: string
    progress: number
    description: string
    links: string[]
    submittedAt: Date
  }>
> {
  const response = await fetch(
    `/api/jam/quests/${questId}/history?userId=${userId}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch submission history')
  }

  return response.json()
}
