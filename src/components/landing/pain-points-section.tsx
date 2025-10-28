import { CircleSlash, Infinity, TrendingDown } from 'lucide-react'
import { JSX, SVGProps } from 'react'

interface PainPoint {
  icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element
  text: string
  color: string
  ringColor: string
}

const painPoints: PainPoint[] = [
  {
    icon: (props) => <Infinity {...props} />,
    text: 'Saltas de tutorial en tutorial sin resultado claro ni certificación real',
    color: 'text-secondary',
    ringColor: 'ring-secondary/20',
  },
  {
    icon: (props) => <TrendingDown {...props} />,
    text: 'Quemas tiempo en proyectos basura que no construyen tu portafolio',
    color: 'text-primary',
    ringColor: 'ring-primary/20',
  },
  {
    icon: (props) => <CircleSlash {...props} />,
    text: 'Sientes que el esfuerzo no vale la pena porque nadie valora tu progreso',
    color: 'text-accent',
    ringColor: 'ring-accent/20',
  },
]

export default function PainPointsSection() {
  return (
    <section className="page bg-card/50 py-16 md:py-20">
      <div className="container gap-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            ¿Te suena familiar?
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 md:gap-8">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className="group flex flex-col items-start gap-6 rounded-2xl border-2 border-border bg-background p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg md:p-8"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full bg-card p-3 ring-4 ${point.ringColor} transition-transform duration-300 group-hover:scale-110`}
              >
                {point.icon({ className: `h-8 w-8 ${point.color}` })}
              </div>
              <p className="text-base text-foreground md:text-lg">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
