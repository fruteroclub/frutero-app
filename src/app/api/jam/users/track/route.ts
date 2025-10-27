import { NextRequest, NextResponse } from 'next/server'
import { UserControllerDrizzle } from '@/server/controllers/user-controller'
import { updateTrackSchema } from '@/server/schema/track-schema'
import { AppError } from '@/server/utils'

/**
 * GET /api/jam/users/track
 * Get current user's track information
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    const trackInfo = await UserControllerDrizzle.getUserTrack(userId)
    return NextResponse.json(trackInfo)
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

/**
 * PATCH /api/jam/users/track
 * Update current user's track
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateTrackSchema.parse(body)

    const updatedUser = await UserControllerDrizzle.updateUserTrack(userId, validatedData)
    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 }
      )
    }

    const statusCode = error instanceof AppError ? error.statusCode : 500
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
