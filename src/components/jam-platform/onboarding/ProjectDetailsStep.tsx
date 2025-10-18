'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectData {
  name?: string;
  description?: string;
}

interface ProjectDetailsStepProps {
  data?: ProjectData;
  onUpdate: (data: ProjectData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProjectDetailsStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: ProjectDetailsStepProps) {
  const [formData, setFormData] = useState<ProjectData>(data || {});

  const handleChange = (field: keyof ProjectData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert('Please fill in project name and description');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Project Details</h2>
        <p className="text-muted-foreground">
          Tell us about what you&apos;re building
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="projectName"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., AI-Powered Task Manager"
              required
            />
            <p className="text-xs text-muted-foreground">
              Choose a clear, memorable name for your project
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="projectDescription"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="What problem does your project solve? Who is it for?"
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Explain your project in 2-3 sentences
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>💡 Tip:</strong> You&apos;ll be able to add more details like
              repository URL, demo links, and team members later from your
              dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
}
