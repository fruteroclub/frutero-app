import { NextRequest, NextResponse } from 'next/server'
import { getProjectQuests } from '@/server/controllers/quests'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const filters = {
      type: searchParams.get('type') as 'TEAM' | 'BOTH' | undefined,
    }

    const quests = await getProjectQuests(projectId, filters)

    return NextResponse.json(quests, { status: 200 })
  } catch (error) {
    console.error('Get project quests API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project quests' },
      { status: 500 }
    )
  }
}
