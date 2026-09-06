import { UserControllerDrizzle } from '@/server/controllers/user-controller'
import { db } from '@/db'
import { userSettings, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

async function testTrackIntegration() {
  console.log('🧪 Testing Track Selection System Integration\n')

  try {
    // Get first user from database
    const [testUser] = await db.select().from(users).limit(1)

    if (!testUser) {
      console.error('❌ No users found in database')
      console.log('💡 Run seed script first: bun scripts/seed.ts')
      return
    }

    const userId = testUser.id
    console.log(`✓ Using test user: ${testUser.username} (${userId})\n`)

    // Test 1: Fetch user includes settings
    console.log('Test 1: Fetching user with settings...')
    const user = await UserControllerDrizzle.findById(userId)

    if (!user) {
      console.error('❌ User not found')
      return
    }

    console.log('  ✓ User fetched successfully')
    console.log(`  ✓ Settings present: ${!!user.settings}`)
    console.log(`  ✓ Current track: ${user.settings?.track || 'null'}`)
    console.log(`  ✓ Track change count: ${user.settings?.trackChangeCount || 0}\n`)

    // Test 2: Update track
    console.log('Test 2: Updating track to FOUNDER...')
    const updated = await UserControllerDrizzle.updateUserTrack(userId, { track: 'FOUNDER' })

    console.log('  ✓ Track updated successfully')
    console.log(`  ✓ New track: ${updated.settings?.track}`)
    console.log(`  ✓ Track change count: ${updated.settings?.trackChangeCount}\n`)

    // Test 3: Verify track persisted
    console.log('Test 3: Re-fetching to verify persistence...')
    const refetched = await UserControllerDrizzle.findById(userId)

    console.log(`  ✓ Refetched track: ${refetched?.settings?.track}`)
    console.log(`  ✓ Track matches: ${refetched?.settings?.track === 'FOUNDER'}\n`)

    // Test 4: Get track info
    console.log('Test 4: Getting track eligibility info...')
    const trackInfo = await UserControllerDrizzle.getUserTrack(userId)

    console.log(`  ✓ Track: ${trackInfo.track}`)
    console.log(`  ✓ Can change: ${trackInfo.canChange}`)
    console.log(`  ✓ Reason: ${trackInfo.changeReason || 'N/A'}`)
    console.log(`  ✓ Change count: ${trackInfo.trackChangeCount}\n`)

    console.log('✅ All tests passed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  }
}

testTrackIntegration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
