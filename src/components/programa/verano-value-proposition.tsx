'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Code,
  User,
  Users,
  Brain,
  DollarSign,
  Globe,
  TrendingUp,
  Award,
  Target,
  Zap,
} from 'lucide-react'

interface BenefitItem {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'secondary' | 'accent'
}

interface MetricItem {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

interface VeranoValuePropositionProps {
  className?: string
}

function AnimatedCounter({
  item,
  delay = 0,
}: {
  item: MetricItem
  delay?: number
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = item.value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      current += increment
      step++

      if (step === steps) {
        setCount(item.value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [item.value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="mb-2 text-4xl font-bold text-primary">
        {item.prefix}
        {count}
        {item.suffix}
      </div>
      <div className="text-sm text-foreground">{item.label}</div>
    </motion.div>
  )
}

function BenefitCard({
  benefit,
  index,
}: {
  benefit: BenefitItem
  index: number
}) {
  const colorClasses = {
    primary:
      'border-[2.5px] border-primary hover:border-primary/40 hover:bg-primary/5',
    secondary:
      'border-[2.5px] border-secondary hover:border-secondary/40 hover:bg-secondary/5',
    accent:
      'border-[2.5px] border-accent hover:border-accent/40 hover:bg-accent/5',
  }

  const iconColorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          'h-full transition-all duration-300 hover:scale-105 hover:shadow-lg',
          colorClasses[benefit.color],
        )}
      >
        <CardHeader className="text-center">
          <div
            className={cn(
              'mx-auto mb-4 h-12 w-12',
              iconColorClasses[benefit.color],
            )}
          >
            {benefit.icon}
          </div>
          <CardTitle className="text-lg">{benefit.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-foreground">{benefit.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const benefits: BenefitItem[] = [
  {
    icon: <Code className="h-full w-full" />,
    title: 'Desarrollo AI-Enhanced',
    description:
      'Aprende a programar 5-10x más rápido con AI y herramientas modernas',
    color: 'primary',
  },
  {
    icon: <User className="h-full w-full" />,
    title: 'Construye Tu Marca Personal',
    description: 'De coder anónimo a builder reconocido públicamente en Web3',
    color: 'secondary',
  },
  {
    icon: <Users className="h-full w-full" />,
    title: 'Red Elite de Builders',
    description: 'Conecta con 200+ developers exitosos en 15+ países',
    color: 'accent',
  },
  {
    icon: <Brain className="h-full w-full" />,
    title: 'Mentalidad de Founder',
    description: 'Cambia de empleado a emprendedor en 21 días intensivos',
    color: 'primary',
  },
  {
    icon: <DollarSign className="h-full w-full" />,
    title: 'Potencial de Ingresos Real',
    description: 'Casos reales de $2M+ levantados por alumni del programa',
    color: 'secondary',
  },
  {
    icon: <Globe className="h-full w-full" />,
    title: 'Liderazgo Centroamericano',
    description: 'Representa tu país en la escena tech global como founder',
    color: 'accent',
  },
]

const metrics: MetricItem[] = [
  { value: 200, label: 'Developers Transformados', prefix: '+' },
  { value: 2, label: 'Millones USD Levantados', prefix: '$', suffix: 'M+' },
  { value: 25, label: 'Hackathons Ganados', prefix: '+' },
  { value: 15, label: 'Países Representados', prefix: '+' },
  { value: 40, label: 'Startups Fundadas', prefix: '+' },
  { value: 95, label: 'Tasa de Éxito', suffix: '%' },
]

export function VeranoValueProposition({
  className,
}: VeranoValuePropositionProps) {
  return (
    <section className={cn('space-y-12 pt-16 md:pt-8', className)}>
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-4xl font-bold">
            Acelera Tu Carrera 10x en
            <span className="ml-2 inline-block -rotate-5 transform rounded-lg bg-secondary px-4 py-2 text-secondary-foreground">
              21 Días
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-foreground">
            Programa intensivo que convierte hackers en founders exitosos. La
            metodología probada que acelera tu crecimiento profesional.
          </p>
        </motion.div>
      </div>

      {/* Success Metrics */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 text-center"
        >
          <h3 className="mb-2 text-2xl font-bold">Resultados Comprobados</h3>
          <p className="text-foreground">
            Más de 200 developers han transformado sus carreras
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3 lg:mx-auto lg:gap-x-0 lg:px-16">
          {metrics.map((metric, i) => (
            <AnimatedCounter key={metric.label} item={metric} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-4 text-center"
        >
          <h3 className="mb-2 text-2xl font-bold">6 Transformaciones Clave</h3>
          <p className="text-foreground">
            Cada área de tu vida profesional será transformada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={i} />
          ))}
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-2 font-bold">
            Tu
            <span className="ml-2 inline-block rotate-2 transform rounded-lg bg-accent px-4 py-2 text-foreground">
              Transformación
            </span>
          </h2>
          <p className="text-foreground">
            De donde estás ahora a donde quieres llegar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2">
          {/* Before */}
          <Card className="border-[2.5px] border-muted/50">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">
                Antes del Programa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <Target className="h-5 w-5" />
                <span>Developer anónimo sin reconocimiento</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <TrendingUp className="h-5 w-5" />
                <span>Ingresos limitados por salario</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Users className="h-5 w-5" />
                <span>Red profesional local limitada</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Brain className="h-5 w-5" />
                <span>Mentalidad de empleado</span>
              </div>
            </CardContent>
          </Card>

          {/* After */}
          <Card className="border-[2.5px] border-primary/50 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-primary">
                Después del Programa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <Award className="h-5 w-5 text-primary" />
                <span>Founder reconocido en Web3</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>Potencial de ingresos ilimitado</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Globe className="h-5 w-5 text-primary" />
                <span>Red global de 200+ builders</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Brain className="h-5 w-5 text-primary" />
                <span>Mentalidad de emprendedor</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Proof Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="px-4 text-center"
      >
        <Card className="mx-auto max-w-4xl border-accent/20 bg-accent/5">
          <CardContent className="pt-8">
            <blockquote className="mb-4 text-xl text-foreground italic">
              &ldquo;En 21 días pasé de ser un developer más a fundar mi startup
              y levantar $500K. La comunidad y metodología de Frutero Club
              cambiaron mi vida completamente.&rdquo;
            </blockquote>
            <div className="text-foreground">
              <strong>María González</strong> • Founder de TechVenture • Costa
              Rica
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
