import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, projectMembers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateUniqueSlug } from '@/server/controllers/projects';

/**
 * POST /api/jam/projects - Create new project
 *
 * Body:
 * - name: string (required)
 * - description: string (required)
 * - category: string (optional)
 * - stage: 'IDEA' | 'PROTOTYPE' | 'BUILD' | 'PROJECT' (optional, default: 'IDEA')
 * - walletAddress: string (optional)
 * - website: string (optional)
 * - repositoryUrl: string (optional) - GitHub repository
 * - videoUrl: string (optional) - Demo video (Loom, YouTube, etc.)
 * - productionUrl: string (optional) - Live deployment URL
 * - pitchDeckUrl: string (optional) - Pitch deck presentation
 * - avatarUrl: string (optional) - Project logo/avatar
 * - xUsername: string (optional) - Twitter/X handle
 * - adminId: string (required) - User ID of creator
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.description || !data.adminId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, adminId' },
        { status: 400 }
      );
    }

    // Generate unique slug from project name
    const slug = await generateUniqueSlug(data.name);

    // Create project in transaction
    const [newProject] = await db.transaction(async (tx) => {
      // 1. Create the project
      const [project] = await tx
        .insert(projects)
        .values({
          name: data.name,
          slug,
          description: data.description,
          category: data.category || null,
          stage: data.stage || 'IDEA',
          walletAddress: data.walletAddress || null,
          website: data.website || null,
          // Hackathon submission fields
          repositoryUrl: data.repositoryUrl || null,
          videoUrl: data.videoUrl || null,
          productionUrl: data.productionUrl || null,
          pitchDeckUrl: data.pitchDeckUrl || null,
          avatarUrl: data.avatarUrl || null,
          xUsername: data.xUsername || null,
          adminId: data.adminId,
        })
        .returning();

      // 2. Auto-add creator as ADMIN member
      await tx.insert(projectMembers).values({
        projectId: project.id,
        userId: data.adminId,
        role: 'ADMIN',
      });

      return [project];
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/jam/projects - List projects
 *
 * Query params:
 * - userId: string (optional) - Filter projects by user membership
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Get projects where user is a member
      const userProjects = await db
        .select({
          project: projects,
          role: projectMembers.role,
          joinedAt: projectMembers.joinedAt,
        })
        .from(projectMembers)
        .innerJoin(projects, eq(projectMembers.projectId, projects.id))
        .where(eq(projectMembers.userId, userId));

      return NextResponse.json(userProjects);
    }

    // Get all projects
    const allProjects = await db.select().from(projects);
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/jam/projects - Update project
 *
 * Body:
 * - id: string (required) - Project ID
 * - adminId: string (required) - User ID making the request (for authorization)
 * - name: string (optional)
 * - description: string (optional)
 * - category: string (optional)
 * - stage: string (optional)
 * - walletAddress: string (optional)
 * - website: string (optional)
 * - repositoryUrl: string (optional) - GitHub repository
 * - videoUrl: string (optional) - Demo video
 * - productionUrl: string (optional) - Live deployment URL
 * - pitchDeckUrl: string (optional) - Pitch deck presentation
 * - avatarUrl: string (optional) - Project logo/avatar
 * - xUsername: string (optional) - Twitter/X handle
 */
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.id || !data.adminId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, adminId' },
        { status: 400 }
      );
    }

    // Verify user is admin of the project
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, data.id))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.adminId !== data.adminId) {
      return NextResponse.json(
        { error: 'Unauthorized: Only project admin can update' },
        { status: 403 }
      );
    }

    // Build update object (only include provided fields)
    const updates: Partial<typeof projects.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.category !== undefined) updates.category = data.category;
    if (data.stage !== undefined) updates.stage = data.stage;
    if (data.walletAddress !== undefined) updates.walletAddress = data.walletAddress;
    if (data.website !== undefined) updates.website = data.website;
    // Hackathon submission fields
    if (data.repositoryUrl !== undefined) updates.repositoryUrl = data.repositoryUrl;
    if (data.videoUrl !== undefined) updates.videoUrl = data.videoUrl;
    if (data.productionUrl !== undefined) updates.productionUrl = data.productionUrl;
    if (data.pitchDeckUrl !== undefined) updates.pitchDeckUrl = data.pitchDeckUrl;
    if (data.avatarUrl !== undefined) updates.avatarUrl = data.avatarUrl;
    if (data.xUsername !== undefined) updates.xUsername = data.xUsername;

    // Update project
    const [updatedProject] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, data.id))
      .returning();

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
