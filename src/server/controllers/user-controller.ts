import { db } from '@/db'
import { users, profiles } from '@/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import {
  CreateUserInput,
  createUserSchema,
  ProfileFormValues,
} from '@/server/schema/user-services-schema'
import { AppError } from '@/server/utils'
import { UserExtended } from '@/types/api-v1'
import { eq, or } from 'drizzle-orm'
import { z } from 'zod'

// Infer User type from Drizzle schema
type User = InferSelectModel<typeof users>

export class UserControllerDrizzle {
  static async findAll(): Promise<UserExtended[]> {
    try {
      const usersData = await db.query.users.findMany({
        with: {
          profile: true,
          proofOfCommunity: {
            with: {
              user: true,
            },
          },
          programs: true,
          projects: true,
          quests: true,
          badges: {
            with: {
              badge: {
                with: {
                  quests: true,
                  tiers: true,
                },
              },
              tier: true,
            },
          },
        },
      })
      return usersData as UserExtended[]
    } catch (error) {
      console.error('Error finding users:', error)
      throw new AppError('Failed to fetch users', 500)
    }
  }

  static async findById(id: string): Promise<UserExtended | null> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          profile: true,
          proofOfCommunity: {
            with: {
              user: true,
            },
          },
          programs: true,
          projects: true,
          quests: true,
          badges: {
            with: {
              badge: {
                with: {
                  quests: true,
                  tiers: true,
                },
              },
              tier: true,
            },
          },
        },
      })

      return user as UserExtended
    } catch (error) {
      console.error('Error finding user:', error)
      throw new AppError('Failed to fetch user', 500)
    }
  }

  static async findByAddress(address: string): Promise<User | null> {
    try {
      const user = await db.query.users.findFirst({
        where: or(eq(users.username, address), eq(users.email, address)),
      })

      return user ?? null
    } catch (error) {
      console.error('Error finding user:', error)
      throw new AppError('Failed to fetch user', 500)
    }
  }

  static async findOrCreate(input: CreateUserInput): Promise<UserExtended> {
    try {
      // Log input for debugging
      console.log('findOrCreate input:', JSON.stringify(input, null, 2))

      // Validate input
      const validatedData = createUserSchema.parse(input)
      console.log('Validated data:', JSON.stringify(validatedData, null, 2))

      // Try to find existing user
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, input.id),
        with: {
          profile: true,
          proofOfCommunity: {
            with: {
              user: true,
            },
          },
          programs: true,
          projects: true,
          quests: true,
          badges: {
            with: {
              badge: {
                with: {
                  quests: true,
                  tiers: true,
                },
              },
              tier: true,
            },
          },
        },
      })

      if (existingUser) return existingUser as UserExtended

      // Create new user if not found
      const [newUser] = await db
        .insert(users)
        .values({
          id: validatedData.id,
          username: validatedData.username || validatedData.appWallet || validatedData.email || validatedData.id,
          displayName: validatedData.displayName || validatedData.appWallet || validatedData.email || validatedData.id,
          email: validatedData.email || null,
        })
        .returning()

      // Fetch the newly created user with all relations
      const userWithRelations = await db.query.users.findFirst({
        where: eq(users.id, newUser.id),
        with: {
          profile: true,
          proofOfCommunity: {
            with: {
              user: true,
            },
          },
          programs: true,
          projects: true,
          quests: true,
          badges: {
            with: {
              badge: {
                with: {
                  quests: true,
                  tiers: true,
                },
              },
              tier: true,
            },
          },
        },
      })

      return userWithRelations as UserExtended
    } catch (error) {
      console.error('Error in findOrCreate:', error)

      if (error instanceof z.ZodError) {
        throw new AppError('Invalid input data', 400, {
          code: 'VALIDATION_ERROR',
          details: error.issues,
        })
      }

      throw new AppError('Failed to create user', 500)
    }
  }

  static async updateUser(
    id: string,
    data: Partial<CreateUserInput>,
  ): Promise<User> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning()

      if (!updatedUser) {
        throw new AppError('User not found', 404)
      }

      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to update user', 500)
    }
  }

  static async updateUserProfile(
    id: string,
    data: Partial<ProfileFormValues>,
  ): Promise<UserExtended> {
    try {
      // Check if profile exists
      const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, id),
      })

      if (existingProfile) {
        // Update existing profile
        await db
          .update(profiles)
          .set({
            firstName: data.firstName ?? null,
            lastName: data.lastName ?? null,
            cityRegion: data.cityRegion ?? null,
            country: data.country ?? null,
            primaryRole: data.primaryRole ?? null,
            professionalProfile: data.professionalProfile ?? null,
            isStudent: data.isStudent ?? false,
            farcasterUsername: data.farcasterUsername ?? null,
            updatedAt: new Date(),
          })
          .where(eq(profiles.userId, id))
      } else {
        // Create new profile
        await db.insert(profiles).values({
          userId: id,
          firstName: data.firstName ?? null,
          lastName: data.lastName ?? null,
          cityRegion: data.cityRegion ?? null,
          country: data.country ?? null,
          primaryRole: data.primaryRole ?? null,
          professionalProfile: data.professionalProfile ?? null,
          isStudent: data.isStudent ?? false,
          farcasterUsername: data.farcasterUsername ?? null,
        })
      }

      // Fetch updated user with profile
      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          profile: true,
        },
      })

      if (!updatedUser) {
        throw new AppError('User not found', 404)
      }

      return updatedUser as UserExtended
    } catch (error) {
      console.error('Error updating user profile:', error)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to update user profile', 500)
    }
  }

  static async updateUserFarcasterAccount(
    id: string,
    farcasterId: number,
    farcasterDisplayName: string,
    farcasterUsername: string,
    farcasterAvatarUrl: string,
  ): Promise<UserExtended> {
    try {
      // Update user
      await db
        .update(users)
        .set({
          avatarUrl: farcasterAvatarUrl,
          displayName: farcasterDisplayName,
          username: farcasterUsername.replace(/^@/, ''),
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))

      // Check if profile exists
      const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, id),
      })

      if (existingProfile) {
        // Update existing profile
        await db
          .update(profiles)
          .set({
            farcasterUsername: farcasterUsername,
            updatedAt: new Date(),
          })
          .where(eq(profiles.userId, id))
      } else {
        // Create new profile
        await db.insert(profiles).values({
          userId: id,
          farcasterUsername: farcasterUsername,
        })
      }

      // Fetch updated user with profile
      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          profile: true,
        },
      })

      if (!updatedUser) {
        throw new AppError('User not found', 404)
      }

      return updatedUser as UserExtended
    } catch (error) {
      console.error('Error updating user farcaster account:', error)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to update user farcaster account', 500)
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await db.delete(users).where(eq(users.id, id)).returning()

      if (result.length === 0) {
        throw new AppError('User not found', 404)
      }

      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      if (error instanceof AppError) throw error
      throw new AppError('Failed to delete user', 500)
    }
  }
}
