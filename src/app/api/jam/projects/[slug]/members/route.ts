import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug, getProjectMembers } from '@/lib/jam/projects'

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

    const members = await getProjectMembers(project.id)
    return NextResponse.json(members)
  } catch (error) {
    console.error('Members fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
