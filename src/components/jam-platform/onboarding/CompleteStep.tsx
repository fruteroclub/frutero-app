import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <CheckCircle2 className="h-24 w-24 text-primary relative" />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold mb-4">You&apos;re All Set! 🎉</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to the Frutero JAM Platform. Let&apos;s start building!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-2">1</div>
            <h3 className="font-semibold mb-2">Explore Quests</h3>
            <p className="text-sm text-muted-foreground">
              Check out available quests and start earning points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-2">2</div>
            <h3 className="font-semibold mb-2">Find a Mentor</h3>
            <p className="text-sm text-muted-foreground">
              Browse mentor profiles and request connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-2">3</div>
            <h3 className="font-semibold mb-2">Ship Your Project</h3>
            <p className="text-sm text-muted-foreground">
              Track your progress and hit your 6-week goals
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Button size="lg" onClick={onComplete}>
          Go to Dashboard →
        </Button>
      </div>
    </div>
  );
}
