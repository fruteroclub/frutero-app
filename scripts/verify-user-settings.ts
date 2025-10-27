import { db } from '@/db'
import { users, userSettings } from '@/db/schema'
import { sql, eq } from 'drizzle-orm'

async function verifyUserSettings() {
  console.log('🔍 Verifying UserSettings Data\n')

  // Count total users
  const [{ count: totalUsers }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)

  // Count users with settings
  const [{ count: usersWithSettings }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userSettings)

  console.log(`Total users: ${totalUsers}`)
  console.log(`Users with settings: ${usersWithSettings}`)

  if (Number(totalUsers) !== Number(usersWithSettings)) {
    console.log('\n⚠️  Some users missing settings records!')
    console.log('Creating missing userSettings...\n')

    // Get users without settings
    const usersWithoutSettings = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .leftJoin(userSettings, eq(users.id, userSettings.userId))
      .where(sql`${userSettings.id} IS NULL`)

    for (const user of usersWithoutSettings) {
      await db.insert(userSettings).values({
        userId: user.id,
        track: null,
        trackChangeCount: 0,
        interests: [],
      })
      console.log(`  ✓ Created settings for: ${user.username}`)
    }

    console.log('\n✅ All users now have settings')
  } else {
    console.log('\n✅ All users have settings records')
  }

  // Show track distribution
  const trackDist = await db
    .select({
      track: userSettings.track,
      count: sql<number>`count(*)`,
    })
    .from(userSettings)
    .groupBy(userSettings.track)

  console.log('\n📊 Track Distribution:')
  for (const row of trackDist) {
    console.log(`  ${row.track || 'null'}: ${row.count}`)
  }
}

verifyUserSettings()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err)
    process.exit(1)
  })
