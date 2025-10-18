/**
 * Programs Service
 * Frontend service layer for program API calls
 */

export interface Program {
  id: string
  name: string
  description: string
  type: string
  status: string
  startDate: string
  endDate?: string
}

export interface ProgramParticipation {
  id: string
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN'
  joinedAt: string
  completedAt?: string
  program: Program
}

/**
 * Get all programs
 */
export async function getAllPrograms(): Promise<Program[]> {
  try {
    const res = await fetch('/api/jam/programs')

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch programs' }))
      throw new Error(error.error || 'Failed to fetch programs')
    }

    return res.json()
  } catch (error) {
    console.error('Programs fetch error:', error)
    throw error
  }
}

/**
 * Get project programs by status
 */
export async function getProjectPrograms(
  slug: string,
  status?: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN'
): Promise<ProgramParticipation[]> {
  try {
    const url = status
      ? `/api/jam/projects/${slug}/programs?status=${status}`
      : `/api/jam/projects/${slug}/programs`

    const res = await fetch(url)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch project programs' }))
      throw new Error(error.error || 'Failed to fetch project programs')
    }

    return res.json()
  } catch (error) {
    console.error('Project programs fetch error:', error)
    throw error
  }
}

/**
 * Join a program
 */
export async function joinProgram(
  slug: string,
  programId: string
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId }),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to join program' }))
      throw new Error(error.error || 'Failed to join program')
    }

    return res.json()
  } catch (error) {
    console.error('Join program error:', error)
    throw error
  }
}

/**
 * Update program status
 */
export async function updateProgramStatus(
  slug: string,
  programId: string,
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN'
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}/programs/${programId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to update status' }))
      throw new Error(error.error || 'Failed to update status')
    }

    return res.json()
  } catch (error) {
    console.error('Update program status error:', error)
    throw error
  }
}

/**
 * Leave/withdraw from a program
 */
export async function leaveProgram(
  slug: string,
  programId: string
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}/programs/${programId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to leave program' }))
      throw new Error(error.error || 'Failed to leave program')
    }

    return res.json()
  } catch (error) {
    console.error('Leave program error:', error)
    throw error
  }
}
