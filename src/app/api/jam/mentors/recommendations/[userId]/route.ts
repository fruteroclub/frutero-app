import { NextRequest, NextResponse } from 'next/server'
import { getMentorRecommendations } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentors/recommendations/[userId]
 * Get top 3 mentor recommendations for a participant
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const recommendations = await getMentorRecommendations(userId)
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Error fetching mentor recommendations:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch recommendations'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
