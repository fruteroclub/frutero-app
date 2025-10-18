'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, ArrowRight } from 'lucide-react';

interface ProjectChoiceStepProps {
  userId: string;
  choice: 'create' | 'join' | 'skip';
  onUpdate: (choice: 'create' | 'join' | 'skip', projectId?: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProjectChoiceStep({
  choice,
  onUpdate,
  onNext,
  onBack,
}: ProjectChoiceStepProps) {
  const [selected, setSelected] = useState<'create' | 'join' | 'skip' | null>(
    choice === 'skip' ? null : choice
  );
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = () => {
    setSelected('create');
    onUpdate('create');
    onNext();
  };

  const handleJoinProject = async () => {
    if (!joinCode.trim()) {
      alert('Please enter a project code');
      return;
    }

    setIsLoading(true);
    try {
      // Look up project by code/ID
      const response = await fetch(
        `/api/jam/projects/lookup?code=${encodeURIComponent(joinCode)}`
      );

      if (!response.ok) {
        throw new Error('Project not found');
      }

      const project = await response.json();

      // Update choice with project ID
      onUpdate('join', project.id);
      onNext();
    } catch (error) {
      alert('Project not found. Please check the code and try again.');
      console.error('Project lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onUpdate('skip');
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team Setup</h2>
        <p className="text-muted-foreground">
          Create a new project or join an existing team
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Create New Project */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selected === 'create'
              ? 'border-primary ring-2 ring-primary'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelected('create')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Start a new project as the team admin. You can invite members
              later.
            </p>
            {selected === 'create' && (
              <Button onClick={handleCreateProject} className="w-full">
                Continue to Project Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Join Existing Project */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selected === 'join'
              ? 'border-primary ring-2 ring-primary'
              : 'hover:border-primary/50'
          }`}
          onClick={() => setSelected('join')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join Existing Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Join a team that&apos;s already been created
            </p>
            {selected === 'join' && (
              <div className="space-y-2">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter project code or ID"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinProject();
                    }
                  }}
                />
                <Button
                  onClick={handleJoinProject}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Finding Project...' : 'Join Project'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={handleSkip}>
          Skip for now (you can create/join a project later)
        </Button>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        💡 You can join multiple projects later from your dashboard
      </p>
    </div>
  );
}
