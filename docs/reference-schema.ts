// import {
//   pgTable,
//   pgEnum,
//   uuid,
//   text,
//   boolean,
//   integer,
//   real,
//   timestamp,
//   jsonb,
//   decimal,
//   unique,
// } from 'drizzle-orm/pg-core'
// import { relations } from 'drizzle-orm'

// // ============================================
// // ENUMS - MVP Essential
// // ============================================

// export const projectStageEnum = pgEnum('project_stage', [
//   'IDEA',
//   'PROTOTYPE',
//   'BUILD',
//   'PROJECT',
// ])

// export const userQuestStatusEnum = pgEnum('user_quest_status', [
//   'NOT_STARTED',
//   'IN_PROGRESS',
//   'COMPLETED',
// ])

// export const programStatusEnum = pgEnum('program_status', [
//   'UPCOMING',
//   'ACTIVE',
//   'COMPLETED',
// ])

// // ============================================
// // CORE TABLES - MVP Focused
// // ============================================

// // 1. Users - Simplified with Para integration focus
// export const users = pgTable('users', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   username: text('username').notNull().unique(),
//   displayName: text('display_name').notNull(),
//   email: text('email').unique(),
//   bio: text('bio'),
//   avatarUrl: text('avatar_url'),
//   isAdmin: boolean('is_admin').notNull().default(false),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// })

// // 2. Profiles - Professional information
// export const profiles = pgTable('profiles', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   firstName: text('first_name'),
//   lastName: text('last_name'),
//   cityRegion: text('city_region'),
//   country: text('country'),
//   primaryRole: text('primary_role'),
//   isStudent: boolean('is_student').notNull().default(false),
//   // Social media links
//   discordUsername: text('discord_username'),
//   farcasterUsername: text('farcaster_username'),
//   githubUsername: text('github_username'),
//   xUsername: text('x_username'),
//   telegramUsername: text('telegram_username'),
//   userId: uuid('user_id')
//     .notNull()
//     .unique()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// })

// // 3. Projects - Single project per user (from onboarding idea)
// export const projects = pgTable('projects', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   name: text('name').notNull(),
//   description: text('description').notNull(),
//   category: text('category'),
//   stage: projectStageEnum('stage').notNull().default('IDEA'),
//   // Enhanced project links (added post-onboarding)
//   repositoryUrl: text('repository_url'),
//   videoUrl: text('video_url'),
//   productionUrl: text('production_url'),
//   pitchDeckUrl: text('pitch_deck_url'),
//   website: text('website'),
//   // Project social presence
//   githubUsername: text('github_username'),
//   xUsername: text('x_username'),
//   // Owner relationship
//   userId: uuid('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// })

// // 4. Programs - External program tracking (read-only for users)
// export const programs = pgTable('programs', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   name: text('name').notNull().unique(),
//   description: text('description'),
//   organizer: text('organizer').notNull(),
//   website: text('website'),
//   applicationUrl: text('application_url'),
//   // Timing
//   startDate: timestamp('start_date').notNull(),
//   endDate: timestamp('end_date').notNull(),
//   submissionDeadline: timestamp('submission_deadline'),
//   // Categorization
//   category: text('category'), // "hackathon", "course", "bootcamp"
//   tracks: text('tracks').array().notNull().default([]),
//   totalPrizes: integer('total_prizes'),
//   theme: text('theme'),
//   // Status and visibility
//   status: programStatusEnum('status').notNull().default('UPCOMING'),
//   isActive: boolean('is_active').notNull().default(true),
//   avatarUrl: text('avatar_url'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// })

// // 5. Quests - Weekly deliverables and challenges
// export const quests = pgTable('quests', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   title: text('title').notNull(),
//   description: text('description').notNull(),
//   category: text('category'), // "technical", "presentation", "research"
//   difficulty: text('difficulty'), // "beginner", "intermediate", "advanced"
//   rewardPoints: integer('reward_points').notNull().default(0),
//   // Timing
//   availableFrom: timestamp('available_from').notNull(),
//   dueDate: timestamp('due_date').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// })

// // 6. Posts - Build in Public content
// export const posts = pgTable('posts', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   title: text('title').notNull(),
//   content: text('content').notNull(),
//   mediaUrl: text('media_url'),
//   tags: text('tags').array().notNull().default([]),
//   // Engagement metrics
//   viewCount: integer('view_count').notNull().default(0),
//   // Relationships
//   authorId: uuid('author_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   projectId: uuid('project_id').references(() => projects.id, {
//     onDelete: 'set null',
//   }),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// })

// // 7. Badges - Skill validation achievements
// export const badges = pgTable('badges', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   name: text('name').notNull(),
//   description: text('description'),
//   category: text('category'), // "technical", "soft_skills", "milestone"
//   imageUrl: text('image_url'),
//   pointValue: integer('point_value').notNull().default(0),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// })

// // ============================================
// // JUNCTION TABLES - Relationships
// // ============================================

// // User participation in external programs (tracking only)
// export const programUsers = pgTable(
//   'program_users',
//   {
//     id: uuid('id').primaryKey().defaultRandom(),
//     programId: uuid('program_id')
//       .notNull()
//       .references(() => programs.id, { onDelete: 'cascade' }),
//     userId: uuid('user_id')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     // Track selection from onboarding
//     track: text('track').notNull(), // "founder", "professional", "freelancer"
//     // Participation status
//     status: text('status').notNull().default('active'), // "active", "completed", "withdrawn"
//     joinedAt: timestamp('joined_at').notNull().defaultNow(),
//     completedAt: timestamp('completed_at'),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   },
//   (table) => ({
//     uniqueProgramUser: unique('program_user_unique').on(
//       table.programId,
//       table.userId,
//     ),
//   }),
// )

