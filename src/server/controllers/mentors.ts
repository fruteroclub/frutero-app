import { db } from '@/db'
import { users, profiles, mentorships, mentorProfiles, userSettings } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

/**
 * JAM-013: Migrated from users.metadata to mentor_profiles table
 * mentor_profiles table structure:
 * - availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'
 * - maxParticipants: number (default: 5)
 * - expertiseAreas: string[]
 * - mentoringApproach: text
 * - experience: text
 */

/**
 * Get all available mentors
 */
export async function getAvailableMentors() {
  const mentorsData = await db
    .select({
      user: users,
      profile: profiles,
      mentorProfile: mentorProfiles,
      menteeCount: sql<number>`CAST(COUNT(DISTINCT ${mentorships.participantId}) AS INTEGER)`,
    })
    .from(mentorProfiles)
    .innerJoin(users, eq(mentorProfiles.userId, users.id))
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(
      mentorships,
      and(
        eq(users.id, mentorships.mentorId),
        eq(mentorships.status, 'active')
      )
    )
    .groupBy(users.id, profiles.id, mentorProfiles.id)

  return mentorsData.map((m) => {
    const menteeCount = m.menteeCount || 0
    const maxParticipants = m.mentorProfile.maxParticipants || 5
    const availability = (m.mentorProfile.availability || 'UNAVAILABLE').toLowerCase() as 'available' | 'limited' | 'unavailable'

    return {
      ...m.user,
      profile: m.profile,
      mentorProfile: m.mentorProfile,
      menteeCount,
      availability,
      expertiseAreas: m.mentorProfile.expertiseAreas || [],
      mentoringApproach: m.mentorProfile.mentoringApproach || '',
      experience: m.mentorProfile.experience || '',
      isAtCapacity: menteeCount >= maxParticipants,
    }
  })
}

/**
 * Get mentor by ID with full details
 */
