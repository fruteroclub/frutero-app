import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug } from '@/server/controllers/projects'
import { getAvailableTeamQuestsForProject } from '@/server/controllers/project-quests'

/**
 * GET /api/jam/projects/[slug]/quests/available
 * Get available team quests for a project based on program participation
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params

    // Convert slug to project ID
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const quests = await getAvailableTeamQuestsForProject(project.id)
    return NextResponse.json(quests)
  } catch (error) {
    console.error('Available quests fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available quests' },
      { status: 500 }
    )
  }
}
