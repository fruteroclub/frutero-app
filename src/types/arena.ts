export interface ArenaUser {
  id: number
  slug: string
  first_name: string
  last_name: string
  full_name: string
  avatar: string
  avatar_image: {
    thumb: string
    display: string
  }
}

export interface ArenaBlock {
  id: number
  title: string
  updated_at: string
  created_at: string
  state: string
  comment_count: number
  generated_title: string
  content: string
  description: string
  content_html: string
  description_html: string
  position: number
  selected: boolean
  connection_id: number
  connected_at: string
  connected_by_user_id: number
  connected_by_username: string
  connected_by_user_slug: string
  class: 'Text' | 'Image' | 'Link' | 'Media' | 'Attachment'
  base_class: 'Block'
  user: ArenaUser
  image?: {
    thumb: string
    square: string
    display: string
    large: string
    original: string
    filename: string
  }
  source?: {
    url: string
    title: string
    provider: {
      name: string
      url: string
    }
  }
}

export interface ArenaChannel {
  id: number
  title: string
  created_at: string
  updated_at: string
  published: boolean
  open: boolean
  collaboration: boolean
  slug: string
  length: number
  kind: string
  status: string
  user_id: number
  user: ArenaUser
  contents: ArenaBlock[]
  base_class: 'Channel'
  class: 'Channel'
  can_index: boolean
  nsfw?: boolean
  owner_id: number
  follower_count: number
  collaborator_count: number
}

export interface ArenaChannelResponse {
  id: number
  title: string
  created_at: string
  updated_at: string
  published: boolean
  open: boolean
  collaboration: boolean
  slug: string
  length: number
  kind: string
  status: string
  user_id: number
  contents: ArenaBlock[]
  collaborators: ArenaUser[]
  user: ArenaUser
  page: number
  per: number
  total_pages: number
}