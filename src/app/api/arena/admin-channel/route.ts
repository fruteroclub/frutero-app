import { NextResponse } from 'next/server'
import { getChannelContents } from '@/lib/arena-api'

export async function GET() {
  const adminChannelSlug = process.env.NEXT_PUBLIC_ARENA_ADMIN_CHANNEL

  if (!adminChannelSlug) {
    return NextResponse.json({ error: 'Admin channel not configured' }, { status: 500 })
  }

  try {
    const channelData = await getChannelContents(adminChannelSlug, 1, 50, true)
    return NextResponse.json(channelData)
  } catch (error) {
    console.error('Error fetching admin channel:', error)
    return NextResponse.json({ error: 'Failed to fetch channel data' }, { status: 500 })
  }
}