import { ServiceResponse, UserExtended } from '@/types/api-v1'
import { handleResponse } from '@/lib/utils'
import type { Track } from '@/types/jam'

export interface TrackInfo {
  track: Track | null
  trackChangedAt: Date | null
  trackChangeCount: number
  canChange: boolean
  changeReason?: string
}

/**
 * Get current user's track information
 */
export async function getUserTrack(userId: string): Promise<ServiceResponse<TrackInfo>> {
  try {
    const response = await fetch('/api/jam/users/track', {
      headers: {
        'x-user-id': userId,
      },
    })
    return handleResponse<TrackInfo>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error fetching track'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Update current user's track
 */
export async function updateUserTrack(
  userId: string,
  track: Track
): Promise<ServiceResponse<UserExtended>> {
  try {
    const response = await fetch('/api/jam/users/track', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({ track }),
    })
    return handleResponse<UserExtended>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error updating track'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}
