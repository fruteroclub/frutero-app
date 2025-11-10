import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, mentorProfiles } from '@/db/schema';

export const dynamic = 'force-dynamic';

/**
 * GET /api/club/members
 * Returns all club members with their roles
 */
export async function GET() {
  try {
    // Fetch all users with their profiles and mentor status
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
        bio: users.bio,
        email: users.email,
        avatarUrl: users.avatarUrl,
        website: users.website,
        metadata: users.metadata,
      })
      .from(users);

    // Get all mentor IDs
    const mentorsList = await db
      .select({ userId: mentorProfiles.userId })
      .from(mentorProfiles);

    const mentorIds = new Set(mentorsList.map((m) => m.userId));

    // Transform to club member format
    const members = allUsers.map((user) => {
      const isMentor = mentorIds.has(user.id);
      const metadata = user.metadata as { socialNetworks?: string[]; roles?: string[] } | null;

      // Determine roles based on metadata and mentor status
      let roles = metadata?.roles || [];

      // If no roles in metadata, infer from mentor status
      if (roles.length === 0) {
        roles = isMentor ? ['hacker', 'mentor'] : ['hacker'];
      }

      return {
        name: user.displayName,
        username: user.username,
        description: user.bio || '',
        socialNetworks: metadata?.socialNetworks || [],
        avatar: user.avatarUrl || '/images/default-avatar.png',
        calendarUrl: user.website || '',
        email: user.email || '',
        roles,
      };
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching club members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch club members' },
      { status: 500 }
    );
  }
}
