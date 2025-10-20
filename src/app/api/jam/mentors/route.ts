import { NextResponse } from 'next/server'
import { getAvailableMentors } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentors
 * Get all available mentors with their mentee counts
 */
export async function GET() {
  try {
    const mentors = await getAvailableMentors()
    return NextResponse.json(mentors)
  } catch (error) {
    console.error('Error fetching mentors:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentors'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
