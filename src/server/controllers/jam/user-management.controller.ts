/**
 * User Management Controller
 * Business logic for admin user management operations
 */

import { db } from '@/db'
import { users, profiles } from '@/db/schema'
import { eq, ilike, or, and, sql } from 'drizzle-orm'

export interface UserWithProfile {
  id: string
  username: string
  displayName: string
  email: string | null
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  profile?: {
    firstName: string | null
    lastName: string | null
    cityRegion: string | null
    country: string | null
    primaryRole: string | null
  } | null
}

/**
 * Get all users with optional search and filters
 */
export async function getAllUsers(options?: {
  search?: string
  isAdmin?: boolean
  limit?: number
  offset?: number
}): Promise<{ users: UserWithProfile[]; total: number }> {
  try {
    const { search, isAdmin, limit = 50, offset = 0 } = options || {}

    // Build where conditions
    const conditions = []

    if (typeof isAdmin === 'boolean') {
      conditions.push(eq(users.isAdmin, isAdmin))
    }

    if (search) {
      conditions.push(
        or(
          ilike(users.username, `%${search}%`),
          ilike(users.displayName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      )
    }

    // Get users with profiles
    const usersQuery = db
      .select({
        user: users,
        profile: profiles,
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${users.createdAt} DESC`)

    if (conditions.length > 0) {
      usersQuery.where(and(...conditions))
    }

    const results = await usersQuery

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)

    const usersList: UserWithProfile[] = results.map((result) => ({
      id: result.user.id,
      username: result.user.username,
      displayName: result.user.displayName,
      email: result.user.email,
      isAdmin: result.user.isAdmin,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt,
      profile: result.profile ? {
        firstName: result.profile.firstName,
        lastName: result.profile.lastName,
        cityRegion: result.profile.cityRegion,
        country: result.profile.country,
        primaryRole: result.profile.primaryRole,
      } : null,
    }))

    return {
      users: usersList,
      total: Number(countResult.count),
    }
  } catch (error) {
    console.error('Get all users error:', error)
    throw new Error('Failed to get users')
  }
}

/**
 * Toggle admin status for a user
 */
export async function toggleAdminStatus(userId: string, adminId: string): Promise<boolean> {
  try {
    // Check if requester is admin
    const [admin] = await db
      .select()
      .from(users)
      .where(eq(users.id, adminId))
      .limit(1)

    if (!admin?.isAdmin) {
      throw new Error('Unauthorized: Admin permissions required')
    }

    // Don't allow users to remove their own admin status
    if (userId === adminId) {
      throw new Error('Cannot modify your own admin status')
    }

    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    // Toggle admin status
    const [updated] = await db
      .update(users)
      .set({
        isAdmin: !user.isAdmin,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    return updated.isAdmin
  } catch (error) {
    console.error('Toggle admin status error:', error)
    throw error instanceof Error ? error : new Error('Failed to toggle admin status')
  }
}

/**
 * Get user details with full profile
 */
export async function getUserDetails(userId: string): Promise<UserWithProfile | null> {
  try {
    const [result] = await db
      .select({
        user: users,
        profile: profiles,
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.id, userId))
      .limit(1)

    if (!result) {
      return null
    }

    return {
      id: result.user.id,
      username: result.user.username,
      displayName: result.user.displayName,
      email: result.user.email,
      isAdmin: result.user.isAdmin,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt,
      profile: result.profile ? {
        firstName: result.profile.firstName,
        lastName: result.profile.lastName,
        cityRegion: result.profile.cityRegion,
        country: result.profile.country,
        primaryRole: result.profile.primaryRole,
      } : null,
    }
  } catch (error) {
    console.error('Get user details error:', error)
    throw new Error('Failed to get user details')
  }
}
