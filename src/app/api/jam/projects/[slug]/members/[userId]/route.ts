import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug } from '@/lib/jam/projects'
import { db } from '@/db'
import { projectMembers } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string; userId: string }> }
) {
  try {
    const { slug, userId } = await context.params
    const { role } = await request.json()

    // Get project
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update role
    await db
      .update(projectMembers)
      .set({ role })
      .where(
        and(
          eq(projectMembers.projectId, project.id),
          eq(projectMembers.userId, userId)
        )
      )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update role error:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string; userId: string }> }
) {
  try {
    const { slug, userId } = await context.params

    // Get project
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Remove member
    await db
      .delete(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, project.id),
          eq(projectMembers.userId, userId)
        )
      )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove member error:', error)
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    )
  }
}
