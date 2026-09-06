import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        'Pasé de ser estudiante a CTO en 8 meses. Frutero Club no solo me enseñó a programar, me enseñó a liderar.',
      name: 'Ana Rodríguez',
      role: 'CTO @ TechStartup',
      achievement: 'Levantó $500K en funding',
      avatar: '🌱',
      color: 'green',
    },
    {
      quote:
        'Mi startup generó $100K en revenue en el primer año. Todo comenzó con un hackathon en Frutero Club.',
      name: 'Carlos Mendoza',
      role: 'Founder @ InnovateLab',
      achievement: '40 empleados y creciendo',
      avatar: '🚗',
      color: 'blue',
    },
    {
      quote:
        'Gané mi primer hackathon siguiendo la metodología Frutero. Ahora lidero el equipo de IA en una unicornio.',
      name: 'María González',
      role: 'AI Lead @ UnicornCorp',
      achievement: 'Ex-Googler, MIT graduate',
      avatar: '🍉',
      color: 'pink',
    },
  ]

  return (
    <section className="page py-12">
      <div className="container gap-y-6">
        <div className="space-y-2 px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Historias reales de{' '}
            <span className="text-secondary">transformación</span>
          </h2>
          <p className="max-w-2xl text-xl text-muted">
            De hackers con potencial a profesionales exitosos
          </p>
        </div>

        <div className="section grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent>
                <div className="mb-6">
                  <blockquote className="text-lg leading-relaxed text-foreground">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                </div>

                <div className="mb-4 flex items-center space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      testimonial.color === 'green'
                        ? 'bg-accent'
                        : testimonial.color === 'blue'
                          ? 'bg-blue-500'
                          : 'bg-secondary'
                    }`}
                  >
                    <span className="text-sm font-bold text-white">
                      {testimonial.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-foreground bg-background p-3">
                  <p className="text-center font-semibold text-primary">
                    {testimonial.achievement}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center pt-6">
          <Button variant="outline" size="lg">
            Leer más testimonios
          </Button>
        </div>
      </div>
    </section>
  )
}
