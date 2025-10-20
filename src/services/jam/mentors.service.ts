import { ServiceResponse } from '@/types/api-v1'
import { handleResponse } from '@/lib/utils'

/**
 * Mentor metadata stored in users.metadata JSONB
 */
export interface MentorMetadata {
  isMentor?: boolean
  mentorAvailability?: 'available' | 'limited' | 'unavailable'
  expertiseAreas?: string[]
  mentoringApproach?: string
  maxParticipants?: number
  experience?: string
}

/**
 * Mentor profile with availability and mentee information
 */
export interface Mentor {
  id: string
  username: string | null
  displayName: string | null
  email: string | null
  avatarUrl: string | null
  createdAt: Date
  metadata: MentorMetadata
  profile: {
    id: string
    professionalProfile: string | null
    country: string | null
    cityRegion: string | null
  } | null
  menteeCount: number
  rating?: number
  availability: 'available' | 'limited' | 'unavailable'
  expertiseAreas: string[]
  mentoringApproach?: string
  experience?: string
  isAtCapacity: boolean
  matchScore?: number
}

/**
 * Mentorship connection between mentor and participant
 */
export interface Mentorship {
  id: string
  mentorId: string
  participantId: string
  status: string
  sessionNotes: Record<string, unknown> | null
  participantRating: number | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Get all available mentors
 */
export async function getAllMentors(): Promise<ServiceResponse<Mentor[]>> {
  try {
    const response = await fetch('/api/jam/mentors')
    return handleResponse<Mentor[]>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error fetching mentors'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get mentor by ID with full profile details
 */
export async function getMentorById(mentorId: string): Promise<ServiceResponse<Mentor>> {
  try {
    const response = await fetch(`/api/jam/mentors/${mentorId}`)
    return handleResponse<Mentor>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error fetching mentor'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get mentor recommendations for a participant
 */
export async function getMentorRecommendations(
  userId: string
): Promise<ServiceResponse<Mentor[]>> {
  try {
    const response = await fetch(`/api/jam/mentors/recommendations/${userId}`)
    return handleResponse<Mentor[]>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error fetching recommendations'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Create mentorship connection request
 */
export async function createMentorshipRequest(
  mentorId: string,
  participantId: string,
  message: string,
  goals: string
): Promise<ServiceResponse<Mentorship>> {
  try {
    const response = await fetch('/api/jam/mentorships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorId, participantId, message, goals }),
    })
    return handleResponse<Mentorship>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error creating mentorship request'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get mentorship status between mentor and participant
 */
export async function getMentorshipStatus(
  mentorId: string,
  participantId: string
): Promise<ServiceResponse<{ exists: boolean; mentorship: Mentorship | null }>> {
  try {
    const response = await fetch(`/api/jam/mentorships/${mentorId}/${participantId}`)
    return handleResponse<{ exists: boolean; mentorship: Mentorship | null }>(response)
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error fetching mentorship status'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}
