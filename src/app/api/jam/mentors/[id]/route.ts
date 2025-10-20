import { NextRequest, NextResponse } from 'next/server'
import { getMentorById } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentors/[id]
 * Get mentor profile details with ratings and mentee count
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const mentor = await getMentorById(id)

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor no encontrado' }, { status: 404 })
    }

    return NextResponse.json(mentor)
  } catch (error) {
    console.error('Error fetching mentor:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
