'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: '¿Qué es $PULPA?',
    answer:
      '$PULPA es el token comunitario de Frutero que convierte tus contribuciones en valor económico real. Cada acción que eleva a la comunidad - desde asistir a eventos hasta compartir conocimiento - es recompensada con $PULPA que puedes usar para acceder a oportunidades exclusivas.',
  },
  {
    question: '¿Cómo empiezo a ganar $PULPA?',
    answer:
      'Hay múltiples formas: asiste a workshops (10 $PULPA), participa en hackathons (50+ $PULPA), completa proyectos del programa H2F (200-500 $PULPA), contribuye a repos (20-100 $PULPA), o incluso envía mensajes "GM" consistentemente (1 $PULPA). Todas las actividades son validadas por moderadores y mentores.',
  },
  {
    question: '¿Dónde puedo usar mis tokens $PULPA?',
    answer:
      'Usa $PULPA para acceso premium (250 $PULPA/mes), mentorías personalizadas (50-100 $PULPA/hora), viajes a hackathons (200-2000 $PULPA), co-working spaces (20-200 $PULPA), participar en gobernanza comunitaria, y acceder a la red de seguridad en casos de emergencia.',
  },
  {
    question: '¿Cuál es el valor de 1 $PULPA?',
    answer:
      'El valor inicial de referencia es 1 $PULPA = $1 USD. Este valor puede variar basado en la dinámica del mercado una vez que el token esté disponible para intercambio público en Optimism.',
  },
  {
    question: '¿Qué blockchain usa $PULPA?',
    answer:
      '$PULPA está desplegado en Optimism, una Layer 2 de Ethereum. Optimism ofrece transacciones rápidas y económicas, ideales para el uso comunitario frecuente del token.',
  },
  {
    question: '¿Cómo funciona la red de seguridad?',
    answer:
      'La red de seguridad es un fondo comunitario para apoyar miembros en situaciones de emergencia. Las solicitudes son validadas por la comunidad y otorgadas sin intereses. Los beneficiarios reintegran cuando pueden, contribuyendo doblemente al ecosistema.',
  },
  {
    question: '¿Qué es la gobernanza con $PULPA?',
    answer:
      'Tu balance de $PULPA te da poder de voto en decisiones comunitarias: dirección del programa, distribución de recursos, iniciativas nuevas, y más. Mientras más contribuyes y más $PULPA acumulas, más influencia tienes en el futuro de Frutero.',
  },
  {
    question: '¿Puedo vender o intercambiar $PULPA?',
    answer:
      'Sí, $PULPA es intercambiable en Uniswap y otros DEXs en Optimism. Sin embargo, el valor principal de $PULPA viene de su utilidad dentro del ecosistema Frutero - acceso a oportunidades que aceleran tu crecimiento profesional.',
  },
  {
    question: '¿Hay un límite de $PULPA que puedo ganar?',
    answer:
      'No hay límite máximo. Mientras más contribuyas, más ganas. Los miembros más activos han acumulado 3,000+ $PULPA, lo que les da acceso a todas las oportunidades premium y voz significativa en la gobernanza.',
  },
  {
    question: '¿Cómo se valida que gané $PULPA?',
    answer:
      'Todas las actividades son verificadas por moderadores y mentores de la comunidad. Para eventos, se confirma tu asistencia. Para contribuciones técnicas, se revisa la calidad del trabajo. Para contenido, se evalúa el impacto. El proceso es transparente y apelable.',
  },
]

export default function PulpaFAQSection() {
  return (
    <div className="page">
      <div className="container gap-y-6 lg:gap-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Preguntas frecuentes sobre <span className="text-primary">$PULPA</span>
          </h2>
        </div>

        <div className="section">
          <FaqAccordion />
        </div>

        {/* Additional Help */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            ¿Tienes más preguntas?{' '}
            <a
              href="https://discord.gg/frutero"
              className="text-primary hover:underline font-medium"
            >
              Únete a Discord
            </a>{' '}
            y pregúntale a la comunidad
          </p>
        </div>
      </div>
    </div>
  )
}

function FaqAccordion() {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(-1)

  function handleItemChange(index: string) {
    if (openQuestionIndex === parseInt(index)) {
      setOpenQuestionIndex(-1)
    } else {
      setOpenQuestionIndex(parseInt(index))
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      onValueChange={(value) => handleItemChange(value)}
    >
      {faqs.map((faq, index) => (
        <AccordionItem
          className="px-4 bg-card"
          key={`faq-question-${index}`}
          value={index.toString()}
        >
          <AccordionTrigger className="w-full">
            <h4 className="w-[95%] font-funnel text-lg">{faq.question}</h4>
            <div className="flex w-[5%] justify-end">
              {openQuestionIndex == index ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
