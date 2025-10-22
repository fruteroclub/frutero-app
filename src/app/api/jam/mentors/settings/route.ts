import { NextRequest, NextResponse } from 'next/server'
import {
  getMentorProfileByUserId,
  updateMentorProfile,
} from '@/server/controllers/mentor-management'
import { mentorSettingsSchema } from '@/server/schema/mentor-schema'
import { AppError } from '@/server/utils'

/**
 * GET /api/jam/mentors/settings
 * Get current user's mentor settings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const mentorProfile = await getMentorProfileByUserId(userId)
    return NextResponse.json(mentorProfile)
  } catch (error) {
    console.error('Error fetching mentor settings:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentor settings'
    const statusCode = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

/**
 * PATCH /api/jam/mentors/settings
 * Update current user's mentor settings
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...settingsData } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const validatedData = mentorSettingsSchema.parse(settingsData)

    const updatedProfile = await updateMentorProfile(userId, validatedData)
    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating mentor settings:', error)

    if (error instanceof Error && 'issues' in error) {
      // Zod validation error
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    const message = error instanceof Error ? error.message : 'Failed to update mentor settings'
    const statusCode = error instanceof AppError ? error.statusCode : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
