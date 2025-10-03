import { Button } from '@/components/ui/button'
import { SparklesIcon } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="min-h-[70svh] w-full pt-12 pb-8 md:py-28 lg:py-20">
      <div className="container mx-auto space-y-8 px-4 text-center md:space-y-16 lg:space-y-8">
        {/* Título Principal */}
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl leading-tight font-semibold text-foreground md:text-5xl">
            Maximiza tu{' '}
            <span className="inline-block -rotate-2 transform rounded-lg bg-accent px-4 py-2 text-foreground">
              talento
            </span>
            <br />y rómpela en{' '}
            <span className="inline-block rotate-2 transform rounded-lg bg-secondary px-4 py-2 text-white">
              tech
            </span>
          </h1>
        </div>
        <p className="text-2xl text-muted-foreground md:text-3xl md:font-medium lg:text-2xl lg:font-medium">
          Somos el puente tecnológico entre el talento local y oportunidades
          globales
        </p>

        <p className="text-2xl text-muted-foreground md:text-3xl md:font-medium lg:text-2xl lg:font-medium">
          Ayúdamos a builders a construir con IA Ayúdamos a freelancers a
          conseguir chambas Ayúdamos a founders a lanzar su mvp Ayúdamos a
          startups a conectar con talento Ayúdamos a emprendedores a conseguir
          financiamiento Ayúdamos a estudiantes a obtener experiencia Ayúdamos a
          empresas a entrenar a sus equipos
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            size="xl"
            className="text-2xl font-medium transition duration-300 ease-in-out hover:scale-105 lg:px-14 lg:py-6"
          >
            Quiero unirme{' '}
            <SparklesIcon className="ml-2 h-5 w-5 fill-background" />
          </Button>
        </div>

        {/* Subtítulo */}
        <h3 className="mx-auto max-w-2xl text-left text-2xl leading-normal text-muted-foreground">
          🌱 Sube de nivel
          <br />
          🛠️ Cambia las reglas
          <br />
          🏆{' '}
          <span className="font-bold underline decoration-secondary decoration-4 underline-offset-4">
            Hackea
          </span>{' '}
          tu vida
        </h3>
      </div>
    </div>
  )
}
