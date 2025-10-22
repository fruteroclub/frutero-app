import { db } from '@/db'
import { users, mentorProfiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { AppError } from '@/server/utils'

/**
 * Mentor Management Controller
 * Admin operations for creating and managing mentor profiles
 */

export interface CreateMentorProfileData {
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'
  maxParticipants: number
  expertiseAreas: string[]
  mentoringApproach?: string
  experience?: string
}

export interface UpdateMentorProfileData {
  availability?: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'
  maxParticipants?: number
  expertiseAreas?: string[]
  mentoringApproach?: string
  experience?: string
}

/**
 * Create a mentor profile for a user
 */
export async function createMentorProfile(
  userId: string,
  data: CreateMentorProfileData
) {
  try {
    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    // Check if mentor profile already exists
    const [existingMentor] = await db
      .select()
      .from(mentorProfiles)
      .where(eq(mentorProfiles.userId, userId))
      .limit(1)

    if (existingMentor) {
      throw new AppError('User is already a mentor', 400)
    }

    // Create mentor profile
    const [mentorProfile] = await db
      .insert(mentorProfiles)
      .values({
        userId,
        availability: data.availability,
        maxParticipants: data.maxParticipants,
        expertiseAreas: data.expertiseAreas,
        mentoringApproach: data.mentoringApproach || null,
        experience: data.experience || null,
      })
      .returning()

    return mentorProfile
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Error creating mentor profile:', error)
    throw new AppError('Failed to create mentor profile', 500)
  }
}

/**
 * Update an existing mentor profile
 */
export async function updateMentorProfile(
  userId: string,
  data: UpdateMentorProfileData
) {
  try {
    // Check if mentor profile exists
    const [existingMentor] = await db
      .select()
      .from(mentorProfiles)
      .where(eq(mentorProfiles.userId, userId))
      .limit(1)

    if (!existingMentor) {
      throw new AppError('Mentor profile not found', 404)
    }

    // Update mentor profile
    const [updatedProfile] = await db
      .update(mentorProfiles)
      .set({
        ...(data.availability && { availability: data.availability }),
        ...(data.maxParticipants !== undefined && { maxParticipants: data.maxParticipants }),
        ...(data.expertiseAreas && { expertiseAreas: data.expertiseAreas }),
        ...(data.mentoringApproach !== undefined && { mentoringApproach: data.mentoringApproach }),
        ...(data.experience !== undefined && { experience: data.experience }),
        updatedAt: new Date(),
      })
      .where(eq(mentorProfiles.userId, userId))
      .returning()

    return updatedProfile
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Error updating mentor profile:', error)
    throw new AppError('Failed to update mentor profile', 500)
  }
}

/**
 * Get a mentor profile by user ID
 */
export async function getMentorProfileByUserId(userId: string) {
  try {
    const result = await db.query.mentorProfiles.findFirst({
      where: eq(mentorProfiles.userId, userId),
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    })

    if (!result) {
      throw new AppError('Mentor profile not found', 404)
    }

    return result
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Error fetching mentor profile:', error)
    throw new AppError('Failed to fetch mentor profile', 500)
  }
}

/**
 * Get all mentor profiles (admin view)
 */
export async function getAllMentorProfilesForAdmin() {
  try {
    const mentors = await db.query.mentorProfiles.findMany({
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: (mentorProfiles, { desc }) => [desc(mentorProfiles.createdAt)],
    })

    return mentors
  } catch (error) {
    console.error('Error fetching all mentor profiles:', error)
    throw new AppError('Failed to fetch mentor profiles', 500)
  }
}

/**
 * Delete a mentor profile (removes mentor status)
 */
export async function deleteMentorProfile(userId: string) {
  try {
    const [deleted] = await db
      .delete(mentorProfiles)
      .where(eq(mentorProfiles.userId, userId))
      .returning()

    if (!deleted) {
      throw new AppError('Mentor profile not found', 404)
    }

    return deleted
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Error deleting mentor profile:', error)
    throw new AppError('Failed to delete mentor profile', 500)
  }
}

/**
 * Get all non-mentor users (for admin user selection)
 */
export async function getNonMentorUsers() {
  try {
    // Get all user IDs that have mentor profiles
    const mentorUserIds = await db
      .select({ userId: mentorProfiles.userId })
      .from(mentorProfiles)

    const mentorIds = mentorUserIds.map((m) => m.userId)

    // Get all users that are NOT in the mentor list
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        email: users.email,
        avatarUrl: users.avatarUrl,
      })
      .from(users)

    // Filter out mentors in JavaScript
    const nonMentors = allUsers.filter((user) => !mentorIds.includes(user.id))

    return nonMentors
  } catch (error) {
    console.error('Error fetching non-mentor users:', error)
    throw new AppError('Failed to fetch users', 500)
  }
}
