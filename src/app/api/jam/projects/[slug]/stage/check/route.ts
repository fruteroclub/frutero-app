import { NextRequest, NextResponse } from 'next/server'
import { checkStageAdvancement } from '@/server/controllers/projects'
import { AppError } from '@/server/utils'

/**
 * GET /api/jam/projects/[slug]/stage/check
 * Check if a project can advance to the next stage
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params

    const advancement = await checkStageAdvancement(slug)

    return NextResponse.json(advancement)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Error checking stage advancement:', error)
    return NextResponse.json(
      { error: 'Failed to check stage advancement' },
      { status: 500 }
    )
  }
}
