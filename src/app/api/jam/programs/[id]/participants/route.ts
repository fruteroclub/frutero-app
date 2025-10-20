import { NextRequest, NextResponse } from 'next/server'
import { getProgramParticipants } from '@/server/controllers/programs'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const participants = await getProgramParticipants(id)
    return NextResponse.json(participants)
  } catch (error) {
    console.error('Program participants fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    )
  }
}
