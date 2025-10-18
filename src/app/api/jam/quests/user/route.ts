import { NextRequest, NextResponse } from 'next/server'
import { getUserQuests } from '@/server/controllers/quests'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const filters = {
      type: searchParams.get('type') as 'INDIVIDUAL' | 'TEAM' | 'BOTH' | undefined,
    }

    const quests = await getUserQuests(userId, filters)

    return NextResponse.json(quests, { status: 200 })
  } catch (error) {
    console.error('Get user quests API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user quests' },
      { status: 500 }
    )
  }
}
