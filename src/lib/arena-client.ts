import { ArenaChannelResponse, ArenaBlock } from '@/types/arena'

const ARENA_API_BASE = 'https://api.are.na/v2'

// Client-side API functions that don't expose server secrets
export async function getChannelContentsClient(slug: string, page = 1, per = 50): Promise<ArenaChannelResponse> {
  const response = await fetch(`${ARENA_API_BASE}/channels/${slug}?page=${page}&per=${per}`, {
    cache: 'no-store', // No cache para datos siempre frescos
    headers: {
      'Cache-Control': 'no-cache',
    }
  })
  
  if (!response.ok) {
    throw new Error(`Arena API error: ${response.status}`)
  }

  return response.json()
}

export async function addBlockToChannelClient(channelSlug: string, content: string | { source: string }): Promise<ArenaBlock> {
  // This will be handled by our API route to keep the token secure
  const response = await fetch('/api/arena/add-block', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channelSlug,
      content,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to add block: ${error}`)
  }

  return response.json()
}