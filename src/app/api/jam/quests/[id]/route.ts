import { NextRequest, NextResponse } from 'next/server'
import { getQuestById } from '@/server/controllers/quests'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quest = await getQuestById(id)

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }

    return NextResponse.json(quest, { status: 200 })
  } catch (error) {
    console.error('Get quest API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quest' },
      { status: 500 }
    )
  }
}
