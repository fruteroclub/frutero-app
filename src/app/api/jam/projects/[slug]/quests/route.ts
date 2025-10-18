import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug } from '@/server/controllers/projects'
import {
  getProjectQuests,
  createProjectQuest,
} from '@/server/controllers/project-quests'

/**
 * GET /api/jam/projects/[slug]/quests
 * Get all quests for a project (applied/active quests)
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

    const quests = await getProjectQuests(project.id)
    return NextResponse.json(quests)
  } catch (error) {
    console.error('Project quests fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project quests' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/jam/projects/[slug]/quests
 * Apply project to a quest
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const { questId, userId } = await request.json()

    // TODO: Get userId from authenticated session instead of request body
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Convert slug to project ID
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const projectQuest = await createProjectQuest(project.id, questId, userId)
    return NextResponse.json(projectQuest, { status: 201 })
  } catch (error) {
    console.error('Project quest application error:', error)

    // Handle specific errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('Only team members')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }
    if (errorMessage.includes('already applied')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
    if (errorMessage.includes('maximum submissions')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to apply to quest' },
      { status: 500 }
    )
  }
}
