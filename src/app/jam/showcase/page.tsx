'use client';

import { useQuery } from '@tanstack/react-query';
import PageWrapper from '@/components/layout/page-wrapper';
import { Section } from '@/components/layout/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, Users, Trophy, Rocket, DollarSign } from 'lucide-react';
import Link from 'next/link';

type ShowcaseData = {
  data: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    type: string;
    status: string;
    projects: Array<{
      project: {
        id: string;
        name: string;
        slug: string;
        description: string;
        stage: string;
        productionUrl: string | null;
        repositoryUrl: string | null;
        videoUrl: string | null;
        members: Array<{
          user: {
            id: string;
            username: string;
            displayName: string;
            avatarUrl: string | null;
          };
        }>;
        questSubmissions: Array<{
          quest: {
            id: string;
            title: string;
            rewardPoints: number | null;
            bountyUsd: number | null;
          };
        }>;
      };
    }>;
  }>;
};

export default function ShowcasePage() {
  const { data, isLoading, error } = useQuery<ShowcaseData>({
    queryKey: ['showcase'],
    queryFn: async () => {
      const res = await fetch('/api/showcase');
      if (!res.ok) throw new Error('Failed to fetch showcase data');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <Section>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Cargando proyectos...</p>
            </div>
          </div>
        </Section>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Section>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-destructive">Error cargando datos del showcase</p>
          </div>
        </Section>
      </PageWrapper>
    );
  }

  const programs = data?.data || [];

  return (
    <PageWrapper>
      <Section>
        {/* Header */}
        <div className="mb-8 w-full">
          <h1 className="mb-2 text-4xl font-bold font-funnel">Shipyard</h1>
          <p className="text-lg text-muted-foreground">
            Proyectos construidos por la comunidad Frutero
          </p>
        </div>

        {/* Programs and Projects */}
        <div className="space-y-12 w-full">
        {programs.map((program) => (
          <div key={program.id} className="space-y-6">
            {/* Program Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold font-funnel">{program.name}</h2>
                <p className="text-muted-foreground">{program.description}</p>
              </div>
              <Badge variant={program.status === 'COMPLETED' ? 'default' : 'secondary'}>
                {program.status}
              </Badge>
            </div>

            {/* Projects Grid */}
            {program.projects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay proyectos en este programa aún
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {program.projects.map(({ project }) => {
                  const totalPoints = project.questSubmissions.reduce(
                    (sum, sub) => sum + (sub.quest.rewardPoints || 0),
                    0
                  );
                  const totalEarnings = project.questSubmissions.reduce(
                    (sum, sub) => sum + (sub.quest.bountyUsd || 0),
                    0
                  );

                  return (
                    <Card key={project.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="font-funnel">
                              <Link
                                href={`/jam/projects/${project.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {project.name}
                              </Link>
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {project.description}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{project.stage}</Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-4">
                        {/* Team Members */}
                        {project.members.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Equipo ({project.members.length})</span>
                            </div>
                            <div className="flex -space-x-2">
                              {project.members.slice(0, 5).map(({ user }) => (
                                <Avatar
                                  key={user.id}
                                  className="border-2 border-background"
                                  title={user.displayName}
                                >
                                  <AvatarImage src={user.avatarUrl || undefined} />
                                  <AvatarFallback>
                                    {user.displayName.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {project.members.length > 5 && (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                  +{project.members.length - 5}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Quest Achievements */}
                        {project.questSubmissions.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                              <Trophy className="h-4 w-4" />
                              <span>
                                {project.questSubmissions.length} quest
                                {project.questSubmissions.length !== 1 ? 's' : ''} completado
                                {project.questSubmissions.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {totalPoints > 0 && (
                                <Badge variant="secondary" className="font-mono">
                                  {totalPoints} puntos
                                </Badge>
                              )}
                              {totalEarnings > 0 && (
                                <Badge variant="default" className="font-mono">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  {totalEarnings} USD
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {project.productionUrl && (
                            <a
                              href={project.productionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Rocket className="h-4 w-4" />
                              Demo
                            </a>
                          )}
                          {project.repositoryUrl && (
                            <a
                              href={project.repositoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Código
                            </a>
                          )}
                          {project.videoUrl && (
                            <a
                              href={project.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Video
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12 w-full">
            <p className="text-lg text-muted-foreground">
              No hay programas para mostrar aún
            </p>
          </div>
        )}
      </Section>
    </PageWrapper>
  );
}
