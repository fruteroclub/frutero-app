import { NextRequest, NextResponse } from 'next/server'
import {
  getMentorProfileByUserId,
  updateMentorProfile,
  deleteMentorProfile,
} from '@/server/controllers/mentor-management'
import { updateMentorProfileSchema } from '@/server/schema/mentor-schema'
import { AppError } from '@/server/utils'

/**
 * GET /api/jam/admin/mentors/[userId]
 * Get a specific mentor profile (admin only)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const mentorProfile = await getMentorProfileByUserId(userId)
    return NextResponse.json(mentorProfile)
  } catch (error) {
    console.error('Error fetching mentor profile:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentor profile'
    const statusCode = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

/**
 * PATCH /api/jam/admin/mentors/[userId]
 * Update a mentor profile (admin only)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const body = await request.json()
    const validatedData = updateMentorProfileSchema.parse(body)

    const updatedProfile = await updateMentorProfile(userId, validatedData)
    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating mentor profile:', error)

    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    const message = error instanceof Error ? error.message : 'Failed to update mentor profile'
    const statusCode = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

/**
 * DELETE /api/jam/admin/mentors/[userId]
 * Delete a mentor profile (admin only - removes mentor status)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    await deleteMentorProfile(userId)
    return NextResponse.json({ message: 'Mentor profile deleted successfully' })
  } catch (error) {
    console.error('Error deleting mentor profile:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete mentor profile'
    const statusCode = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
