import type { UserWithProfile } from '@/types/user'

interface WelcomeHeaderProps {
  user: UserWithProfile
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const firstName = user.profile?.firstName || user.displayName
  const currentHour = new Date().getHours()

  const greeting =
    currentHour < 12
      ? 'Buenos días'
      : currentHour < 18
        ? 'Buenas tardes'
        : 'Buenas noches'

  return (
    <div className="w-full space-y-2 pl-4 text-left">
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, {firstName}
      </h1>
      <p className="text-foreground">
        Bienvenido a tu centro de comando JAM. Aquí puedes ver tu progreso y
        próximas tareas.
      </p>
    </div>
  )
}
