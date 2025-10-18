import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug, getProjectMembers } from '@/server/controllers/projects'
import { db } from '@/db'
import { projectMembers } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const { userId, role = 'MEMBER' } = await request.json()

    // Get project
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if already a member
    const existing = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, project.id),
          eq(projectMembers.userId, userId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'User is already a team member' },
        { status: 400 }
      )
    }

    // Add member
    const [newMember] = await db
      .insert(projectMembers)
      .values({
        projectId: project.id,
        userId,
        role,
        joinedAt: new Date(),
        createdAt: new Date(),
      })
      .returning()

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error('Add member error:', error)
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    )
  }
}
