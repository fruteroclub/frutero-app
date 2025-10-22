import { ServiceResponse } from '@/types/api-v1'
import { handleResponse } from '@/lib/utils'
import type {
  CreateMentorProfileInput,
  UpdateMentorProfileInput,
  MentorSettingsInput,
} from '@/server/schema/mentor-schema'

/**
 * Mentor Profile with User Info
 */
export interface MentorProfileFull {
  id: string
  userId: string
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'
  maxParticipants: number
  expertiseAreas: string[]
  mentoringApproach: string | null
  experience: string | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username: string
    displayName: string
    email: string | null
    avatarUrl: string | null
  }
}

/**
 * User (for dropdown selection)
 */
export interface SelectableUser {
  id: string
  username: string
  displayName: string
  email: string | null
  avatarUrl: string | null
}

/**
 * Get all mentor profiles (admin only)
 */
export async function getAllMentorProfiles(): Promise<ServiceResponse<MentorProfileFull[]>> {
  try {
    const response = await fetch('/api/jam/admin/mentors')
    return handleResponse<MentorProfileFull[]>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error fetching mentor profiles'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get all non-mentor users (for admin user selection)
 */
export async function getNonMentorUsers(): Promise<ServiceResponse<SelectableUser[]>> {
  try {
    const response = await fetch('/api/jam/admin/mentors?includeNonMentors=true')
    return handleResponse<SelectableUser[]>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error fetching users'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get a mentor profile by user ID (admin only)
 */
export async function getMentorProfile(
  userId: string
): Promise<ServiceResponse<MentorProfileFull>> {
  try {
    const response = await fetch(`/api/jam/admin/mentors/${userId}`)
    return handleResponse<MentorProfileFull>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error fetching mentor profile'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Create a mentor profile (admin only)
 */
export async function createMentorProfile(
  data: CreateMentorProfileInput
): Promise<ServiceResponse<MentorProfileFull>> {
  try {
    const response = await fetch('/api/jam/admin/mentors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse<MentorProfileFull>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error creating mentor profile'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Update a mentor profile (admin only)
 */
export async function updateMentorProfileAdmin(
  userId: string,
  data: UpdateMentorProfileInput
): Promise<ServiceResponse<MentorProfileFull>> {
  try {
    const response = await fetch(`/api/jam/admin/mentors/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse<MentorProfileFull>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error updating mentor profile'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Delete a mentor profile (admin only)
 */
export async function deleteMentorProfile(
  userId: string
): Promise<ServiceResponse<{ message: string }>> {
  try {
    const response = await fetch(`/api/jam/admin/mentors/${userId}`, {
      method: 'DELETE',
    })
    return handleResponse<{ message: string }>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error deleting mentor profile'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get current user's mentor settings
 */
export async function getMentorSettings(
  userId: string
): Promise<ServiceResponse<MentorProfileFull>> {
  try {
    const response = await fetch(`/api/jam/mentors/settings?userId=${userId}`)
    return handleResponse<MentorProfileFull>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error fetching mentor settings'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Update current user's mentor settings
 */
export async function updateMentorSettings(
  userId: string,
  data: MentorSettingsInput
): Promise<ServiceResponse<MentorProfileFull>> {
  try {
    const response = await fetch('/api/jam/mentors/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data }),
    })
    return handleResponse<MentorProfileFull>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error updating mentor settings'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}
