import { z } from 'zod'

/**
 * Schema for updating user track
 */
export const updateTrackSchema = z.object({
  track: z.enum(['LEARNING', 'FOUNDER', 'PROFESSIONAL', 'FREELANCER']),
})

export type UpdateTrackInput = z.infer<typeof updateTrackSchema>
