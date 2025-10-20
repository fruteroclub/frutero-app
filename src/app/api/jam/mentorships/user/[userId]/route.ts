import { NextRequest, NextResponse } from 'next/server'
import { getUserMentorships } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentorships/user/[userId]
 * Get all mentorships for a user (as mentor or participant)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const mentorships = await getUserMentorships(userId)
    return NextResponse.json(mentorships)
  } catch (error) {
    console.error('Error fetching user mentorships:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentorships'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
