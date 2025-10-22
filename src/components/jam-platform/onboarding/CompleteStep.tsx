import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <CheckCircle2 className="relative h-24 w-24 text-primary" />
        </div>
      </div>

      <div>
        <h1 className="mb-4 text-4xl font-bold">You&apos;re All Set! 🎉</h1>
        <p className="mx-auto max-w-2xl text-xl text-foreground">
          Welcome to the Frutero JAM Platform. Let&apos;s start building!
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 text-2xl font-bold text-primary">1</div>
            <h3 className="mb-2 font-semibold">Explore Quests</h3>
            <p className="text-sm text-foreground">
              Check out available quests and start earning points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 text-2xl font-bold text-primary">2</div>
            <h3 className="mb-2 font-semibold">Find a Mentor</h3>
            <p className="text-sm text-foreground">
              Browse mentor profiles and request connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 text-2xl font-bold text-primary">3</div>
            <h3 className="mb-2 font-semibold">Ship Your Project</h3>
            <p className="text-sm text-foreground">
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
  )
}
