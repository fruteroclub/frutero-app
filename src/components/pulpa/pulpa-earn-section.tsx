'use client'

import {
  GraduationCap,
  Code,
  Trophy,
  Heart,
  Megaphone,
  Coins,
  Plus,
  Minus,
} from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function PulpaEarnSection() {
  const [openCategoryIndex, setOpenCategoryIndex] = useState(-1)
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<
    number | null
  >(null)

  const toggleCategory = (index: number) => {
    setOpenCategoryIndex(openCategoryIndex === index ? -1 : index)
  }
  const categories = [
    {
      icon: GraduationCap,
      title: 'Eventos y Aprendizaje',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      ringColor: 'ring-blue-500/20',
      activities: [
        {
          activity: 'Asistir a workshops',
          reward: '10 $PULPA',
          frequency: 'Por evento',
        },
        {
          activity: 'Completar bootcamps',
          reward: '50 $PULPA',
          frequency: 'Por programa',
        },
        {
          activity: 'Participar en Discord Spaces',
          reward: '5 $PULPA',
          frequency: 'Por evento',
        },
        {
          activity: 'Completar proyectos de workshops',
          reward: '15 $PULPA',
          frequency: 'Por entregable',
        },
      ],
    },
    {
      icon: Trophy,
      title: 'Hackathons y Competencias',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      ringColor: 'ring-yellow-500/20',
      activities: [
        {
          activity: 'Participar en hackathon',
          reward: '50 $PULPA',
          frequency: 'Por evento',
        },
        {
          activity: 'Top 10 en hackathon',
          reward: '+50 $PULPA',
          frequency: 'Bonus',
        },
        { activity: 'Finalista', reward: '+100 $PULPA', frequency: 'Bonus' },
        { activity: 'Ganador', reward: '+200 $PULPA', frequency: 'Bonus' },
      ],
    },
    {
      icon: Heart,
      title: 'Contribuciones Comunitarias',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      ringColor: 'ring-pink-500/20',
      activities: [
        {
          activity: 'Impartir talleres',
          reward: '50 $PULPA',
          frequency: 'Por taller',
        },
        { activity: 'Mentorías', reward: '20 $PULPA', frequency: 'Por hora' },
        {
          activity: 'Crear contenido original',
          reward: '30-100 $PULPA',
          frequency: 'Por pieza',
        },
        {
          activity: 'Responder preguntas',
          reward: '2-5 $PULPA',
          frequency: 'Por respuesta',
        },
      ],
    },
    {
      icon: Code,
      title: 'Contribuciones Técnicas',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      ringColor: 'ring-green-500/20',
      activities: [
        {
          activity: 'Contribuciones a repos',
          reward: '20-100 $PULPA',
          frequency: 'Por PR',
        },
        {
          activity: 'Solución de bugs',
          reward: '10-50 $PULPA',
          frequency: 'Por fix',
        },
        {
          activity: 'Herramientas comunitarias',
          reward: '50-200 $PULPA',
          frequency: 'Por herramienta',
        },
        {
          activity: 'Documentación técnica',
          reward: '20-80 $PULPA',
          frequency: 'Por documento',
        },
      ],
    },
    {
      icon: Megaphone,
      title: 'Representación y Crecimiento',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      ringColor: 'ring-purple-500/20',
      activities: [
        {
          activity: 'Representar Frutero en eventos',
          reward: '50-200 $PULPA',
          frequency: 'Por evento',
        },
        {
          activity: 'Invitar miembros activos',
          reward: '10 $PULPA',
          frequency: 'Por miembro',
        },
        {
          activity: 'Gestionar grants',
          reward: '3% del valor',
          frequency: 'Por grant',
        },
        {
          activity: 'Traer patrocinadores',
          reward: '10% del valor',
          frequency: 'Por patrocinio',
        },
      ],
    },
    {
      icon: Coins,
      title: 'Actividades Diarias',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      ringColor: 'ring-orange-500/20',
      activities: [
        {
          activity: 'Mensajes "GM"',
          reward: '1 $PULPA',
          frequency: '20+ días/mes',
        },
        {
          activity: 'Participar en discusiones',
          reward: '1-3 $PULPA',
          frequency: 'Semanal',
        },
        {
          activity: 'Compartir recursos valiosos',
          reward: '3-5 $PULPA',
          frequency: 'Por recurso',
        },
      ],
    },
  ]

  // const h2fMilestones = [
  //   {
  //     phase: 'Fase 2',
  //     milestone: 'Cultivando - Primeros proyectos',
  //     reward: '200 $PULPA',
  //   },
  //   {
  //     phase: 'Fase 3',
  //     milestone: 'Incubando - Proyecto funcional',
  //     reward: '300 $PULPA',
  //   },
  //   {
  //     phase: 'Fase 4',
  //     milestone: 'Creciendo - MVP en producción',
  //     reward: '500 $PULPA',
  //   },
  //   {
  //     phase: 'MVP Launch',
  //     milestone: 'Lanzar producto desde programa',
  //     reward: '250 $PULPA',
  //   },
  // ]

  return (
    <section id="earn" className="page relative overflow-hidden py-8 md:pt-12">
      <div className="container">
        {/* Gradient Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />

        <div className="section relative space-y-8 md:space-y-12">
          {/* Hero Title Area - Asymmetric Layout */}
          <div className="container">
            <div className="relative max-w-xl">
              {/* Decorative Element */}
              <div className="absolute top-0 -left-4 h-32 w-1 bg-accent md:-left-8 md:h-40 lg:-left-4 lg:h-22" />

              <div className="pl-4 md:pl-12">
                <h2 className="mb-6 text-3xl leading-tight font-bold text-foreground md:text-4xl">
                  Cómo ganar <span className="text-primary">$PULPA</span>
                </h2>

                <p className="max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
                  Múltiples formas de generar valor y ser recompensado por tus
                  contribuciones.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile - Accordion Style (FAQ-like) */}
          <div className="mx-auto max-w-6xl md:hidden">
            <div className="space-y-4">
              {categories.map((category, index) => {
                const Icon = category.icon
                const isOpen = openCategoryIndex === index
                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border-2 border-border bg-card"
                  >
                    <button
                      onClick={() => toggleCategory(index)}
                      className="flex w-full items-center justify-between px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${category.bgColor}`}
                        >
                          <Icon className={`h-5 w-5 ${category.color}`} />
                        </div>
                        <h3 className="text-left text-lg font-bold text-foreground">
                          {category.title}
                        </h3>
                      </div>
                      <div className="flex justify-end">
                        {isOpen ? (
                          <Minus className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="space-y-3 border-t border-border px-4 pt-4 pb-4">
                        {category.activities.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="flex-1 text-sm text-muted-foreground">
                                {item.activity}
                              </p>
                              <p
                                className={`text-sm font-semibold ${category.color} shrink-0`}
                              >
                                {item.reward}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground/60">
                              {item.frequency}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Medium/Large - Card Grid with Modals */}
          <div className="mx-auto hidden max-w-6xl md:block">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedCategoryModal(index)}
                    className="group relative overflow-hidden rounded-2xl border-2 border-border bg-background px-6 py-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 ${category.bgColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />

                    <div className="relative space-y-4">
                      {/* Icon with Ring */}
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor} ring-4 ${category.ringColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl leading-tight font-bold text-foreground">
                        {category.title}
                      </h3>

                      {/* Activity count hint */}
                      <p className="text-sm text-muted-foreground">
                        {category.activities.length} formas de ganar →
                      </p>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Modal for Medium/Large Viewports */}
          <Dialog
            open={selectedCategoryModal !== null}
            onOpenChange={(open) => !open && setSelectedCategoryModal(null)}
          >
            <DialogContent className="max-w-2xl">
              {selectedCategoryModal !== null && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-4">
                      {(() => {
                        const category = categories[selectedCategoryModal]
                        const Icon = category.icon
                        return (
                          <>
                            <div
                              className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.bgColor} ring-4 ${category.ringColor}`}
                            >
                              <Icon className={`h-6 w-6 ${category.color}`} />
                            </div>
                            <DialogTitle className="text-2xl font-bold">
                              {category.title}
                            </DialogTitle>
                          </>
                        )
                      })()}
                    </div>
                  </DialogHeader>

                  <div className="mt-4 space-y-4">
                    {categories[selectedCategoryModal].activities.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="space-y-2 border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <p className="flex-1 text-base font-medium text-foreground">
                              {item.activity}
                            </p>
                            <p
                              className={`text-base font-bold ${categories[selectedCategoryModal].color} shrink-0`}
                            >
                              {item.reward}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.frequency}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* H2F Milestones */}
          {/* <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border-2 border-border bg-background p-8">
              <h3 className="text-2xl font-bold text-center mb-6">
                Milestones del Programa H2F
              </h3>
              <div className="space-y-4">
                {h2fMilestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{milestone.phase}</p>
                      <p className="text-sm text-muted-foreground">{milestone.milestone}</p>
                    </div>
                    <p className="text-lg font-bold text-primary">{milestone.reward}</p>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Bottom Note */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              * Todas las actividades son validadas por moderadores y mentores
              de la comunidad
            </p>
          </div>

          {/* Bottom Accent Line */}
          <div className="mx-auto mt-12 h-1 w-24 rounded-full bg-accent md:mt-16" />
        </div>
      </div>
    </section>
  )
}
