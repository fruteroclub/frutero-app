import { ArenaChannelResponse, ArenaBlock } from '@/types/arena'

const ARENA_API_BASE = 'https://api.are.na/v2'
const ARENA_TOKEN = process.env.ARENA_PERSONAL_ACCESS_TOKEN

interface ArenaApiOptions {
  requireAuth?: boolean
}

async function arenaFetch(endpoint: string, options: ArenaApiOptions = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (options.requireAuth && ARENA_TOKEN) {
    headers['Authorization'] = `Bearer ${ARENA_TOKEN}`
  }

  const response = await fetch(`${ARENA_API_BASE}${endpoint}`, {
    headers,
    next: { revalidate: 30 }, // Cache for 30 seconds
  })

  if (!response.ok) {
    throw new Error(`Arena API error: ${response.status}`)
  }

  return response.json()
}

export async function getChannel(slug: string): Promise<ArenaChannelResponse> {
  return arenaFetch(`/channels/${slug}`)
}

export async function getChannelContents(slug: string, page = 1, per = 50, requireAuth = false): Promise<ArenaChannelResponse> {
  return arenaFetch(`/channels/${slug}?page=${page}&per=${per}`, { requireAuth })
}

export async function addBlockToChannel(channelSlug: string, content: string | { source: string }): Promise<ArenaBlock> {
  const body = typeof content === 'string' 
    ? { content } 
    : content

  const response = await fetch(`${ARENA_API_BASE}/channels/${channelSlug}/blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ARENA_TOKEN}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Failed to add block: ${response.status}`)
  }

  return response.json()
}

// Helper function to format Arena blocks for display
export function formatArenaContent(block: ArenaBlock) {
  switch (block.class) {
    case 'Text':
      return {
        type: 'text',
        content: block.content,
        title: block.title || block.generated_title,
      }
    case 'Image':
      return {
        type: 'image',
        url: block.image?.large || block.image?.display,
        thumb: block.image?.thumb,
        title: block.title || block.generated_title,
        description: block.description,
      }
    case 'Link':
      return {
        type: 'link',
        url: block.source?.url,
        title: block.title || block.source?.title || block.generated_title,
        description: block.description,
        provider: block.source?.provider?.name,
      }
    default:
      return {
        type: 'unknown',
        title: block.title || block.generated_title,
        content: block.content,
      }
  }
}