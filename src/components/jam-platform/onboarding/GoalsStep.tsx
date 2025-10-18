'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoalsStepProps {
  goals: string;
  onUpdate: (goals: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function GoalsStep({
  goals,
  onUpdate,
  onNext,
  onBack,
  isLoading,
}: GoalsStepProps) {
  const [goalsText, setGoalsText] = useState(goals);

  const handleChange = (value: string) => {
    setGoalsText(value);
    onUpdate(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalsText.trim()) {
      alert('Please set your goals for the next 6 weeks');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Set Your 6-Week Goals</h2>
        <p className="text-muted-foreground">
          What do you want to achieve in the JAM program?
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goals">
              What will success look like? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="goals"
              value={goalsText}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Example: Launch my MVP with 100 users, complete 3 technical quests, get accepted to an accelerator program..."
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific! Clear goals help your mentor provide better guidance.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">💡 Tips for great goals:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Make them measurable (numbers, dates, milestones)</li>
              <li>Focus on outcomes, not just activities</li>
              <li>Include both project and personal growth goals</li>
              <li>Think about what you want to learn, not just build</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Complete Onboarding'}
        </Button>
      </div>
    </form>
  );
}
