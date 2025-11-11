export default function PulpaUseCasesSection() {
  const useCases = [
    {
      title: 'Builders Activos',
      description:
        'Ganan tokens asistiendo a eventos, completando proyectos y participando en la comunidad',
      benefits: [
        'Acceso a mentorías',
        'Prioridad en eventos',
        'Red de contactos',
      ],
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      ringColor: 'ring-primary/20',
    },
    {
      title: 'Mentores y Líderes',
      description:
        'Monetizan su experiencia impartiendo talleres y brindando mentorías personalizadas',
      benefits: [
        'Ingresos por mentoría',
        'Reconocimiento',
        'Impacto comunitario',
      ],
      color: 'text-secondary',
      bgColor: 'bg-secondary/5',
      ringColor: 'ring-secondary/20',
    },
    {
      title: 'Emprendedores',
      description:
        'Usan tokens para acceso a recursos, validación comunitaria y red de seguridad',
      benefits: ['Capital semilla', 'Feedback experto', 'Apoyo en crisis'],
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      ringColor: 'ring-accent/20',
    },
  ]

  return (
    <section className="page relative overflow-hidden py-8 md:pt-12">
      <div className="container">
        {/* Gradient Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

        <div className="section relative space-y-8 md:space-y-12">
          {/* Use Cases Section */}
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                ¿Quién se beneficia de{' '}
                <span className="text-primary">$PULPA</span>?
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
                El ecosistema está diseñado para crear valor en múltiples etapas
                del journey
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border-2 border-border bg-background px-6 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 ${useCase.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative space-y-4">
                    <h4 className="text-xl leading-tight font-bold text-foreground">
                      {useCase.title}
                    </h4>
                    <p className="text-base text-muted-foreground">
                      {useCase.description}
                    </p>
                    <ul className="space-y-2">
                      {useCase.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-base"
                        >
                          <span className={useCase.color}>✓</span>
                          <span className="text-muted-foreground">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="mx-auto mt-12 h-1 w-24 rounded-full bg-primary md:mt-16" />
        </div>
      </div>
    </section>
  )
}
