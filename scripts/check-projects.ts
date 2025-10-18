import { db } from '../src/db'
import { projects } from '../src/db/schema'

async function checkProjects() {
  const allProjects = await db.select().from(projects)

  console.log('📦 Projects in database:\n')
  allProjects.forEach(project => {
    console.log(`- Name: ${project.name}`)
    console.log(`  Slug: ${project.slug}`)
    console.log(`  ID: ${project.id}`)
    console.log(`  Stage: ${project.stage}`)
    console.log(`  Category: ${project.category}`)
    console.log(`  Admin: ${project.adminId}`)
    console.log('')
  })
}

checkProjects().catch(console.error).finally(() => process.exit(0))
