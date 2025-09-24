import { NextRequest, NextResponse } from 'next/server'
import { ArenaBlock } from '@/types/arena'

const ARENA_API_BASE = 'https://api.are.na/v2'
const ARENA_TOKEN = process.env.ARENA_PERSONAL_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  if (!ARENA_TOKEN) {
    return NextResponse.json({ error: 'Arena token not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { channelSlug, content } = body

    if (!channelSlug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that we're only allowing additions to the public channel
    const publicChannelSlug = process.env.NEXT_PUBLIC_ARENA_PUBLIC_CHANNEL
    if (channelSlug !== publicChannelSlug) {
      return NextResponse.json({ error: 'Unauthorized channel' }, { status: 403 })
    }

    const requestBody = typeof content === 'string' 
      ? { content } 
      : content

    const response = await fetch(`${ARENA_API_BASE}/channels/${channelSlug}/blocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARENA_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Arena API error:', error)
      return NextResponse.json({ error: 'Failed to add block to Arena' }, { status: response.status })
    }

    const block: ArenaBlock = await response.json()
    return NextResponse.json(block)

  } catch (error) {
    console.error('Error adding block:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}