import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug, checkStageAdvancement } from '@/server/controllers/projects'
import { submitProjectQuest } from '@/server/controllers/project-quests'

/**
 * POST /api/jam/projects/[slug]/quests/[questId]/submit
 * Submit project quest for verification
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string; questId: string }> }
) {
  try {
    const { slug, questId } = await context.params
    const data = await request.json()

    // TODO: Get userId from authenticated session instead of request body
    if (!data.userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (!data.submissionLink || !data.submissionText) {
      return NextResponse.json(
        { error: 'Submission link and text are required' },
        { status: 400 }
      )
    }

    // Convert slug to project ID
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { userId, ...submissionData } = data
    const submitted = await submitProjectQuest(
      project.id,
      questId,
      submissionData,
      userId
    )

    // Check if project can advance to next stage after quest submission
    try {
      const advancement = await checkStageAdvancement(slug)
      return NextResponse.json({
        ...submitted,
        stageCheck: advancement,
      })
    } catch (error) {
      // Don't fail the submission if stage check fails
      console.error('Stage check error:', error)
      return NextResponse.json(submitted)
    }
  } catch (error) {
    console.error('Project quest submission error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('Only team members')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }
    if (errorMessage.includes('already submitted')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to submit quest' },
      { status: 500 }
    )
  }
}
