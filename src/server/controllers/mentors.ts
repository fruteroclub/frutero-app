import { db } from '@/db'
import { users, profiles, mentorships } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

/**
 * Mentor metadata structure stored in users.metadata JSONB:
 * {
 *   isMentor: boolean
 *   mentorAvailability: 'available' | 'limited' | 'unavailable'
 *   expertiseAreas: string[]
 *   mentoringApproach: string
 *   maxParticipants: number
 *   experience: string
 * }
 */

interface MentorMetadata {
  isMentor?: boolean
  mentorAvailability?: 'available' | 'limited' | 'unavailable'
  expertiseAreas?: string[]
  mentoringApproach?: string
  maxParticipants?: number
  experience?: string
}

/**
 * Get all available mentors
 */
export async function getAvailableMentors() {
  const mentorsData = await db
    .select({
      user: users,
      profile: profiles,
      menteeCount: sql<number>`CAST(COUNT(DISTINCT ${mentorships.participantId}) AS INTEGER)`,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(
      mentorships,
      and(
        eq(users.id, mentorships.mentorId),
        eq(mentorships.status, 'active')
      )
    )
    .where(sql`${users.metadata}->>'isMentor' = 'true'`)
    .groupBy(users.id, profiles.id)

  return mentorsData.map((m) => {
    const metadata = (m.user.metadata as MentorMetadata) || {}
    const menteeCount = m.menteeCount || 0
    const maxParticipants = metadata.maxParticipants || 5

    return {
      ...m.user,
      profile: m.profile,
      metadata,
      menteeCount,
      availability: metadata.mentorAvailability || 'unavailable',
      expertiseAreas: metadata.expertiseAreas || [],
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
      menteeCount: sql<number>`CAST(COUNT(DISTINCT ${mentorships.participantId}) AS INTEGER)`,
      avgRating: sql<number>`CAST(AVG(${mentorships.participantRating}) AS REAL)`,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .leftJoin(
      mentorships,
      and(
        eq(users.id, mentorships.mentorId),
        eq(mentorships.status, 'completed')
      )
    )
    .where(eq(users.id, mentorId))
    .groupBy(users.id, profiles.id)
    .limit(1)

  if (!mentorData) return null

  const metadata = (mentorData.user.metadata as MentorMetadata) || {}
  const menteeCount = mentorData.menteeCount || 0
  const maxParticipants = metadata.maxParticipants || 5

  return {
    ...mentorData.user,
    profile: mentorData.profile,
    metadata,
    menteeCount,
    rating: mentorData.avgRating || 0,
    availability: metadata.mentorAvailability || 'unavailable',
    expertiseAreas: metadata.expertiseAreas || [],
    mentoringApproach: metadata.mentoringApproach || '',
    experience: metadata.experience || '',
    isAtCapacity: menteeCount >= maxParticipants,
  }
}

/**
 * Get mentor recommendations for a participant
 */
export async function getMentorRecommendations(participantId: string) {
  // Get participant info
  const [participantData] = await db
    .select()
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, participantId))
    .limit(1)

  if (!participantData) return []

  // Transform to expected format
  const participant = {
    user: participantData.users,
    profile: participantData.profiles,
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
  participant: { user: typeof users.$inferSelect; profile: typeof profiles.$inferSelect | null },
  mentor: ReturnType<typeof getAvailableMentors> extends Promise<infer T>
    ? T extends Array<infer U>
      ? U
      : never
    : never
): number {
  let score = 0

  const participantMetadata = (participant.user.metadata as Record<string, unknown>) || {}
  const participantInterests = (participantMetadata.interests as string[]) || []
  const participantTrack = (participantMetadata.track as string) || ''

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
  if (mentor.availability === 'available') {
    score += 20
  } else if (mentor.availability === 'limited') {
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
