/**
 * User Management Service
 * Frontend service layer for user management API calls
 */

export interface UserWithProfile {
  id: string
  username: string
  displayName: string
  email: string | null
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  profile?: {
    firstName: string | null
    lastName: string | null
    cityRegion: string | null
    country: string | null
    primaryRole: string | null
  } | null
}

/**
 * Get all users with optional filters
 */
export async function getAllUsers(options?: {
  search?: string
  isAdmin?: boolean
  limit?: number
  offset?: number
}): Promise<{ users: UserWithProfile[]; total: number }> {
  try {
    const params = new URLSearchParams()
    if (options?.search) params.append('search', options.search)
    if (typeof options?.isAdmin === 'boolean') params.append('isAdmin', String(options.isAdmin))
    if (options?.limit) params.append('limit', String(options.limit))
    if (options?.offset) params.append('offset', String(options.offset))

    const res = await fetch(`/api/jam/admin/users?${params.toString()}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to get users' }))
      throw new Error(error.error || 'Failed to get users')
    }

    return res.json()
  } catch (error) {
    console.error('Get all users error:', error)
    throw error
  }
}

/**
 * Toggle admin status for a user
 */
export async function toggleAdminStatus(userId: string): Promise<{ isAdmin: boolean }> {
  try {
    const res = await fetch(`/api/jam/admin/users/${userId}/toggle-admin`, {
      method: 'POST',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to toggle admin status' }))
      throw new Error(error.error || 'Failed to toggle admin status')
    }

    return res.json()
  } catch (error) {
    console.error('Toggle admin status error:', error)
    throw error
  }
}

/**
 * Get user details
 */
export async function getUserDetails(userId: string): Promise<UserWithProfile | null> {
  try {
    const res = await fetch(`/api/jam/admin/users/${userId}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to get user details' }))
      throw new Error(error.error || 'Failed to get user details')
    }

    return res.json()
  } catch (error) {
    console.error('Get user details error:', error)
    throw error
  }
}
