import { db, client } from '../src/db'
import { users, mentorProfiles } from '../src/db/schema'
import { eq } from 'drizzle-orm'

async function checkMentors() {
  console.log('🔍 Checking mentors in database...\n')

  try {
    // Count total mentors
    const mentorsList = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        availability: mentorProfiles.availability,
        expertiseAreas: mentorProfiles.expertiseAreas,
      })
      .from(mentorProfiles)
      .innerJoin(users, eq(mentorProfiles.userId, users.id))

    console.log(`📊 Total mentors found: ${mentorsList.length}\n`)

    if (mentorsList.length === 0) {
      console.log('❌ No mentors found in database!')
      console.log('   Run: bun run seed:mentors\n')
    } else {
      console.log('Mentors in database:')
      mentorsList.forEach((mentor, i) => {
        console.log(
          `${i + 1}. ${mentor.displayName} (@${mentor.username}) - ${mentor.availability}`
        )
        console.log(`   Expertise: ${mentor.expertiseAreas.slice(0, 3).join(', ')}`)
      })
    }

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    await client.end()
    process.exit(1)
  }
}

checkMentors()
