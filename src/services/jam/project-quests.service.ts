/**
 * Project Quest Service
 * Frontend service layer for team quest API calls
 */

export interface ProjectQuest {
  id: string
  projectId: string
  questId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED'
  progress: number
  submissionLink: string | null
  submissionText: string | null
  submittedAt: string | null
  submittedBy: string | null
  isVerified: boolean | null
  verifiedBy: string | null
  verificationNotes: string | null
  verifiedAt: string | null
  paymentTxHash: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  quest?: Quest
}

export interface Quest {
  id: string
  title: string
  description: string | null
  category: string | null
  difficulty: string | null
  questType: string
  bountyUsd: number | null
  maxSubmissions: number | null
  rewardPoints: number
  start: string
  end: string
  availableFrom: string | null
  dueDate: string | null
  programId: string | null
  createdAt: string
  updatedAt: string
  currentSubmissions?: number
}

export interface TeamQuest extends Quest {
  currentSubmissions: number
}

/**
 * Get available team quests for a project
 */
export async function getAvailableTeamQuests(
  projectSlug: string
): Promise<TeamQuest[]> {
  try {
    const response = await fetch(
      `/api/jam/projects/${projectSlug}/quests/available`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch available quests')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching available quests:', error)
    throw error
  }
}

/**
 * Get all quests for a project (applied/active)
 */
export async function getProjectQuests(
  projectSlug: string
): Promise<ProjectQuest[]> {
  try {
    const response = await fetch(`/api/jam/projects/${projectSlug}/quests`)
    if (!response.ok) {
      throw new Error('Failed to fetch project quests')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching project quests:', error)
    throw error
  }
}

/**
 * Get a single project quest by ID
 */
export async function getProjectQuest(
  projectSlug: string,
  questId: string
): Promise<ProjectQuest | null> {
  try {
    const response = await fetch(
      `/api/jam/projects/${projectSlug}/quests/${questId}`
    )
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error('Failed to fetch project quest')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching project quest:', error)
    throw error
  }
}

/**
 * Apply project to a quest
 */
export async function applyToQuest(
  projectSlug: string,
  questId: string,
  userId: string
): Promise<ProjectQuest> {
  try {
    const response = await fetch(`/api/jam/projects/${projectSlug}/quests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questId, userId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to apply to quest')
    }

    return response.json()
  } catch (error) {
    console.error('Error applying to quest:', error)
    throw error
  }
}

/**
 * Update quest progress
 */
export async function updateQuestProgress(
  projectSlug: string,
  questId: string,
  userId: string,
  data: {
    progress?: number
    submissionLink?: string
    submissionText?: string
    status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED'
  }
): Promise<ProjectQuest> {
  try {
    const response = await fetch(
      `/api/jam/projects/${projectSlug}/quests/${questId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, userId }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update quest progress')
    }

    return response.json()
  } catch (error) {
    console.error('Error updating quest progress:', error)
    throw error
  }
}

/**
 * Submit quest for verification
 */
export async function submitQuest(
  projectSlug: string,
  questId: string,
  userId: string,
  data: {
    submissionLink: string
    submissionText: string
  }
): Promise<ProjectQuest> {
  try {
    const response = await fetch(
      `/api/jam/projects/${projectSlug}/quests/${questId}/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, userId }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to submit quest')
    }

    return response.json()
  } catch (error) {
    console.error('Error submitting quest:', error)
    throw error
  }
}
