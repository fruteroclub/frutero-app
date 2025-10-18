import { db } from '@/db';
import { projects, projectMembers, programProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Generate URL-friendly slug from project name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate unique slug with collision handling
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  let slug = generateSlug(name);
  let counter = 1;

  while (true) {
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      return slug;
    }

    slug = `${generateSlug(name)}-${counter}`;
    counter++;
  }
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  return project || null;
}

/**
 * Get project members with user details
 */
export async function getProjectMembers(projectId: string) {
  const members = await db
    .select({
      userId: projectMembers.userId,
      role: projectMembers.role,
      joinedAt: projectMembers.joinedAt,
    })
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId));

  return members;
}

/**
 * Get programs a project is participating in
 */
export async function getProjectPrograms(projectId: string) {
  const programs = await db
    .select()
    .from(programProjects)
    .where(eq(programProjects.projectId, projectId));

  return programs;
}
