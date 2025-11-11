import { Rocket, Brain, Plane, Shield, Building, Vote } from 'lucide-react'

export default function PulpaBenefitsSection() {
  const benefits = [
    {
      icon: Rocket,
      title: 'Acceso Premium',
      description: 'Membresía Impacto y programas exclusivos',
      cost: '250 $PULPA/mes',
      features: [
        'Acceso a mentores elite',
        'Workshops exclusivos',
        'Prioridad en eventos',
        'Red de soporte VIP',
      ],
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      ringColor: 'ring-primary/20',
    },
    {
      icon: Brain,
      title: 'Mentorías Personalizadas',
      description: 'Sesiones 1:1 con expertos del ecosistema',
      cost: '50-100 $PULPA/hora',
      features: [
        'Expertos en Web3',
        'Revisión de código',
        'Career coaching',
        'Feedback personalizado',
      ],
      color: 'text-secondary',
      bgColor: 'bg-secondary/5',
      ringColor: 'ring-secondary/20',
    },
    {
      icon: Plane,
      title: 'Viajes y Eventos',
      description: 'Apoyo para asistir a hackathons y conferencias',
      cost: '200-2000 $PULPA',
      features: [
        'Hackathons nacionales',
        'Conferencias internacionales',
        'Hacker houses',
        'Networking events',
      ],
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      ringColor: 'ring-accent/20',
    },
    {
      icon: Shield,
      title: 'Red de Seguridad',
      description: 'Apoyo comunitario en situaciones de emergencia',
      cost: 'Variable',
      features: [
        'Apoyo financiero temporal',
        'Soporte en crisis',
        'Validación comunitaria',
        'Sin intereses',
      ],
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      ringColor: 'ring-primary/20',
    },
    {
      icon: Building,
      title: 'Co-working Spaces',
      description: 'Acceso a Regen Cowork y espacios aliados',
      cost: '20-200 $PULPA',
      features: [
        'Pases diarios (20 $PULPA)',
        'Membresía mensual (200 $PULPA)',
        'Internet de alta velocidad',
        'Comunidad de builders',
      ],
      color: 'text-secondary',
      bgColor: 'bg-secondary/5',
      ringColor: 'ring-secondary/20',
    },
    {
      icon: Vote,
      title: 'Gobernanza',
      description: 'Participación en decisiones comunitarias',
      cost: 'Basado en balance',
      features: [
        'Voto en propuestas',
        'Iniciativas comunitarias',
        'Dirección del programa',
        'Distribución de recursos',
      ],
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      ringColor: 'ring-accent/20',
    },
  ]

  return (
    <section className="page relative overflow-hidden py-8 md:pt-12">
      <div className="container">
        {/* Gradient Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />

        <div className="section relative space-y-8 md:space-y-12">
          {/* Hero Title Area - Asymmetric Layout */}
          <div className="container">
            <div className="relative max-w-xl">
              {/* Decorative Element */}
              <div className="absolute top-0 -left-4 h-32 w-1 bg-secondary md:-left-8 md:h-40 lg:-left-4 lg:h-22" />

              <div className="pl-4 md:pl-12">
                <h2 className="mb-6 text-3xl leading-tight font-bold text-foreground md:text-4xl">
                  Usa <span className="text-primary">$PULPA</span> para crecer
                </h2>

                <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
                  Accede a oportunidades que impulsan tu desarrollo profesional
                  y amplían tu red.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Grid - Diagonal Composition */}
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border-2 border-border bg-background px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 ${benefit.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    <div className="relative space-y-4">
                      {/* Icon with Ring */}
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${benefit.bgColor} ring-4 ${benefit.ringColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <Icon className={`h-6 w-6 ${benefit.color}`} />
                      </div>

                      {/* Title & Cost */}
                      <div>
                        <h3 className="text-xl leading-tight font-bold text-foreground">
                          {benefit.title}
                        </h3>
                        <p className="mt-1 text-base text-muted-foreground">
                          {benefit.description}
                        </p>
                        <p
                          className={`text-base font-semibold ${benefit.color} mt-2`}
                        >
                          {benefit.cost}
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2">
                        {benefit.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-base text-muted-foreground"
                          >
                            <span className={benefit.color}>✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Additional Benefits Statement */}
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="leading-tight font-semibold text-foreground">
              Además:{' '}
              <span className="inline-block -rotate-2 transform rounded-lg bg-primary px-4 py-2 text-white">
                Rangos
              </span>
              {', '}
              <span className="inline-block rotate-2 transform rounded-lg bg-secondary px-4 py-2 text-white">
                Misiones
              </span>
              {' y '}
              <span className="inline-block -rotate-1 transform rounded-lg bg-accent px-4 py-2 text-foreground">
                Leaderboard
              </span>
            </h3>
          </div>

          {/* Bottom Accent Line */}
          <div className="mx-auto mt-12 h-1 w-24 rounded-full bg-secondary md:mt-16" />
        </div>
      </div>
    </section>
  )
}
