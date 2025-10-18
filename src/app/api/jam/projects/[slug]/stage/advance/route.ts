import { NextRequest, NextResponse } from 'next/server'
import { advanceProjectStage } from '@/server/controllers/jam/stages.controller'
import { getProjectBySlug } from '@/server/controllers/projects'

/**
 * POST /api/jam/projects/[slug]/stage/advance
 * Advance a project to the next stage
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Project slug is required' }, { status: 400 })
    }

    // Get project ID from slug
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const newStage = await advanceProjectStage(project.id)
    return NextResponse.json({ stage: newStage })
  } catch (error) {
    console.error('Advance project stage error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to advance project stage' },
      { status: 500 }
    )
  }
}
