"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Clock,
  Users,
  Calendar,
  Globe
} from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface VeranoSimpleCTAProps {
  className?: string
  applicationDeadline: Date
}

function CountdownTimer({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = deadline.getTime() - now

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  const timeUnits = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds }
  ]

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-white" />
        <span className="text-lg font-medium text-white">
          Aplicaciones abiertas hasta:
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="p-3 rounded-lg bg-white text-center"
          >
            <div className="text-2xl font-bold text-primary mb-1">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs font-medium text-primary/80 uppercase">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VeranoSimpleCTA({ className, applicationDeadline }: VeranoSimpleCTAProps) {
  const handleApply = () => {
    // Redirect to application form
    window.location.href = '/programa/apply'
  }

  const handleLearnMore = () => {
    // Redirect to resources
    window.location.href = '/recursos'
  }

  return (
    <section className={cn('pt-16 md:pt-8', className)}>
      <div className="container">
        <div className="rounded-xl bg-primary px-8 py-12 md:py-16 text-center text-white space-y-4">
          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">
              ¿Listo para Comenzar?
            </h2>
            <p className="text-2xl font-medium text-white">
              Únete al próximo cohort de Verano En Cadena y transforma tu carrera en 21 días
            </p>
          </div>

          {/* Countdown */}
          <CountdownTimer deadline={applicationDeadline} />

          {/* Main CTA */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleApply}
              className="w-full md:w-1/2 bg-white text-foreground hover:bg-accent hover:text-foreground px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex gap-x-2 items-center"
            >
              <Calendar className="text-primary fill-primary w-5 h-5" />
              Aplicar al Programa
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Max 15 participantes</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Solo Centroamérica</span>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLearnMore}
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              Ver Curriculum Completo
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:text-white hover:bg-white/20"
              asChild
            >
              <a href="mailto:info@frutero.club">
                Hacer Pregunta
              </a>
            </Button>
          </div>

          {/* Program Stats */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">200+</div>
                <div className="text-sm font-medium text-primary/80">Alumni exitosos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">95%</div>
                <div className="text-sm font-medium text-primary/80">Tasa de finalización</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">15+</div>
                <div className="text-sm font-medium text-primary/80">Países representados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}