import { z } from 'zod'

/**
 * Mentor Availability Enum
 */
export const mentorAvailabilityEnum = z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE'])

/**
 * Create Mentor Profile Schema
 * Used by admins to create new mentor profiles
 */
export const createMentorProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  availability: mentorAvailabilityEnum.default('UNAVAILABLE'),
  maxParticipants: z.number().int().min(1).max(50).default(5),
  expertiseAreas: z.array(z.string()).min(1, 'At least one expertise area is required'),
  mentoringApproach: z.string().optional(),
  experience: z.string().optional(),
})

export type CreateMentorProfileInput = z.infer<typeof createMentorProfileSchema>

/**
 * Update Mentor Profile Schema
 * Used by admins to update existing mentor profiles
 */
export const updateMentorProfileSchema = z.object({
  availability: mentorAvailabilityEnum.optional(),
  maxParticipants: z.number().int().min(1).max(50).optional(),
  expertiseAreas: z.array(z.string()).min(1).optional(),
  mentoringApproach: z.string().optional(),
  experience: z.string().optional(),
})

export type UpdateMentorProfileInput = z.infer<typeof updateMentorProfileSchema>

/**
 * Mentor Settings Update Schema
 * Used by mentors to update their own settings
 */
export const mentorSettingsSchema = z.object({
  availability: mentorAvailabilityEnum,
  maxParticipants: z.number().int().min(1).max(50),
  expertiseAreas: z.array(z.string()).min(1, 'At least one expertise area is required'),
  mentoringApproach: z.string().optional(),
  experience: z.string().optional(),
})

export type MentorSettingsInput = z.infer<typeof mentorSettingsSchema>

/**
 * Common expertise areas for mentors
 */
export const EXPERTISE_AREAS = [
  'blockchain',
  'defi',
  'frontend',
  'backend',
  'fullstack',
  'mobile',
  'design',
  'product',
  'marketing',
  'startup',
  'web3',
  'smart-contracts',
  'security',
  'devops',
  'ai-ml',
  'data',
  'community',
  'growth',
  'fundraising',
  'legal',
] as const

export type ExpertiseArea = (typeof EXPERTISE_AREAS)[number]
