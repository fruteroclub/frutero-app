import { NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'

export async function GET() {
  try {
    const allProjects = await db.select().from(projects)
    return NextResponse.json(allProjects)
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
