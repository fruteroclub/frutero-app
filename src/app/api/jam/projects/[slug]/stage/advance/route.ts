import { NextRequest, NextResponse } from 'next/server'
import { advanceProjectStage } from '@/server/controllers/projects'
import { AppError } from '@/server/utils'

/**
 * POST /api/jam/projects/[slug]/stage/advance
 * Advance a project to the next stage
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const body = await request.json()
    const { manualOverride = false } = body

    const result = await advanceProjectStage(slug, manualOverride)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error('Error advancing project stage:', error)
    return NextResponse.json(
      { error: 'Failed to advance project stage' },
      { status: 500 }
    )
  }
}
