import { NextRequest, NextResponse } from 'next/server'
import { checkStageAdvancement } from '@/server/controllers/jam/stages.controller'
import { getProjectBySlug } from '@/server/controllers/projects'

/**
 * GET /api/jam/projects/[slug]/stage/check
 * Check if a project can advance to the next stage
 */
export async function GET(
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

    const check = await checkStageAdvancement(project.id)
    return NextResponse.json(check)
  } catch (error) {
    console.error('Check stage advancement error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check stage advancement' },
      { status: 500 }
    )
  }
}
