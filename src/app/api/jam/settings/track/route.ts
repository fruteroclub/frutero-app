import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { userSettings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { Track } from '@/types/jam'

export async function PATCH(request: NextRequest) {
  try {
    const { userId, track } = await request.json()

    if (!userId || !track) {
      return NextResponse.json(
        { error: 'userId and track are required' },
        { status: 400 }
      )
    }

    // Validate track value
    const validTracks: Track[] = ['LEARNING', 'FOUNDER', 'PROFESSIONAL', 'FREELANCER']
    if (!validTracks.includes(track as Track)) {
      return NextResponse.json(
        { error: 'Invalid track value' },
        { status: 400 }
      )
    }

    // Check if settings exist
    const [existingSettings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1)

    if (!existingSettings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      )
    }

    // Check track change limit (max 2 changes)
    const changeCount = existingSettings.trackChangeCount || 0
    if (changeCount >= 2) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de cambios de ruta (máximo 2)' },
        { status: 403 }
      )
    }

    // Update track
    const [updatedSettings] = await db
      .update(userSettings)
      .set({
        track: track as Track,
        trackChangedAt: new Date(),
        trackChangeCount: changeCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, userId))
      .returning()

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      remainingChanges: 2 - updatedSettings.trackChangeCount,
    })
  } catch (error) {
    console.error('Error updating track:', error)
    return NextResponse.json(
      { error: 'Failed to update track' },
      { status: 500 }
    )
  }
}
