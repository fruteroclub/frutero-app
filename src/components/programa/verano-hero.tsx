'use client'

import { JSX, SVGProps, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Play,
  BitcoinIcon,
  BrainCircuitIcon,
  HandMetalIcon,
} from 'lucide-react'
import { CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import IconCard from '@/components/stats/icon-card'
import Image from 'next/image'

interface VeranoHeroProps {
  deadline: Date
  onCtaClick: () => void
  onVideoClick?: () => void
}

function CountdownTimer({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = deadline.getTime() - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  return (
    <div className="flex items-center gap-6 text-center font-mono">
      {/* Days */}
      <div className="flex flex-col">
        <span className="text-5xl font-medium">
          {timeLeft.days.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-background/75 uppercase lg:text-foreground">
          days
        </span>
      </div>

      {/* Hours:Minutes:Seconds */}
      <div className="flex flex-col text-primary">
        <div className="flex items-center text-5xl font-medium">
          <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="mx-1 text-4xl">:</span>
          <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="mx-1 text-4xl">:</span>
          <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
        </div>
        <div className="flex items-center justify-between text-xs uppercase">
          <span>hours</span>
          <span className="mx-1 opacity-0">:</span>
          <span>minutes</span>
          <span className="mx-1 opacity-0">:</span>
          <span>seconds</span>
        </div>
      </div>
    </div>
  )
}

// function AnimatedStat({ item, delay = 0 }: { item: StatsItem; delay?: number }) {
//   const [count, setCount] = useState(0)

//   useEffect(() => {
//     const duration = 2000 // 2 seconds
//     const steps = 60
//     const increment = item.value / steps
//     let current = 0
//     let step = 0

//     const timer = setInterval(() => {
//       current += increment
//       step++

//       if (step === steps) {
//         setCount(item.value)
//         clearInterval(timer)
//       } else {
//         setCount(Math.floor(current))
//       }
//     }, duration / steps)

//     return () => clearInterval(timer)
//   }, [item.value])

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay }}
//       className="flex flex-col items-center text-center"
//     >
//       <span className="text-3xl font-bold">
//         {item.prefix}
//         {count}
//         {item.suffix}
//       </span>
//       <span className="text-sm text-foreground">{item.description}</span>
//     </motion.div>
//   )
// }

const stats = [
  {
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <BrainCircuitIcon strokeWidth={1} {...props} />
    ),
    label: 'Inteligencia Artificial',
  },
  {
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <BitcoinIcon strokeWidth={1} {...props} />
    ),
    label: 'Negocios Digitales',
  },
  {
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <HandMetalIcon strokeWidth={1} {...props} />
    ),
    label: 'Cultura de Internet',
  },
]
const statsSmallViewport = [
  {
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <BrainCircuitIcon {...props} />
    ),
    label: 'Inteligencia Artificial',
  },
  {
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <BitcoinIcon {...props} />
    ),
    label: 'Negocios Digitales',
  },
  {
    icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
      <HandMetalIcon {...props} />
    ),
    label: 'Cultura de Internet',
  },
]

export function VeranoHero({
  deadline,
  onCtaClick,
  onVideoClick,
}: VeranoHeroProps) {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-slot="card"
        className="flex flex-col gap-4 rounded-xl bg-foreground pb-6 text-background lg:grid lg:grid-cols-2 lg:gap-x-0 lg:bg-transparent"
      >
        <Image
          src="/images/programa/verano-en-cadena.jpg"
          alt="Verano En Cadena"
          width={500}
          height={500}
          className="w-full rounded-t-xl lg:rounded-t-none lg:rounded-l-xl lg:rounded-r-none"
        />

        <CardHeader className="space-y-8 lg:flex lg:flex-col lg:justify-center lg:rounded-r-xl lg:bg-foreground lg:px-8">
          <div className="flex flex-col gap-y-0">
            <h1 className="my-0 text-center font-medium text-primary lg:text-left">
              Verano En Cadena
            </h1>
            <h3 className="text-center lg:text-left">
              De Cero a Impacto <br />
              en solo <span className="subrayado">3 Semanas</span>
            </h3>
          </div>
          <div className="flex w-full justify-center">
            <Button
              size="lg"
              onClick={onCtaClick}
              className="group font-semibold text-foreground"
            >
              Regístrate Ahora
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex w-full flex-col items-center lg:col-span-2">
          {/* Stats */}
          <div className="grid w-full grid-cols-1 gap-4 p-4 md:hidden">
            {statsSmallViewport.map((stat) => (
              <IconCard
                className="bg-transparent py-0 text-background"
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
              />
            ))}
          </div>
          <div className="hidden grid-cols-3 gap-2 md:grid md:w-full md:py-2 lg:max-w-screen-sm">
            {stats.map((stat) => (
              <IconCard
                className="border-none bg-transparent text-background md:py-0 lg:text-primary lg:shadow-none"
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
              />
            ))}
          </div>
          <div className="flex w-full justify-center md:py-2">
            <Button
              variant="ghost"
              onClick={onVideoClick}
              className="group text-background lg:text-foreground"
            >
              Ver Programa Completo
              <Play className="ml-2 h-5 w-5 fill-primary text-primary transition-transform group-hover:scale-110" />
            </Button>
          </div>
        </CardContent>
        {/* CTAs */}
        <CardFooter className="flex w-full flex-col items-center gap-6 py-4 sm:flex-row sm:justify-center lg:col-span-2 lg:text-foreground">
          {/* Countdown */}
          <div className="flex flex-col items-center gap-1 md:pb-8">
            <span className="text-lg font-medium">
              Aplicaciones cierran en:
            </span>
            <CountdownTimer deadline={deadline} />
          </div>
        </CardFooter>
      </motion.div>
    </div>
  )
}
