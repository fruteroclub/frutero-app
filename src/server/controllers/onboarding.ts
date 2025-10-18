import { db } from '@/db'
import { users, profiles, projects, projectMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateUniqueSlug } from './projects'

export interface ProfileData {
  firstName?: string
  lastName?: string
  cityRegion?: string
  country?: string
  primaryRole?: string
  isStudent?: boolean
  githubUsername?: string
  discordUsername?: string
  xUsername?: string
  telegramUsername?: string
}

export interface ProjectData {
  name?: string
  description?: string
}

export interface OnboardingData {
  profile: ProfileData
  projectChoice: 'create' | 'join' | 'skip'
  projectData?: ProjectData
  projectId?: string
  track?: 'founder' | 'professional' | 'freelancer'
  goals?: string
}

export async function completeOnboarding(
  userId: string,
  data: OnboardingData
) {
  try {
    // 1. Create or update profile (UPSERT to handle existing profiles)
    await db
      .insert(profiles)
      .values({
        userId,
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        cityRegion: data.profile.cityRegion,
        country: data.profile.country,
        primaryRole: data.profile.primaryRole,
        isStudent: data.profile.isStudent || false,
        githubUsername: data.profile.githubUsername,
        discordUsername: data.profile.discordUsername,
        xUsername: data.profile.xUsername,
        telegramUsername: data.profile.telegramUsername,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          cityRegion: data.profile.cityRegion,
          country: data.profile.country,
          primaryRole: data.profile.primaryRole,
          isStudent: data.profile.isStudent || false,
          githubUsername: data.profile.githubUsername,
          discordUsername: data.profile.discordUsername,
          xUsername: data.profile.xUsername,
          telegramUsername: data.profile.telegramUsername,
          updatedAt: new Date(),
        },
      })

    // 2. Handle project creation or joining
    let projectId = data.projectId

    if (data.projectChoice === 'create' && data.projectData?.name && data.projectData?.description) {
      // Create new project with unique slug
      const slug = await generateUniqueSlug(data.projectData.name)

      const [newProject] = await db
        .insert(projects)
        .values({
          name: data.projectData.name,
          slug,
          description: data.projectData.description,
          adminId: userId,
          stage: 'IDEA',
        })
        .returning()

      projectId = newProject.id

      // Add creator as ADMIN member
      await db.insert(projectMembers).values({
        projectId: newProject.id,
        userId,
        role: 'ADMIN',
      })
    } else if (data.projectChoice === 'join' && projectId) {
      // Add user as MEMBER to existing project
      await db.insert(projectMembers).values({
        projectId,
        userId,
        role: 'MEMBER',
      })
    }

    // 3. Update user with onboarding complete flag
    await db
      .update(users)
      .set({
        updatedAt: new Date(),
        // Note: Add onboardingComplete field to schema if not exists
      })
      .where(eq(users.id, userId))

    return {
      success: true,
      projectId,
    }
  } catch (error) {
    console.error('Onboarding error:', error)
    throw error
  }
}

export async function findProjectByCode(code: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, code))
    .limit(1)

  return project || null
}
