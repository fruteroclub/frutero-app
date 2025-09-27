import {
  pgTable,
  pgEnum,
  uuid,
  text,
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

// ============================================
// ENUMS - Only essential ones
// ============================================

export const projectStageEnum = pgEnum('project_stage', [
  'IDEA', 'PROTOTYPE', 'BUILD', 'PROJECT', 'INCUBATE', 'ACCELERATE', 'SCALE'
]);

export const userQuestStatusEnum = pgEnum('user_quest_status', [
  'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
]);

export const programTypeEnum = pgEnum('program_type', [
  'BUILD', 'ONBOARD', 'REVENUE', 'ACCELERATE', 'LEARN'
]);

export const programStatusEnum = pgEnum('program_status', [
  'PLANNED', 'ACTIVE', 'COMPLETED', 'RECURRING'
]);

// ============================================
// CORE TABLES (12 tables)
// ============================================

// 1. Users - Simplified without complex permissions
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  email: text('email').unique(),
  bio: text('bio'),
  website: text('website'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  metadata: jsonb('metadata'),
  isAdmin: boolean('is_admin').notNull().default(false), // Simple admin flag
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 2. Profiles - User extended information
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
  farcasterUsername: text('farcaster_username'),
  githubUsername: text('github_username'),
  xUsername: text('x_username'),
  telegramUsername: text('telegram_username'),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 3. Programs - Educational programs
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
  tags: text('tags').array().notNull().default([]),
  kpis: jsonb('kpis'),
  budget: decimal('budget'),
  // JAM Platform enhancements
  organizer: text('organizer'), // External program organizer
  tracks: text('tracks').array().notNull().default([]), // Available tracks
  submissionDeadline: timestamp('submission_deadline'), // Application deadline
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 4. Projects - User projects
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
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
  farcasterUsername: text('farcaster_username'),
  githubUsername: text('github_username'),
  xUsername: text('x_username'),
  telegramUsername: text('telegram_username'),
  adminId: uuid('admin_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 5. Badges - Achievement badges
export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  category: text('category'),
  points: integer('points').notNull().default(0),
  maxPoints: integer('max_points'),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'set null' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 6. Quests - Challenges and tasks
export const quests = pgTable('quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  start: timestamp('start').notNull(),
  end: timestamp('end').notNull(),
  rewardPoints: integer('reward_points').notNull().default(0),
  category: text('category'),
  difficulty: text('difficulty'), // 'easy', 'medium', 'hard'
  // JAM Platform enhancements
  availableFrom: timestamp('available_from'), // Quest availability window
  dueDate: timestamp('due_date'), // Quest deadline
  badgeId: uuid('badge_id').references(() => badges.id, { onDelete: 'set null' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 7. Posts - Community content
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  mediaUrl: text('media_url'),
  category: text('category').default('general'),
  tags: text('tags').array().notNull().default([]),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  viewCount: integer('view_count').notNull().default(0),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  programId: uuid('program_id').references(() => programs.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 8. Comments - Nested comments on posts
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  upvotes: integer('upvotes').notNull().default(0),
  downvotes: integer('downvotes').notNull().default(0),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  parentCommentId: uuid('parent_comment_id'), // Self-reference for nested comments
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 9. ProofOfCommunities - User community achievements
export const proofOfCommunities = pgTable('proof_of_communities', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  externalUrl: text('external_url'),
  image: text('image').notNull(),
  name: text('name').notNull(),
  points: integer('points').notNull().default(0),
  percentage: real('percentage').notNull().default(0),
  tier: text('tier').notNull(),
  stage: integer('stage').notNull().default(0),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 10. Rewards - Achievement rewards
export const rewards = pgTable('rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  amount: integer('amount').notNull(),
  imageUrl: text('image_url'),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  questId: uuid('quest_id').references(() => quests.id, { onDelete: 'set null' }),
  badgeId: uuid('badge_id').references(() => badges.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 11. Tiers - Badge progression levels
export const tiers = pgTable('tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  points: integer('points').notNull(),
  level: integer('level').notNull(),
  description: text('description'),
  benefits: jsonb('benefits'), // Array of tier benefits
  badgeId: uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 12. UserBadges - User's earned badges
export const userBadges = pgTable('user_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  points: integer('points').notNull().default(0),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  tierReachedId: uuid('tier_reached_id').references(() => tiers.id, { onDelete: 'set null' }),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserBadge: unique('user_badge_unique').on(table.userId, table.badgeId),
}));

// 13. Mentorships - JAM Platform mentor-participant relationships
export const mentorships = pgTable('mentorships', {
  id: uuid('id').primaryKey().defaultRandom(),
  mentorId: uuid('mentor_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  participantId: uuid('participant_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('active'), // 'active', 'paused', 'completed'
  sessionNotes: jsonb('session_notes'), // Flexible storage for session data
  mentorRating: integer('mentor_rating'), // 1-5 rating from participant
  participantRating: integer('participant_rating'), // 1-5 rating from mentor
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueMentorship: unique('unique_mentorship').on(table.mentorId, table.participantId),
}));

// ============================================
// JUNCTION TABLES (for many-to-many relations)
// ============================================

// User participation in programs
export const programUsers = pgTable('program_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id').notNull().references(() => programs.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('PARTICIPANT'), // 'PARTICIPANT', 'MENTOR', 'ORGANIZER'
  status: text('status').notNull().default('ACTIVE'), // 'ACTIVE', 'COMPLETED', 'DROPPED'
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueProgramUser: unique('program_user_unique').on(table.programId, table.userId),
}));

// User quest progress
export const userQuests = pgTable('user_quests', {
  id: uuid('id').primaryKey().defaultRandom(),
  status: userQuestStatusEnum('status').notNull().default('NOT_STARTED'),
  progress: integer('progress').notNull().default(0), // 0-100 percentage
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questId: uuid('quest_id').notNull().references(() => quests.id, { onDelete: 'cascade' }),
  // JAM Platform enhancements
  submissionText: text('submission_text'), // Written proof of work
  submissionUrls: text('submission_urls').array().notNull().default([]), // Supporting files/links
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserQuest: unique('user_quest_unique').on(table.userId, table.questId),
}));

// ============================================
// RELATIONS - Simplified structure
// ============================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { 
    fields: [users.id], 
    references: [profiles.userId] 
  }),
  proofOfCommunity: one(proofOfCommunities, { 
    fields: [users.id], 
    references: [proofOfCommunities.userId] 
  }),
  projects: many(projects),
  posts: many(posts),
  comments: many(comments),
  badges: many(userBadges),
  quests: many(userQuests),
  rewards: many(rewards),
  programs: many(programUsers),
  mentorships: many(mentorships, { relationName: 'userMentorships' }),
  mentoring: many(mentorships, { relationName: 'userMentoring' }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { 
    fields: [profiles.userId], 
    references: [users.id] 
  }),
}));

export const programsRelations = relations(programs, ({ many }) => ({
  users: many(programUsers),
  projects: many(projects),
  quests: many(quests),
  badges: many(badges),
  posts: many(posts),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  admin: one(users, { 
    fields: [projects.adminId], 
    references: [users.id] 
  }),
  program: one(programs, { 
    fields: [projects.programId], 
    references: [programs.id] 
  }),
  quests: many(quests),
  badges: many(badges),
  posts: many(posts),
}));

export const badgesRelations = relations(badges, ({ one, many }) => ({
  program: one(programs, { 
    fields: [badges.programId], 
    references: [programs.id] 
  }),
  project: one(projects, { 
    fields: [badges.projectId], 
    references: [projects.id] 
  }),
  tiers: many(tiers),
  users: many(userBadges),
  rewards: many(rewards),
  quests: many(quests),
}));

export const questsRelations = relations(quests, ({ one, many }) => ({
  badge: one(badges, { 
    fields: [quests.badgeId], 
    references: [badges.id] 
  }),
  project: one(projects, { 
    fields: [quests.projectId], 
    references: [projects.id] 
  }),
  program: one(programs, { 
    fields: [quests.programId], 
    references: [programs.id] 
  }),
  users: many(userQuests),
  rewards: many(rewards),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { 
    fields: [posts.authorId], 
    references: [users.id] 
  }),
  project: one(projects, { 
    fields: [posts.projectId], 
    references: [projects.id] 
  }),
  program: one(programs, { 
    fields: [posts.programId], 
    references: [programs.id] 
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  author: one(users, { 
    fields: [comments.authorId], 
    references: [users.id] 
  }),
  post: one(posts, { 
    fields: [comments.postId], 
    references: [posts.id] 
  }),
  parentComment: one(comments, { 
    fields: [comments.parentCommentId], 
    references: [comments.id], 
    relationName: 'childComments' 
  }),
  childComments: many(comments, { relationName: 'childComments' }),
}));

export const rewardsRelations = relations(rewards, ({ one }) => ({
  user: one(users, { 
    fields: [rewards.userId], 
    references: [users.id] 
  }),
  quest: one(quests, { 
    fields: [rewards.questId], 
    references: [quests.id] 
  }),
  badge: one(badges, { 
    fields: [rewards.badgeId], 
    references: [badges.id] 
  }),
}));

export const tiersRelations = relations(tiers, ({ one, many }) => ({
  badge: one(badges, { 
    fields: [tiers.badgeId], 
    references: [badges.id] 
  }),
  users: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { 
    fields: [userBadges.userId], 
    references: [users.id] 
  }),
  badge: one(badges, { 
    fields: [userBadges.badgeId], 
    references: [badges.id] 
  }),
  tier: one(tiers, { 
    fields: [userBadges.tierReachedId], 
    references: [tiers.id] 
  }),
}));

export const programUsersRelations = relations(programUsers, ({ one }) => ({
  program: one(programs, { 
    fields: [programUsers.programId], 
    references: [programs.id] 
  }),
  user: one(users, { 
    fields: [programUsers.userId], 
    references: [users.id] 
  }),
}));

export const userQuestsRelations = relations(userQuests, ({ one }) => ({
  user: one(users, { 
    fields: [userQuests.userId], 
    references: [users.id] 
  }),
  quest: one(quests, { 
    fields: [userQuests.questId], 
    references: [quests.id] 
  }),
}));

export const proofOfCommunitiesRelations = relations(proofOfCommunities, ({ one }) => ({
  user: one(users, { 
    fields: [proofOfCommunities.userId], 
    references: [users.id] 
  }),
}));

export const mentorshipsRelations = relations(mentorships, ({ one }) => ({
  mentor: one(users, { 
    fields: [mentorships.mentorId], 
    references: [users.id],
    relationName: 'userMentoring'
  }),
  participant: one(users, { 
    fields: [mentorships.participantId], 
    references: [users.id],
    relationName: 'userMentorships'
  }),
}));