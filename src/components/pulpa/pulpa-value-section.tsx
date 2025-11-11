import { TrendingUp, Users, Shield, Gamepad2 } from 'lucide-react'

export default function PulpaValueSection() {
  const values = [
    {
      icon: TrendingUp,
      title: 'Aprendizaje Valorado',
      description:
        'Tu tiempo y esfuerzo tienen valor económico real. Cada contribución suma a tu reputación on-chain.',
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      ringColor: 'ring-primary/20',
    },
    {
      icon: Users,
      title: 'Economía Comunitaria',
      description:
        'Un ecosistema donde el valor fluye entre miembros. Ganas ayudando, enseñando y construyendo juntos.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/5',
      ringColor: 'ring-secondary/20',
    },
    {
      icon: Shield,
      title: 'Reputación Verificable',
      description:
        'Tu historial de contribuciones vive on-chain. Prueba inmutable de tu impacto y crecimiento.',
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      ringColor: 'ring-accent/20',
    },
    {
      icon: Gamepad2,
      title: 'Gamificación Constructiva',
      description:
        'Rangos, misiones y recompensas que incentivan crecimiento real, no vanity metrics.',
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      ringColor: 'ring-primary/20',
    },
  ]

  return (
    <section className="page relative overflow-hidden py-8 md:pt-12">
      <div className="container">
        {/* Gradient Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        <div className="section relative space-y-8 md:space-y-12">
          {/* Hero Title Area - Asymmetric Layout */}
          <div className="container">
            <div className="relative max-w-xl">
              {/* Decorative Element */}
              <div className="absolute top-0 -left-4 h-32 w-1 bg-primary md:-left-8 md:h-40 lg:-left-4 lg:h-22" />

              <div className="pl-4 md:pl-12">
                <h2 className="mb-6 text-3xl leading-tight font-bold text-foreground md:text-4xl">
                  ¿Por qué <span className="text-primary">$PULPA</span> es diferente?
                </h2>

                <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
                  No es un token especulativo. Es un sistema de reputación que convierte tus
                  contribuciones en oportunidades tangibles.
                </p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border-2 border-border bg-background px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 ${value.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    <div className="relative space-y-4">
                      {/* Icon with Ring */}
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${value.bgColor} ring-4 ${value.ringColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <Icon className={`h-6 w-6 ${value.color}`} />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl leading-tight font-bold text-foreground">
                        {value.title}
                      </h3>

                      {/* Description */}
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Problem/Solution Statement */}
          <div className="mx-auto max-w-4xl text-center">
            <h3 className="leading-tight font-semibold text-foreground">
              No más{' '}
              <span className="inline-block rotate-2 transform rounded-lg bg-muted px-4 py-2 text-foreground line-through">
                trabajo gratis
              </span>
              <br />
              ahora es{' '}
              <span className="inline-block -rotate-2 transform rounded-lg bg-primary px-4 py-2 text-white">
                valor compartido
              </span>
            </h3>
          </div>

          {/* Bottom Accent Line */}
          <div className="mx-auto mt-12 h-1 w-24 rounded-full bg-primary md:mt-16" />
        </div>
      </div>
    </section>
  )
}
