import { db } from '@/db'
import { programs, programProjects, projects, users } from '@/db/schema'
import { eq, and, notInArray, sql } from 'drizzle-orm'

/**
 * Get all programs
 */
export async function getAllPrograms() {
  const allPrograms = await db.select().from(programs)
  return allPrograms
}

/**
 * Get program by ID with participant count
 */
export async function getProgramById(programId: string) {
  const [program] = await db
    .select({
      program: programs,
      participantCount: sql<number>`CAST(COUNT(DISTINCT ${programProjects.projectId}) AS INTEGER)`,
    })
    .from(programs)
    .leftJoin(programProjects, eq(programs.id, programProjects.programId))
    .where(eq(programs.id, programId))
    .groupBy(programs.id)
    .limit(1)

  if (!program) return null

  return {
    ...program.program,
    participantCount: program.participantCount || 0,
  }
}

/**
 * Get programs a project is participating in
 */
export async function getProjectPrograms(projectId: string, status?: string) {
  const query = db
    .select({
      id: programProjects.id,
      status: programProjects.status,
      joinedAt: programProjects.joinedAt,
      completedAt: programProjects.completedAt,
      program: programs,
    })
    .from(programProjects)
    .innerJoin(programs, eq(programProjects.programId, programs.id))
    .where(eq(programProjects.projectId, projectId))

  if (status) {
    const results = await query
    return results.filter((pp) => pp.status === status)
  }

  return await query
}

/**
 * Get available programs for a project (not already joined)
 */
export async function getAvailablePrograms(projectId: string) {
  // Get program IDs already joined
  const joinedPrograms = await db
    .select({ programId: programProjects.programId })
    .from(programProjects)
    .where(eq(programProjects.projectId, projectId))

  const joinedProgramIds = joinedPrograms.map((pp) => pp.programId)

  // Get all programs not in the joined list
  if (joinedProgramIds.length === 0) {
    return await db.select().from(programs)
  }

  const availablePrograms = await db
    .select()
    .from(programs)
    .where(notInArray(programs.id, joinedProgramIds))

  return availablePrograms
}

/**
 * Join a program
 */
export async function joinProgram(projectId: string, programId: string) {
  // Check if already joined
  const existing = await db
    .select()
    .from(programProjects)
    .where(
      and(
        eq(programProjects.projectId, projectId),
        eq(programProjects.programId, programId)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    throw new Error('Project is already participating in this program')
  }

  // Add program participation
  const [programProject] = await db
    .insert(programProjects)
    .values({
      projectId,
      programId,
      status: 'ACTIVE',
      joinedAt: new Date(),
    })
    .returning()

  return programProject
}

/**
 * Update program participation status
 */
export async function updateProgramStatus(
  projectId: string,
  programId: string,
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN'
) {
  const [updated] = await db
    .update(programProjects)
    .set({
      status,
      completedAt: status === 'COMPLETED' ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(programProjects.projectId, projectId),
        eq(programProjects.programId, programId)
      )
    )
    .returning()

  if (!updated) {
    throw new Error('Program participation not found')
  }

  return updated
}

/**
 * Leave/withdraw from a program
 */
export async function leaveProgram(projectId: string, programId: string) {
  await db
    .delete(programProjects)
    .where(
      and(
        eq(programProjects.projectId, projectId),
        eq(programProjects.programId, programId)
      )
    )
}

/**
 * Get participants (projects) in a program
 */
export async function getProgramParticipants(programId: string) {
  const participants = await db
    .select({
      programProject: programProjects,
      project: projects,
      admin: {
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(programProjects)
    .innerJoin(projects, eq(programProjects.projectId, projects.id))
    .innerJoin(users, eq(projects.adminId, users.id))
    .where(eq(programProjects.programId, programId))
    .orderBy(programProjects.joinedAt)

  return participants.map((p) => ({
    id: p.programProject.id,
    status: p.programProject.status,
    joinedAt: p.programProject.joinedAt,
    project: {
      ...p.project,
      admin: p.admin,
    },
  }))
}
