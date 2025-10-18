import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-8 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Frutero JAM Platform 🎯
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with mentors, track your progress, and ship your project in 6
          weeks
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-4xl mb-3">🧑‍🏫</div>
            <h3 className="font-semibold mb-2">Expert Mentorship</h3>
            <p className="text-sm text-muted-foreground">
              Get paired with experienced mentors in your track
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Quest System</h3>
            <p className="text-sm text-muted-foreground">
              Complete quests to level up and earn rewards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-semibold mb-2">Ship Fast</h3>
            <p className="text-sm text-muted-foreground">
              Launch your project with structured accountability
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Button size="lg" onClick={onNext}>
          Let&apos;s Get Started →
        </Button>
      </div>
    </div>
  );
}
