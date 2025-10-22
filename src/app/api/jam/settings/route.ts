import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { userSettings } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/jam/settings?userId={userId}
 * Get user settings including onboarding status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)

    if (!settings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    )
  }
}
