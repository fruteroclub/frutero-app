import { db, client } from '../src/db'
import { users } from '../src/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Script to make a user an admin
 * Usage: bun scripts/create-admin.ts <username>
 */

async function makeAdmin(username: string) {
  try {
    console.log(`Looking for user: ${username}`)

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!user) {
      console.error(`❌ User '${username}' not found`)
      console.log('\nAvailable users:')
      const allUsers = await db.select({ username: users.username, isAdmin: users.isAdmin }).from(users)
      allUsers.forEach(u => {
        console.log(`  - ${u.username} ${u.isAdmin ? '(already admin)' : ''}`)
      })
      process.exit(1)
    }

    if (user.isAdmin) {
      console.log(`✅ User '${username}' is already an admin`)
      await client.end()
      process.exit(0)
    }

    // Make user admin
    await db
      .update(users)
      .set({ isAdmin: true, updatedAt: new Date() })
      .where(eq(users.id, user.id))

    console.log(`✅ User '${username}' is now an admin!`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Display Name: ${user.displayName}`)
    console.log(`   Email: ${user.email}`)

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    await client.end()
    process.exit(1)
  }
}

const username = process.argv[2]

if (!username) {
  console.error('Usage: bun scripts/create-admin.ts <username>')
  process.exit(1)
}

makeAdmin(username)
