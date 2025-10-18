import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  serial,
  real,
  timestamp,
  jsonb,
  decimal,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleCategoryEnum = pgEnum('role_category', [
  'ADMIN', 'MODERATOR', 'GARDENER', 'MEMBER', 'AGENT', 'ANON', 'BOT', 'SUS', 'IMPOSTOR', 'BANNED'
]);

export const projectStageEnum = pgEnum('project_stage', [
  'IDEA', 'PROTOTYPE', 'BUILD', 'PROJECT', 'INCUBATE', 'ACCELERATE', 'SCALE'
]);

export const userQuestStatusEnum = pgEnum('user_quest_status', [
  'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
]);

export const participantRoleEnum = pgEnum('participant_role', [
  'OWNER', 'ADMIN', 'MEMBER', 'OBSERVER', 'BOT'
]);

export const aluxTypeEnum = pgEnum('alux_type', [
  'GRASS', 'FIRE', 'WATER', 'ELECTRIC', 'ICE', 'FIGHTING', 'PSYCHIC', 'ROCK', 'GHOST', 'DRAGON', 'DARK', 'FAIRY', 'STEEL', 'POISON', 'GROUND', 'FLYING', 'BUG', 'NORMAL'
]);

export const alignmentEnum = pgEnum('alignment', [
  'BUILD', 'DEGEN', 'REGEN', 'VIBES', 'SAGE', 'ZEN'
]);

export const programTypeEnum = pgEnum('program_type', [
  'BUILD', 'ONBOARD', 'REVENUE', 'ACCELERATE', 'LEARN'
]);

export const programStatusEnum = pgEnum('program_status', [
  'PLANNED', 'ACTIVE', 'COMPLETED', 'RECURRING'
]);

