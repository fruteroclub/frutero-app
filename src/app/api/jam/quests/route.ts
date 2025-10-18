import { NextRequest, NextResponse } from 'next/server'
import { getAllQuests } from '@/server/controllers/quests'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      type: searchParams.get('type') as 'INDIVIDUAL' | 'TEAM' | 'BOTH' | undefined,
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      programId: searchParams.get('programId') || undefined,
    }

    const quests = await getAllQuests(filters)

    return NextResponse.json(quests, { status: 200 })
  } catch (error) {
    console.error('Get quests API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    )
  }
}
