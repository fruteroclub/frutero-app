import type {
  users,
  profiles,
  proofOfCommunities,
  programUsers,
  projects,
  userQuests,
  userBadges,
  quests,
  badges,
  programs,
  tiers,
} from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import { Address } from 'viem'
import type { UserSettings } from '@/types/jam'

// Infer types from Drizzle schema
export type User = InferSelectModel<typeof users>
export type Profile = InferSelectModel<typeof profiles>
export type ProofOfCommunity = InferSelectModel<typeof proofOfCommunities>
export type UserCommunity = InferSelectModel<typeof programUsers>
export type Project = InferSelectModel<typeof projects>
export type UserQuest = InferSelectModel<typeof userQuests>
export type UserBadge = InferSelectModel<typeof userBadges>
export type Quest = InferSelectModel<typeof quests>
export type Badge = InferSelectModel<typeof badges>
export type Community = InferSelectModel<typeof programs>
export type Tier = InferSelectModel<typeof tiers>
export type Token = Record<string, unknown> // Define if you have a tokens table

export interface ServiceResponse<T> {
  data?: T | null
  success?: boolean
  error?: Error | null
  errorMsg?: string
}

export interface ErrorDetails {
  code?: string
  details?: unknown
}

export interface UserExtended extends User {
  profile?: Profile
  settings?: UserSettings
  proofOfCommunity: ProofOfCommunityExtended
  communities?: UserCommunity[]
  projects?: Project[]
  quests?: UserQuest[]
  claimedBadges?: UserBadge[]
}

export interface ProofOfCommunityExtended extends ProofOfCommunity {
  user: User
}

export interface ProjectExtended extends Project {
  admin?: User
  badges?: BadgeExtended[]
  community?: Community
  quests?: Quest[] | QuestExtended[]
  token?: Token
}

export interface ProjectQuestsExtended extends Project {
  admin?: User
  badges?: BadgeExtended[]
  community?: Community
  quests?: QuestExtended[]
}

export interface QuestExtended extends Quest {
  admin: User
  badge: BadgeExtended
  project: Project
  userQuests: UserQuest[]
}

export interface BadgeExtended extends Badge {
  quest?: Quest
  tiers: Tier[]
  userBadges: UserBadgeExtended[]
}

export interface TierExtended extends Tier {
  badge: BadgeExtended
}

export interface RegenProject extends Project {
  admin?: User
  badges?: BadgeExtended[]
  community?: Community
  quests?: QuestExtended[]
}

export interface EnrichedQuestWithUserBadges extends QuestExtended {
  currentTier: number
  points: number
  timestamp: string | null
  userAddress: string
}

export interface AddressEnrichedQuestsType {
  userAddress: string
  enrichedQuests: EnrichedQuestWithUserBadges[]
}

export type AddressEnrichedQuestsWithUserBadges = Record<
  Address,
  EnrichedQuestWithUserBadges[]
>

export interface ProofOfCommunityExtended extends ProofOfCommunity {
  user: User
}

export interface UserBadgeExtended extends UserBadge {
  badge: BadgeExtended
  tierReached: TierExtended
}
