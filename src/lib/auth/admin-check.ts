/**
 * Admin Permission Checking Utilities
 * Helpers for verifying admin permissions in API routes and components
 */

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Check if a user ID has admin permissions
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const [user] = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    return user?.isAdmin === true
  } catch (error) {
    console.error('Check admin error:', error)
    return false
  }
}

/**
 * Verify admin permissions or throw error
 */
export async function requireAdmin(userId: string | undefined): Promise<void> {
  if (!userId) {
    throw new Error('Authentication required')
  }

  const isAdmin = await checkIsAdmin(userId)

  if (!isAdmin) {
    throw new Error('Admin permissions required')
  }
}

/**
 * Get user with admin status
 */
export async function getUserWithAdminStatus(userId: string) {
  try {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    return user || null
  } catch (error) {
    console.error('Get user with admin status error:', error)
    return null
  }
}