export async function getMentorById(mentorId: string) {
  const [mentorData] = await db
    .select({
      user: users,
      profile: profiles,
      mentorProfile: mentorProfiles,
      menteeCount: sql<number>`CAST(COUNT(DISTINCT ${mentorships.participantId}) AS INTEGER)`,
      avgRating: sql<number>`CAST(AVG(${mentorships.participantRating}) AS REAL)`,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(mentorProfiles, eq(users.id, mentorProfiles.userId))
    .leftJoin(
      mentorships,
      and(
        eq(users.id, mentorships.mentorId),
        eq(mentorships.status, 'completed')
      )
    )
    .where(eq(users.id, mentorId))
    .groupBy(users.id, profiles.id, mentorProfiles.id)
    .limit(1)

  if (!mentorData || !mentorData.mentorProfile) return null

  const menteeCount = mentorData.menteeCount || 0
  const maxParticipants = mentorData.mentorProfile.maxParticipants || 5
  const availability = (mentorData.mentorProfile.availability || 'UNAVAILABLE').toLowerCase() as 'available' | 'limited' | 'unavailable'

  return {
    ...mentorData.user,
    profile: mentorData.profile,
    mentorProfile: mentorData.mentorProfile,
    menteeCount,
    rating: mentorData.avgRating || 0,
    availability,
    expertiseAreas: mentorData.mentorProfile.expertiseAreas || [],
    mentoringApproach: mentorData.mentorProfile.mentoringApproach || '',
    experience: mentorData.mentorProfile.experience || '',
    isAtCapacity: menteeCount >= maxParticipants,
  }
}

/**
 * Get mentor recommendations for a participant
 */
export async function getMentorRecommendations(participantId: string) {
  // Get participant info with settings
  const [participantData] = await db
    .select()
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(userSettings, eq(users.id, userSettings.userId))
    .where(eq(users.id, participantId))
    .limit(1)

  if (!participantData) return []

  // Transform to expected format
  const participant = {
    user: participantData.users,
    profile: participantData.profiles,
    settings: participantData.user_settings,
  }

  // Get all available mentors
  const mentorsData = await getAvailableMentors()

  // Filter out mentors at capacity
  const availableMentors = mentorsData.filter((m) => !m.isAtCapacity)

  // Calculate match scores
  const scoredMentors = availableMentors.map((mentor) => ({
    ...mentor,
    matchScore: calculateMatchScore(participant, mentor),
  }))

  // Return top 3 recommendations
  return scoredMentors
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
}

/**
 * Calculate match score between participant and mentor
 */
function calculateMatchScore(
  participant: {
    user: typeof users.$inferSelect;
    profile: typeof profiles.$inferSelect | null;
    settings: typeof userSettings.$inferSelect | null;
  },
  mentor: ReturnType<typeof getAvailableMentors> extends Promise<infer T>
    ? T extends Array<infer U>
      ? U
      : never
    : never
): number {
  let score = 0

  const participantInterests = participant.settings?.interests || []
  const participantTrack = participant.settings?.track || ''

  // Expertise match (40%)
  const expertiseMatch = mentor.expertiseAreas.filter((area) =>
    participantInterests.includes(area)
  ).length
  score += Math.min(expertiseMatch * 10, 40)

  // Track alignment (30%)
  if (mentor.expertiseAreas.includes(participantTrack)) {
    score += 30
  }

  // Availability (20%)
  if (mentor.availability === 'AVAILABLE') {
    score += 20
  } else if (mentor.availability === 'LIMITED') {
    score += 10
  }

  // Geographic proximity (10%)
  if (
    participant.profile?.country &&
    mentor.profile?.country === participant.profile.country
  ) {
    score += 10
  }

  return score
}

/**
 * Create mentorship connection request
 */
export async function createMentorshipRequest(
  mentorId: string,
  participantId: string,
  message: string,
  goals: string
) {
  // Check if connection already exists
  const existing = await db
    .select()
    .from(mentorships)
    .where(
      and(
        eq(mentorships.mentorId, mentorId),
        eq(mentorships.participantId, participantId)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    throw new Error('Mentorship connection already exists')
  }

  // Create mentorship request
  const [mentorship] = await db
    .insert(mentorships)
    .values({
      mentorId,
      participantId,
      status: 'active',
      sessionNotes: {
        requestMessage: message,
        goals,
        createdAt: new Date().toISOString(),
      },
    })
    .returning()

  return mentorship
}

/**
 * Get mentorship status between mentor and participant
 */
export async function getMentorshipStatus(mentorId: string, participantId: string) {
  const [mentorship] = await db
    .select()
    .from(mentorships)
    .where(
      and(
        eq(mentorships.mentorId, mentorId),
        eq(mentorships.participantId, participantId)
      )
    )
    .limit(1)

  return mentorship || null
}

/**
 * Session interface for JSONB storage
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
 * Log a new mentorship session
 */
export async function logMentorshipSession(
  mentorshipId: string,
  sessionData: Omit<MentorshipSession, 'id' | 'createdAt'>
) {
  // Get current mentorship
  const [mentorship] = await db
    .select()
    .from(mentorships)
    .where(eq(mentorships.id, mentorshipId))
    .limit(1)

  if (!mentorship) {
    throw new Error('Mentorship not found')
  }

  // Extract existing sessions from sessionNotes
  const currentNotes = (mentorship.sessionNotes as Record<string, unknown>) || {}
  const existingSessions = (currentNotes.sessions as MentorshipSession[]) || []

  // Create new session
  const newSession: MentorshipSession = {
    ...sessionData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  // Update sessionNotes with new session
  const updatedNotes = {
    ...currentNotes,
    sessions: [...existingSessions, newSession],
  }

  // Update mentorship
  const [updated] = await db
    .update(mentorships)
    .set({
      sessionNotes: updatedNotes,
      updatedAt: new Date(),
    })
    .where(eq(mentorships.id, mentorshipId))
    .returning()

  return { mentorship: updated, session: newSession }
}

/**
 * Get all sessions for a mentorship
 */
export async function getMentorshipSessions(mentorshipId: string) {
  const [mentorship] = await db
    .select()
    .from(mentorships)
    .where(eq(mentorships.id, mentorshipId))
    .limit(1)

  if (!mentorship) {
    throw new Error('Mentorship not found')
  }

  const sessionNotes = (mentorship.sessionNotes as Record<string, unknown>) || {}
  const sessions = (sessionNotes.sessions as MentorshipSession[]) || []

  // Sort by date descending (most recent first)
  return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get all mentorships for a user (as mentor or participant)
 */
/**
 * Get single mentorship by ID with full details
 */
export async function getMentorshipById(mentorshipId: string) {
  const result = await db.query.mentorships.findFirst({
    where: eq(mentorships.id, mentorshipId),
    with: {
      mentor: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      participant: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  })

  if (!result) {
    throw new Error('Mentorship not found')
  }

  const sessionNotes = (result.sessionNotes as Record<string, unknown>) || {}
  const sessions = (sessionNotes.sessions as MentorshipSession[]) || []

  return {
    ...result,
    sessionCount: sessions.length,
    lastSessionDate: sessions.length > 0 ? sessions[0].date : null,
  }
}

export async function getUserMentorships(userId: string) {
  const mentorshipsData = await db
    .select({
      mentorship: mentorships,
      mentor: users,
      participant: users,
      mentorProfile: profiles,
      participantProfile: profiles,
    })
    .from(mentorships)
    .leftJoin(users, eq(mentorships.mentorId, users.id))
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(
      sql`${mentorships.mentorId} = ${userId} OR ${mentorships.participantId} = ${userId}`
    )

  return mentorshipsData.map((m) => {
    const sessionNotes = (m.mentorship.sessionNotes as Record<string, unknown>) || {}
    const sessions = (sessionNotes.sessions as MentorshipSession[]) || []

    return {
      ...m.mentorship,
      mentor: m.mentor,
      participant: m.participant,
      mentorProfile: m.mentorProfile,
      participantProfile: m.participantProfile,
      sessionCount: sessions.length,
      lastSessionDate: sessions.length > 0 ? sessions[0].date : null,
    }
  })
}

/**
 * Update session rating
 */
export async function updateSessionRating(
  mentorshipId: string,
  sessionId: string,
  rating: number
) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }

  const [mentorship] = await db
    .select()
    .from(mentorships)
    .where(eq(mentorships.id, mentorshipId))
    .limit(1)

  if (!mentorship) {
    throw new Error('Mentorship not found')
  }

  const sessionNotes = (mentorship.sessionNotes as Record<string, unknown>) || {}
  const sessions = (sessionNotes.sessions as MentorshipSession[]) || []

  // Find and update the session
  const updatedSessions = sessions.map((session) =>
    session.id === sessionId ? { ...session, rating } : session
  )

  const updatedNotes = {
    ...sessionNotes,
    sessions: updatedSessions,
  }

  await db
    .update(mentorships)
    .set({
      sessionNotes: updatedNotes,
      updatedAt: new Date(),
    })
    .where(eq(mentorships.id, mentorshipId))

  return updatedSessions.find((s) => s.id === sessionId)
}
