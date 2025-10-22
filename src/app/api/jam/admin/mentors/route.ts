import { NextRequest, NextResponse } from 'next/server'
import {
  createMentorProfile,
  getAllMentorProfilesForAdmin,
  getNonMentorUsers,
} from '@/server/controllers/mentor-management'
import { createMentorProfileSchema } from '@/server/schema/mentor-schema'
import { AppError } from '@/server/utils'

/**
 * GET /api/jam/admin/mentors
 * Get all mentor profiles (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeNonMentors = searchParams.get('includeNonMentors') === 'true'

    if (includeNonMentors) {
      const nonMentors = await getNonMentorUsers()
      return NextResponse.json(nonMentors)
    }

    const mentors = await getAllMentorProfilesForAdmin()
    return NextResponse.json(mentors)
  } catch (error) {
    console.error('Error fetching mentors:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentors'
    const statusCode = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

/**
 * POST /api/jam/admin/mentors
 * Create a new mentor profile (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createMentorProfileSchema.parse(body)

    const mentorProfile = await createMentorProfile(
      validatedData.userId,
      {
        availability: validatedData.availability,
        maxParticipants: validatedData.maxParticipants,
        expertiseAreas: validatedData.expertiseAreas,
        mentoringApproach: validatedData.mentoringApproach,
        experience: validatedData.experience,
      }
    )

    return NextResponse.json(mentorProfile, { status: 201 })
  } catch (error) {
    console.error('Error creating mentor profile:', error)

    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    const message = error instanceof Error ? error.message : 'Failed to create mentor profile'
    const statusCode = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
