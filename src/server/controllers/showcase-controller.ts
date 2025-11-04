import { db } from '@/db';
import { programs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { AppError } from '@/server/utils';

export class ShowcaseController {
  /**
   * Get all programs with their projects, members, and quest achievements
   */
  static async getAllShowcaseData() {
    try {
      // Fetch all programs with their projects
      const allPrograms = await db.query.programs.findMany({
        with: {
          projects: {
            with: {
              project: {
                with: {
                  members: {
                    with: {
                      user: {
                        columns: {
                          id: true,
                          username: true,
                          displayName: true,
                          avatarUrl: true,
                        },
                      },
                    },
                  },
                  questSubmissions: {
                    with: {
                      quest: {
                        columns: {
                          id: true,
                          title: true,
                          rewardPoints: true,
                          bountyUsd: true,
                        },
                      },
                    },
                    where: (projectQuests, { eq }) => eq(projectQuests.isVerified, true),
                  },
                },
              },
            },
          },
        },
        orderBy: [desc(programs.createdAt)],
      });

      return allPrograms;
    } catch (error) {
      console.error('Error fetching showcase data:', error);
      throw new AppError('Failed to fetch showcase data', 500);
    }
  }

  /**
   * Get specific program showcase data by name
   */
  static async getProgramShowcase(programName: string) {
    try {
      const program = await db.query.programs.findFirst({
        where: eq(programs.name, programName),
        with: {
          projects: {
            with: {
              project: {
                with: {
                  admin: {
                    columns: {
                      id: true,
                      username: true,
                      displayName: true,
                      avatarUrl: true,
                    },
                  },
                  members: {
                    with: {
                      user: {
                        columns: {
                          id: true,
                          username: true,
                          displayName: true,
                          avatarUrl: true,
                        },
                      },
                    },
                  },
                  questSubmissions: {
                    with: {
                      quest: {
                        columns: {
                          id: true,
                          title: true,
                          description: true,
                          rewardPoints: true,
                          bountyUsd: true,
                        },
                      },
                    },
                    where: (projectQuests, { eq }) => eq(projectQuests.isVerified, true),
                  },
                },
              },
            },
          },
        },
      });

      if (!program) {
        throw new AppError('Program not found', 404);
      }

      return program;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error fetching program showcase:', error);
      throw new AppError('Failed to fetch program showcase', 500);
    }
  }
}
