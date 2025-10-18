import { NextRequest, NextResponse } from 'next/server'
import { setProjectStage } from '@/server/controllers/jam/stages.controller'
import { getProjectBySlug } from '@/server/controllers/projects'
import type { ProjectStage } from '@/lib/jam/stages'

/**
 * PUT /api/jam/projects/[slug]/stage
 * Manually set a project stage (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    if (!slug) {
      return NextResponse.json({ error: 'Project slug is required' }, { status: 400 })
    }

    if (!body.stage) {
      return NextResponse.json({ error: 'Stage is required' }, { status: 400 })
    }

    // Get project ID from slug
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // TODO: Add admin permission check here
    // const user = await getCurrentUser(request)
    // if (!user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    const newStage = await setProjectStage(project.id, body.stage as ProjectStage)
    return NextResponse.json({ stage: newStage })
  } catch (error) {
    console.error('Set project stage error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to set project stage' },
      { status: 500 }
    )
  }
}
