/**
 * Admin Service
 * Frontend service layer for admin-specific API calls
 */

export interface QuestSubmission {
  id: string
  questId: string
  userId?: string
  userName?: string
  userEmail?: string
  projectId?: string
  projectName?: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'FAILED'
  progress: number
  submissionText?: string
  submissionUrls?: string[]
  submissionLink?: string
  startedAt?: string
  completedAt?: string
  submittedAt?: string
  submittedBy?: string
  createdAt: string
  updatedAt: string
}

export async function getQuestSubmissions(questId: string): Promise<QuestSubmission[]> {
  try {
    const res = await fetch(`/api/jam/admin/quests/${questId}/submissions`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch quest submissions' }))
      throw new Error(error.error || 'Failed to fetch quest submissions')
    }

    return res.json()
  } catch (error) {
    console.error('Get quest submissions error:', error)
    throw error
  }
}
