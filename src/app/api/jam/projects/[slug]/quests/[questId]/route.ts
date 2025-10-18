import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug } from '@/server/controllers/projects'
import {
  getProjectQuestById,
  updateProjectQuest,
} from '@/server/controllers/project-quests'

/**
 * GET /api/jam/projects/[slug]/quests/[questId]
 * Get a single project quest
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; questId: string }> }
) {
  try {
    const { slug, questId } = await context.params

    // Convert slug to project ID
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const projectQuest = await getProjectQuestById(project.id, questId)
    if (!projectQuest) {
      return NextResponse.json(
        { error: 'Project quest not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(projectQuest)
  } catch (error) {
    console.error('Project quest fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project quest' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/jam/projects/[slug]/quests/[questId]
 * Update project quest progress
 */
export async function PATCH(
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

    // Convert slug to project ID
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { userId, ...updateData } = data
    const updated = await updateProjectQuest(
      project.id,
      questId,
      updateData,
      userId
    )

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Project quest update error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('Only team members')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to update project quest' },
      { status: 500 }
    )
  }
}