// Base Tables (no circular dependencies)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  appWallet: text('app_wallet').unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  extWallet: text('ext_wallet').unique(),
  email: text('email').unique(),
  bio: text('bio'),
  website: text('website'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  metadata: jsonb('metadata'),
  activeAluxId: uuid('active_alux_id').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const communities = pgTable('communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  category: text('category').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  tokenId: uuid('token_id').unique(),
  contractAddresses: text('contract_addresses').array().notNull().default([]),
  networks: text('networks').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tokens = pgTable('tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address').notNull().unique(),
  chainId: integer('chain_id').notNull(),
  symbol: text('symbol').notNull(),
  decimals: integer('decimals').notNull(),
  communityId: uuid('community_id').unique(),
  projectId: uuid('project_id').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  contractAddress: text('contract_address'),
  tokenId: text('token_id'),
  chain: text('chain'),
  chainId: integer('chain_id'),
  projectId: uuid('project_id'),
  communityId: uuid('community_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  type: programTypeEnum('type').notNull(),
  status: programStatusEnum('status').notNull().default('PLANNED'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  cohort: text('cohort'),
  location: text('location'),
  capacity: integer('capacity'),
  websiteUrl: text('website_url'),
  repositoryUrl: text('repository_url'),
  applicationUrl: text('application_url'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  participantCount: integer('participant_count').notNull().default(0),
  completionRate: real('completion_rate'),
  totalProjects: integer('total_projects').notNull().default(0),
  conversionMetrics: jsonb('conversion_metrics'),
  communityId: uuid('community_id'),
  tags: text('tags').array().notNull().default([]),
  kpis: jsonb('kpis'),
  budget: decimal('budget'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Tables with foreign keys
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  cityRegion: text('city_region'),
  country: text('country'),
  primaryRole: text('primary_role'),
  professionalProfile: text('professional_profile'),
  isStudent: boolean('is_student').notNull().default(false),
  discordUsername: text('discord_username'),
  farcasterId: integer('farcaster_id'),
  farcasterUsername: text('farcaster_username'),
  githubUsername: text('github_username'),
  xUsername: text('x_username'),
  telegramUsername: text('telegram_username'),
  species: text('species'),
  alignment: alignmentEnum('alignment'),
  primaryType: aluxTypeEnum('primary_type'),
  emoji: text('emoji'),
  userId: uuid('user_id').notNull().unique().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  wallet: text('wallet'),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  repositoryUrl: text('repository_url'),
  videoUrl: text('video_url'),
  productionUrl: text('production_url'),
  pitchDeckUrl: text('pitch_deck_url'),
  website: text('website'),
  email: text('email'),
  category: text('category'),
  projectType: text('project_type'),
  stage: projectStageEnum('stage').notNull().default('IDEA'),
  apiUrl: text('api_url').notNull().default(''),
  activeUrl: text('active_url').notNull().default(''),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  tokenId: uuid('token_id').unique(),
  contractAddresses: text('contract_addresses').array().notNull().default([]),
  networks: text('networks').array().notNull().default([]),
  farcasterId: integer('farcaster_id'),
  farcasterUsername: text('farcaster_username'),
  githubUsername: text('github_username'),
  xUsername: text('x_username'),
  telegramUsername: text('telegram_username'),
  adminId: uuid('admin_id').notNull().references(() => users.id),
  communityId: uuid('community_id').references(() => communities.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Self-referencing table (roles)
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: roleCategoryEnum('category').notNull(),
  name: text('name').notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id'),
  projectId: uuid('project_id'),
  communityId: uuid('community_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const quests = pgTable('quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  start: timestamp('start').notNull(),
  end: timestamp('end').notNull(),
  badgeId: uuid('badge_id').unique().references(() => badges.id),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  media_url: text('media_url'),
  category: text('category').default('default'),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  authorId: uuid('author_id').notNull().references(() => users.id),
  communityId: uuid('community_id').references(() => communities.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Self-referencing table (comments)
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  authorId: uuid('author_id').notNull().references(() => users.id),
  postId: uuid('post_id').notNull().references(() => posts.id),
  parentCommentId: uuid('parent_comment_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const aluxes = pgTable('aluxes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  species: text('species').notNull(),
  emoji: text('emoji').notNull(),
  primaryType: aluxTypeEnum('primary_type').notNull(),
  secondaryType: aluxTypeEnum('secondary_type'),
  level: integer('level').notNull().default(0),
  experience: integer('experience').notNull().default(0),
  attack: integer('attack').notNull().default(0),
  defense: integer('defense').notNull().default(0),
  spAttack: integer('sp_attack').notNull().default(0),
  spDefense: integer('sp_defense').notNull().default(0),
  speed: integer('speed').notNull().default(0),
  hp: integer('hp').notNull().default(0),
  stage: integer('stage').notNull().default(0),
  experiencePoints: integer('experience_points').notNull().default(0),
  alignment: alignmentEnum('alignment').notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  communityId: uuid('community_id').references(() => communities.id),
  tokenId: text('token_id').unique(),
  isTrainable: boolean('is_trainable').notNull().default(false),
  isTradeable: boolean('is_tradeable').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const aluxAbilities = pgTable('alux_abilities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  power: integer('power').notNull().default(1),
  inGameEffect: text('in_game_effect').notNull(),
  offGameEffect: text('off_game_effect').notNull(),
  alignment: alignmentEnum('alignment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Junction tables
export const aluxesToAbilities = pgTable('aluxes_to_abilities', {
  aluxId: uuid('alux_id').notNull().references(() => aluxes.id),
  abilityId: uuid('ability_id').notNull().references(() => aluxAbilities.id),
}, (table) => ({
  pk: unique('aluxes_to_abilities_pk').on(table.aluxId, table.abilityId),
}));

export const usersToAluxes = pgTable('users_to_aluxes', {
  userId: uuid('user_id').notNull().references(() => users.id),
  aluxId: uuid('alux_id').notNull().references(() => aluxes.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  pk: unique('users_to_aluxes_pk').on(table.userId, table.aluxId),
}));

// All other tables
export const proofOfCommunities = pgTable('proof_of_communities', {
  id: serial('id').primaryKey(),
  tokenId: integer('token_id'),
  contractAddress: text('contract_address'),
  chainId: integer('chain_id'),
  description: text('description').notNull(),
  externalUrl: text('external_url').notNull(),
  image: text('image').notNull(),
  name: text('name').notNull(),
  points: integer('points').notNull().default(0),
  percentage: real('percentage').notNull().default(0),
  tier: text('tier').notNull(),
  stage: integer('stage').notNull().default(0),
  userId: uuid('user_id').notNull().unique().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userCommunities = pgTable('user_communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  isAdmin: boolean('is_admin').notNull().default(false),
  isModerator: boolean('is_moderator').notNull().default(false),
  userId: uuid('user_id').notNull().references(() => users.id),
  communityId: uuid('community_id').notNull().references(() => communities.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserCommunity: unique('user_community_unique').on(table.userId, table.communityId),
}));

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').notNull().references(() => roles.id),
  permissionId: uuid('permission_id').notNull().references(() => permissions.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueRolePermission: unique('role_permission_unique').on(table.roleId, table.permissionId),
}));

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  roleId: uuid('role_id').notNull().references(() => roles.id),
  communityId: uuid('community_id').references(() => communities.id),
  userCommunityId: uuid('user_community_id').references(() => userCommunities.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserRole: unique('user_role_unique').on(table.userId, table.roleId, table.communityId),
}));

export const roleGrants = pgTable('role_grants', {
  id: uuid('id').primaryKey().defaultRandom(),
  grantorId: uuid('grantor_id').notNull().references(() => users.id),
  roleId: uuid('role_id').notNull().references(() => roles.id),
  expiresAt: timestamp('expires_at'),
  revoked: boolean('revoked').notNull().default(false),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userTokens = pgTable('user_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  balance: decimal('balance').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  tokenId: uuid('token_id').notNull().references(() => tokens.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserToken: unique('user_token_unique').on(table.userId, table.tokenId),
}));

export const communityTokens = pgTable('community_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  minBalance: decimal('min_balance').notNull(),
  communityId: uuid('community_id').notNull().references(() => communities.id),
  tokenId: uuid('token_id').notNull().references(() => tokens.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueCommunityToken: unique('community_token_unique').on(table.communityId, table.tokenId),
}));

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  voteValue: integer('vote_value').notNull().default(0),
  userId: uuid('user_id').notNull().references(() => users.id),
  postId: uuid('post_id').references(() => posts.id),
  commentId: uuid('comment_id').references(() => comments.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const rewards = pgTable('rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  amount: integer('amount').notNull(),
  userId: uuid('user_id').references(() => users.id),
  questId: uuid('quest_id').references(() => quests.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tiers = pgTable('tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  points: integer('points').notNull(),
  level: integer('level').notNull(),
  metadata: text('metadata'),
  badgeId: uuid('badge_id').references(() => badges.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  contractAddress: text('contract_address').notNull().default('0x0000000000000000000000000000000000000000'),
  points: integer('points').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  badgeId: uuid('badge_id').notNull().references(() => badges.id),
  tierReachedId: uuid('tier_reached_id').notNull().references(() => tiers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserBadge: unique('user_badge_unique').on(table.userId, table.badgeId),
}));

export const userQuests = pgTable('user_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  status: userQuestStatusEnum('status').notNull().default('NOT_STARTED'),
  userId: uuid('user_id').notNull().references(() => users.id),
  questId: uuid('quest_id').notNull().references(() => quests.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserQuest: unique('user_quest_unique').on(table.userId, table.questId),
}));

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  content: text('content').notNull(),
  title: text('title'),
  summary: text('summary'),
  category: text('category'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const conversationParticipants = pgTable('conversation_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: participantRoleEnum('role').notNull().default('MEMBER'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  leftAt: timestamp('left_at'),
  messageCount: integer('message_count').notNull().default(0),
  lastActive: timestamp('last_active').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueParticipant: unique('conversation_participant_unique').on(table.conversationId, table.userId),
}));

export const memories = pgTable('memories', {
  id: text('id').primaryKey(),
  startedAt: timestamp('started_at').notNull(),
  finishedAt: timestamp('finished_at').notNull(),
  source: text('source').notNull(),
  language: text('language').notNull(),
  structured: jsonb('structured').notNull(),
  transcriptSegments: jsonb('transcript_segments').notNull(),
  geolocation: jsonb('geolocation').notNull(),
  photos: text('photos').array().notNull().default([]),
  pluginsResults: jsonb('plugins_results'),
  externalData: jsonb('external_data'),
  discarded: boolean('discarded').notNull().default(false),
  deleted: boolean('deleted').notNull().default(false),
  visibility: text('visibility').notNull().default('private'),
  processingMemoryId: text('processing_memory_id'),
  status: text('status').notNull().default('completed'),
  uid: text('uid'),
  participants: text('participants').array().notNull().default([]),
  participantPlatform: text('participant_platform').array().notNull().default([]),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const communityPartners = pgTable('community_partners', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').notNull().references(() => programs.id),
  communityId: uuid('community_id').notNull().references(() => communities.id),
  role: text('role').notNull(),
  contribution: text('contribution'),
  participantsContributed: integer('participants_contributed').notNull().default(0),
  projectsContributed: integer('projects_contributed').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueProgramCommunity: unique('program_community_unique').on(table.programId, table.communityId),
}));

export const programUsers = pgTable('program_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').notNull().references(() => programs.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('PARTICIPANT'),
  status: text('status').notNull().default('ACTIVE'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  attendanceRate: real('attendance_rate'),
  milestonesMet: integer('milestones_met').notNull().default(0),
  submissions: integer('submissions').notNull().default(0),
  outputLinks: text('output_links').array().notNull().default([]),
  metricsData: jsonb('metrics_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueProgramUser: unique('program_user_unique').on(table.programId, table.userId),
}));

export const programProjects = pgTable('program_projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: roleCategoryEnum('role').notNull().default('MEMBER'),
  programId: uuid('program_id').notNull().references(() => programs.id),
  projectId: uuid('project_id').notNull().unique().references(() => projects.id),
  entryStage: projectStageEnum('entry_stage').notNull(),
  currentStage: projectStageEnum('current_stage').notNull(),
  showcaseRank: integer('showcase_rank'),
  featured: boolean('featured').notNull().default(false),
  completionScore: real('completion_score'),
  innovationScore: real('innovation_score'),
  impactScore: real('impact_score'),
  outputLinks: text('output_links').array().notNull().default([]),
  metricsData: jsonb('metrics_data'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueProgramProject: unique('program_project_unique').on(table.programId, table.projectId),
}));

export const programMilestones = pgTable('program_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').notNull().references(() => programs.id),
  title: text('title').notNull(),
  description: text('description'),
  dueDate: timestamp('due_date').notNull(),
  completedDate: timestamp('completed_date'),
  status: text('status').notNull().default('PENDING'),
  type: text('type').notNull(),
  requiredOutputs: text('required_outputs').array().notNull().default([]),
  evaluationCriteria: jsonb('evaluation_criteria'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const programSponsors = pgTable('program_sponsors', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').notNull().references(() => programs.id),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  website: text('website'),
  sponsorshipType: text('sponsorship_type').notNull(),
  contributionValue: decimal('contribution_value'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueProgramSponsor: unique('program_sponsor_unique').on(table.programId, table.name),
}));

export const dummy = pgTable('dummy', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
});

// Add foreign key references after all tables are defined
// This helps avoid circular reference issues

// Add self-references after table definitions
export const rolesWithRefs = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: roleCategoryEnum('category').notNull(),
  name: text('name').notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id').references(() => roles.id),
  projectId: uuid('project_id').references(() => projects.id),
  communityId: uuid('community_id').references(() => communities.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const commentsWithRefs = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  authorId: uuid('author_id').notNull().references(() => users.id),
  postId: uuid('post_id').notNull().references(() => posts.id),
  parentCommentId: uuid('parent_comment_id').references(() => comments.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations - defined separately to avoid circular dependencies
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  proofOfCommunity: one(proofOfCommunities, { fields: [users.id], references: [proofOfCommunities.userId] }),
  communities: many(userCommunities),
  projects: many(projects),
  posts: many(posts),
  programsCollabs: many(programUsers),
  quests: many(userQuests),
  rewards: many(rewards),
  comments: many(comments),
  votes: many(votes),
  claimedBadges: many(userBadges),
  conversationParticipants: many(conversationParticipants),
  memories: many(memories),
  userAluxes: many(usersToAluxes),
  activeAlux: one(aluxes, { fields: [users.activeAluxId], references: [aluxes.id], relationName: 'activeAlux' }),
  ownedAluxes: many(aluxes, { relationName: 'owner' }),
  roles: many(userRoles),
  roleGrants: many(roleGrants),
  tokens: many(userTokens),
}));

export const aluxesRelations = relations(aluxes, ({ one, many }) => ({
  owner: one(users, { fields: [aluxes.ownerId], references: [users.id], relationName: 'owner' }),
  community: one(communities, { fields: [aluxes.communityId], references: [communities.id] }),
  abilities: many(aluxesToAbilities),
  activeUser: one(users, { fields: [aluxes.id], references: [users.activeAluxId], relationName: 'activeAlux' }),
  userAluxes: many(usersToAluxes),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  parentRole: one(roles, { fields: [roles.parentId], references: [roles.id], relationName: 'roleHierarchy' }),
  childRoles: many(roles, { relationName: 'roleHierarchy' }),
  project: one(projects, { fields: [roles.projectId], references: [projects.id], relationName: 'projectRoles' }),
  community: one(communities, { fields: [roles.communityId], references: [communities.id], relationName: 'communityRoles' }),
  permissions: many(rolePermissions),
  userRoles: many(userRoles),
  roleGrants: many(roleGrants),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  votes: many(votes),
  parentComment: one(comments, { fields: [comments.parentCommentId], references: [comments.id], relationName: 'childComments' }),
  childComments: many(comments, { relationName: 'childComments' }),
}));

export const usersToAluxesRelations = relations(usersToAluxes, ({ one }) => ({
  user: one(users, { fields: [usersToAluxes.userId], references: [users.id] }),
  alux: one(aluxes, { fields: [usersToAluxes.aluxId], references: [aluxes.id] }),
}));

// Add other relations as needed...




