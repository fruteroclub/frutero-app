import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug } from '@/server/controllers/projects'
import {
  getProjectPrograms,
  joinProgram,
} from '@/server/controllers/programs'

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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    const programs = await getProjectPrograms(project.id, status)
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Programs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
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
    const { programId } = await request.json()

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
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

    // Join program
    const programProject = await joinProgram(project.id, programId)

    return NextResponse.json(programProject, { status: 201 })
  } catch (error) {
    console.error('Join program error:', error)
    if (error instanceof Error && error.message.includes('already participating')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to join program' },
      { status: 500 }
    )
  }
}
