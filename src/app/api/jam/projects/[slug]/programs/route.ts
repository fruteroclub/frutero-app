import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug, getProjectPrograms } from '@/server/controllers/projects'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params

    // Convert slug to ID first
    const project = await getProjectBySlug(slug)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const programs = await getProjectPrograms(project.id)
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Programs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}
