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
 * Mentorship session stored in sessionNotes JSONB
 */
export interface MentorshipSession {
  id: string
  date: string
  duration: number
  objectives: string
  outcomes: string
  nextSteps: string
  rating: number
  loggedBy: 'mentor' | 'participant'
  createdAt: string
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
 * User mentorship with mentor/participant details
 */
export interface UserMentorship extends Mentorship {
  mentor: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
  } | null
  participant: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
  } | null
  mentorProfile: {
    id: string
    country: string | null
    cityRegion: string | null
  } | null
  participantProfile: {
    id: string
    country: string | null
    cityRegion: string | null
  } | null
  sessionCount: number
  lastSessionDate: string | null
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
    const response = await fetch(
      `/api/jam/mentorships/status?mentorId=${mentorId}&participantId=${participantId}`
    )
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

/**
 * Log a new mentorship session
 */
export async function logMentorshipSession(
  mentorshipId: string,
  sessionData: Omit<MentorshipSession, 'id' | 'createdAt'>
): Promise<ServiceResponse<{ mentorship: Mentorship; session: MentorshipSession }>> {
  try {
    const response = await fetch(`/api/jam/mentorships/${mentorshipId}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    })
    return handleResponse<{ mentorship: Mentorship; session: MentorshipSession }>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error logging session'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get all sessions for a mentorship
 */
export async function getMentorshipSessions(
  mentorshipId: string
): Promise<ServiceResponse<MentorshipSession[]>> {
  try {
    const response = await fetch(`/api/jam/mentorships/${mentorshipId}/sessions`)
    return handleResponse<MentorshipSession[]>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error fetching sessions'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Update session rating
 */
export async function updateSessionRating(
  mentorshipId: string,
  sessionId: string,
  rating: number
): Promise<ServiceResponse<MentorshipSession>> {
  try {
    const response = await fetch(
      `/api/jam/mentorships/${mentorshipId}/sessions/${sessionId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      }
    )
    return handleResponse<MentorshipSession>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error updating session'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get single mentorship by ID
 */
export async function getMentorshipById(
  mentorshipId: string
): Promise<ServiceResponse<UserMentorship>> {
  try {
    const response = await fetch(`/api/jam/mentorships/${mentorshipId}`)
    return handleResponse<UserMentorship>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error fetching mentorship'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}

/**
 * Get all mentorships for a user (as mentor or participant)
 */
export async function getUserMentorships(
  userId: string
): Promise<ServiceResponse<UserMentorship[]>> {
  try {
    const response = await fetch(`/api/jam/mentorships/user/${userId}`)
    return handleResponse<UserMentorship[]>(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error fetching mentorships'
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    }
  }
}