// // User quest progress tracking
// export const userQuests = pgTable(
//   'user_quests',
//   {
//     id: uuid('id').primaryKey().defaultRandom(),
//     userId: uuid('user_id')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     questId: uuid('quest_id')
//       .notNull()
//       .references(() => quests.id, { onDelete: 'cascade' }),
//     status: userQuestStatusEnum('status').notNull().default('NOT_STARTED'),
//     progress: integer('progress').notNull().default(0), // 0-100 percentage
//     // Proof of work submission
//     submissionText: text('submission_text'),
//     submissionUrls: text('submission_urls').array().notNull().default([]),
//     // Timestamps
//     startedAt: timestamp('started_at'),
//     completedAt: timestamp('completed_at'),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   },
//   (table) => ({
//     uniqueUserQuest: unique('user_quest_unique').on(
//       table.userId,
//       table.questId,
//     ),
//   }),
// )

// // User earned badges
// export const userBadges = pgTable(
//   'user_badges',
//   {
//     id: uuid('id').primaryKey().defaultRandom(),
//     userId: uuid('user_id')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     badgeId: uuid('badge_id')
//       .notNull()
//       .references(() => badges.id, { onDelete: 'cascade' }),
//     // Earning context
//     earnedFrom: text('earned_from'), // "quest_completion", "mentor_validation", "milestone"
//     earnedAt: timestamp('earned_at').notNull().defaultNow(),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   },
//   (table) => ({
//     uniqueUserBadge: unique('user_badge_unique').on(
//       table.userId,
//       table.badgeId,
//     ),
//   }),
// )

// // Simple mentorship relationships
// export const mentorships = pgTable(
//   'mentorships',
//   {
//     id: uuid('id').primaryKey().defaultRandom(),
//     mentorId: uuid('mentor_id')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     participantId: uuid('participant_id')
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' }),
//     // Simple status tracking
//     status: text('status').notNull().default('active'), // "active", "completed", "paused"
//     // Optional session notes
//     sessionNotes: jsonb('session_notes'), // Array of session summaries
//     // Mutual ratings (1-5 scale)
//     mentorRating: integer('mentor_rating'), // Participant rates mentor
//     participantRating: integer('participant_rating'), // Mentor rates participant
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   },
//   (table) => ({
//     uniqueMentorship: unique('mentorship_unique').on(
//       table.mentorId,
//       table.participantId,
//     ),
//   }),
// )

// // Simple reward tracking for PULPA tokens
// export const rewards = pgTable('rewards', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   userId: uuid('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   amount: integer('amount').notNull(), // PULPA token amount
//   reason: text('reason').notNull(), // "quest_completion", "badge_earned", "mentor_bonus"
//   // Source references (optional)
//   questId: uuid('quest_id').references(() => quests.id, {
//     onDelete: 'set null',
//   }),
//   badgeId: uuid('badge_id').references(() => badges.id, {
//     onDelete: 'set null',
//   }),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// })

// // ============================================
// // RELATIONS - Simplified
// // ============================================

// export const usersRelations = relations(users, ({ one, many }) => ({
//   profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
//   project: one(projects, { fields: [users.id], references: [projects.userId] }),
//   posts: many(posts),
//   programs: many(programUsers),
//   quests: many(userQuests),
//   badges: many(userBadges),
//   rewards: many(rewards),
//   mentorshipsAsMentor: many(mentorships, { relationName: 'mentor' }),
//   mentorshipsAsParticipant: many(mentorships, { relationName: 'participant' }),
// }))

// export const projectsRelations = relations(projects, ({ one, many }) => ({
//   user: one(users, { fields: [projects.userId], references: [users.id] }),
//   posts: many(posts),
// }))

// export const programsRelations = relations(programs, ({ many }) => ({
//   participants: many(programUsers),
// }))

// export const mentorshipsRelations = relations(mentorships, ({ one }) => ({
//   mentor: one(users, {
//     fields: [mentorships.mentorId],
//     references: [users.id],
//     relationName: 'mentor',
//   }),
//   participant: one(users, {
//     fields: [mentorships.participantId],
//     references: [users.id],
//     relationName: 'participant',
//   }),
// }))

// // Additional relations for completeness...
// export const profilesRelations = relations(profiles, ({ one }) => ({
//   user: one(users, { fields: [profiles.userId], references: [users.id] }),
// }))

// export const postsRelations = relations(posts, ({ one }) => ({
//   author: one(users, { fields: [posts.authorId], references: [users.id] }),
//   project: one(projects, {
//     fields: [posts.projectId],
//     references: [projects.id],
//   }),
// }))

// export const userQuestsRelations = relations(userQuests, ({ one }) => ({
//   user: one(users, { fields: [userQuests.userId], references: [users.id] }),
//   quest: one(quests, { fields: [userQuests.questId], references: [quests.id] }),
// }))

// export const userBadgesRelations = relations(userBadges, ({ one }) => ({
//   user: one(users, { fields: [userBadges.userId], references: [users.id] }),
//   badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
// }))

// export const programUsersRelations = relations(programUsers, ({ one }) => ({
//   program: one(programs, {
//     fields: [programUsers.programId],
//     references: [programs.id],
//   }),
//   user: one(users, { fields: [programUsers.userId], references: [users.id] }),
// }))

// export const rewardsRelations = relations(rewards, ({ one }) => ({
//   user: one(users, { fields: [rewards.userId], references: [users.id] }),
//   quest: one(quests, { fields: [rewards.questId], references: [quests.id] }),
//   badge: one(badges, { fields: [rewards.badgeId], references: [badges.id] }),
// }))
