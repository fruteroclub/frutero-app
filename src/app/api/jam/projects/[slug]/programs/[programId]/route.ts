import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug } from '@/server/controllers/projects'
import {
  updateProgramStatus,
  leaveProgram,
} from '@/server/controllers/programs'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string; programId: string }> }
) {
  try {
    const { slug, programId } = await context.params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    if (!['ACTIVE', 'COMPLETED', 'WITHDRAWN'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Get project
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update program status
    const updated = await updateProgramStatus(project.id, programId, status)

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update program status error:', error)
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update program status' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string; programId: string }> }
) {
  try {
    const { slug, programId } = await context.params

    // Get project
    const project = await getProjectBySlug(slug)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Leave program
    await leaveProgram(project.id, programId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Leave program error:', error)
    return NextResponse.json(
      { error: 'Failed to leave program' },
      { status: 500 }
    )
  }
}
