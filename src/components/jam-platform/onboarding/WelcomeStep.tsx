import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-8 text-center">
      <div>
        <h1 className="mb-4 text-4xl font-bold">
          Welcome to Frutero JAM Platform 🎯
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-foreground">
          Connect with mentors, track your progress, and ship your project in 6
          weeks
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 text-4xl">🧑‍🏫</div>
            <h3 className="mb-2 font-semibold">Expert Mentorship</h3>
            <p className="text-sm text-foreground">
              Get paired with experienced mentors in your track
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 text-4xl">🎯</div>
            <h3 className="mb-2 font-semibold">Quest System</h3>
            <p className="text-sm text-foreground">
              Complete quests to level up and earn rewards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 text-4xl">🚀</div>
            <h3 className="mb-2 font-semibold">Ship Fast</h3>
            <p className="text-sm text-foreground">
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
  )
}
