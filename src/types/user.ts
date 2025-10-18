// User type definitions matching Drizzle schema

export interface User {
  id: string
  username: string
  displayName: string
  email: string | null
  bio: string | null
  website: string | null
  avatarUrl: string | null
  bannerUrl: string | null
  metadata?: Record<string, unknown> | null
  isAdmin: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UserProfile {
  id: string
  firstName: string | null
  lastName: string | null
  cityRegion: string | null
  country: string | null
  primaryRole: string | null
  professionalProfile: string | null
  isStudent: boolean
  discordUsername: string | null
  farcasterUsername: string | null
  githubUsername: string | null
  xUsername: string | null
  telegramUsername: string | null
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserWithProfile extends User {
  profile: UserProfile | null
}
