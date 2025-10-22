'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Users,
  Target,
  Code,
  Database,
  Smartphone,
  Globe,
  Brain,
  Zap,
  Trophy,
  CheckCircle,
  Calendar,
  BookOpen,
  Rocket,
} from 'lucide-react'

interface Course {
  code: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  prerequisites?: string[]
  outcomes: string[]
}

interface DayFocus {
  day: number
  title: string
  description: string
  icon: React.ReactNode
}

interface WeekData {
  week: number
  theme: string
  subtitle: string
  duration: string
  commitment: string
  description: string
  courses: Course[]
  dailyFocus: DayFocus[]
  metrics: {
    label: string
    target: string
  }[]
  color: 'primary' | 'secondary' | 'accent'
}

interface TechCategory {
  category: string
  technologies: {
    name: string
    description: string
    icon: React.ReactNode
  }[]
}

interface VeranoCurriculumProps {
  className?: string
}

const weekData: WeekData[] = [
  {
    week: 1,
    theme: 'Fundamentos Potenciados por IA',
    subtitle: 'AI-Powered Foundations',
    duration: '7 días',
    commitment: '5-6 horas/día',
    description:
      'Domina las herramientas que aceleran tu desarrollo 10x. Desde AI hasta Web3, construye las bases de tu transformación.',
    color: 'primary',
    courses: [
      {
        code: 'VECH-101',
        title: 'AI Development Fundamentals',
        description:
          'Configuración y dominio de herramientas de IA para desarrollo acelerado',
        duration: '2 días',
        difficulty: 'Beginner',
        outcomes: [
          'Configurar Cursor IDE con AI',
          'Dominar ChatGPT y Claude para desarrollo',
          'Acelerar coding 5-10x con AI',
        ],
      },
      {
        code: 'VECH-102',
        title: 'Web3 & Blockchain Basics',
        description: 'Fundamentos de blockchain y ecosistema Web3',
        duration: '1.5 días',
        difficulty: 'Beginner',
        outcomes: [
          'Crear y configurar wallets',
          'Entender conceptos blockchain',
          'Interactuar con dApps',
        ],
      },
      {
        code: 'VECH-103',
        title: 'Farcaster Ecosystem Integration',
        description: 'Integración con la red social descentralizada Farcaster',
        duration: '1.5 días',
        difficulty: 'Intermediate',
        prerequisites: ['VECH-102'],
        outcomes: [
          'Configurar perfil Farcaster',
          'Desarrollar Mini Apps',
          'Integrar con Farcaster SDK',
        ],
      },
      {
        code: 'VECH-104',
        title: 'Team Formation & Public Building',
        description: 'Formación de equipos y construcción pública',
        duration: '1 día',
        difficulty: 'Beginner',
        outcomes: [
          'Formar equipos de 2-3 personas',
          'Definir roles y responsabilidades',
          'Iniciar #VeranoEnCadena posts',
        ],
      },
      {
        code: 'VECH-105',
        title: 'Base Blockchain Implementation',
        description: 'Desarrollo en Base (Ethereum L2)',
        duration: '1 día',
        difficulty: 'Intermediate',
        prerequisites: ['VECH-102'],
        outcomes: [
          'Deployer contratos en Base',
          'Registrar Basenames',
          'Integrar con Base SDK',
        ],
      },
    ],
    dailyFocus: [
      {
        day: 1,
        title: 'AI Tools Setup',
        description: 'Cursor IDE, ChatGPT, Claude',
        icon: <Brain className="h-5 w-5" />,
      },
      {
        day: 2,
        title: 'Web3 Wallet Creation',
        description: 'Wallets & Basenames',
        icon: <Globe className="h-5 w-5" />,
      },
      {
        day: 3,
        title: 'Farcaster Integration',
        description: 'Mini Apps Development',
        icon: <Smartphone className="h-5 w-5" />,
      },
      {
        day: 4,
        title: 'Team Formation',
        description: 'Project Planning',
        icon: <Users className="h-5 w-5" />,
      },
      {
        day: 5,
        title: 'Base Development',
        description: 'Blockchain Implementation',
        icon: <Code className="h-5 w-5" />,
      },
      {
        day: 6,
        title: 'Public Building',
        description: 'Social Media Strategy',
        icon: <Rocket className="h-5 w-5" />,
      },
      {
        day: 7,
        title: 'Week 1 Demo',
        description: 'Progress Presentation',
        icon: <Trophy className="h-5 w-5" />,
      },
    ],
    metrics: [
      { label: 'Wallets Created', target: '50+' },
      { label: 'Basenames Registered', target: '40+' },
      { label: 'Teams Formed', target: '15+' },
      { label: '#VeranoEnCadena Posts', target: '100+' },
    ],
  },
  {
    week: 2,
    theme: 'Desarrollo Intensivo',
    subtitle: 'Intensive Development',
    duration: '7 días',
    commitment: '6-8 horas/día',
    description:
      'Construye aplicaciones reales con tecnologías cutting-edge. Full-stack development con IA como tu co-pilot.',
    color: 'secondary',
    courses: [
      {
        code: 'VECH-201',
        title: 'Full-Stack Web Development with AI',
        description: 'Desarrollo full-stack acelerado con herramientas de IA',
        duration: '3 días',
        difficulty: 'Intermediate',
        prerequisites: ['VECH-101'],
        outcomes: [
          'Dominar NextJS 14 y React',
          'Desarrollar con AI assistance',
          'Implementar TypeScript',
        ],
      },
      {
        code: 'VECH-202',
        title: 'Blockchain Integration & Web3 Development',
        description: 'Integración avanzada con blockchain y Web3',
        duration: '2 días',
        difficulty: 'Advanced',
        prerequisites: ['VECH-102', 'VECH-105'],
        outcomes: [
          'Integrar wallets en apps',
          'Desarrollar dApps completas',
          'Implementar smart contracts',
        ],
      },
      {
        code: 'VECH-203',
        title: 'Farcaster Mini Apps Development',
        description: 'Desarrollo avanzado de Mini Apps para Farcaster',
        duration: '1 día',
        difficulty: 'Advanced',
        prerequisites: ['VECH-103', 'VECH-201'],
        outcomes: [
          'Crear Mini Apps complejas',
          'Integrar con Farcaster API',
          'Implementar social features',
        ],
      },
      {
        code: 'VECH-204',
        title: 'Database Design & Backend Architecture',
        description: 'Diseño de bases de datos y arquitectura backend',
        duration: '1 día',
        difficulty: 'Intermediate',
        prerequisites: ['VECH-201'],
        outcomes: [
          'Diseñar esquemas PostgreSQL',
          'Configurar Supabase',
          'Implementar APIs RESTful',
        ],
      },
    ],
    dailyFocus: [
      {
        day: 8,
        title: 'NextJS 14 Fundamentals',
        description: 'React & TypeScript',
        icon: <Code className="h-5 w-5" />,
      },
      {
        day: 9,
        title: 'Database Design',
        description: 'PostgreSQL & Supabase',
        icon: <Database className="h-5 w-5" />,
      },
      {
        day: 10,
        title: 'Farcaster SDK',
        description: 'Advanced Integration',
        icon: <Smartphone className="h-5 w-5" />,
      },
      {
        day: 11,
        title: 'Frontend Development',
        description: 'UI/UX Implementation',
        icon: <Globe className="h-5 w-5" />,
      },
      {
        day: 12,
        title: 'Backend APIs',
        description: 'API Development',
        icon: <Code className="h-5 w-5" />,
      },
      {
        day: 13,
        title: 'Full-Stack Integration',
        description: 'Connect Frontend & Backend',
        icon: <Zap className="h-5 w-5" />,
      },
      {
        day: 14,
        title: 'Testing & Deployment',
        description: 'Production Ready',
        icon: <CheckCircle className="h-5 w-5" />,
      },
    ],
    metrics: [
      { label: 'Apps Deployed', target: '100%' },
      { label: 'Users per App', target: '25+' },
      { label: 'Lighthouse Score', target: '90+' },
      { label: 'GitHub Commits', target: '50+' },
    ],
  },
  {
    week: 3,
    theme: 'Preparación para el Lanzamiento',
    subtitle: 'Launch Preparation & Competition',
    duration: '7 días',
    commitment: '8-10 horas/día',
    description:
      'Convierte tu MVP en un producto competitivo. Estrategia de lanzamiento y participación en Onchain Summer.',
    color: 'accent',
    courses: [
      {
        code: 'VECH-301',
        title: 'Product Optimization & Professional Polish',
        description: 'Optimización de producto y pulimiento profesional',
        duration: '2 días',
        difficulty: 'Advanced',
        prerequisites: ['VECH-201', 'VECH-202'],
        outcomes: [
          'Optimizar performance',
          'Mejorar UX/UI',
          'Implementar analytics',
        ],
      },
      {
        code: 'VECH-302',
        title: 'Growth Engineering & Traction Systems',
        description: 'Ingeniería de crecimiento y sistemas de tracción',
        duration: '2 días',
        difficulty: 'Advanced',
        prerequisites: ['VECH-301'],
        outcomes: [
          'Implementar growth loops',
          'Configurar métricas',
          'Desarrollar user acquisition',
        ],
      },
      {
        code: 'VECH-303',
        title: 'Storytelling & Demo Production',
        description: 'Narrativa y producción de demos',
        duration: '1.5 días',
        difficulty: 'Intermediate',
        outcomes: [
          'Crear pitch deck',
          'Producir demo video',
          'Desarrollar storytelling',
        ],
      },
      {
        code: 'VECH-304',
        title: 'Launch Management & PR Strategy',
        description: 'Gestión de lanzamiento y estrategia de PR',
        duration: '1 día',
        difficulty: 'Advanced',
        outcomes: [
          'Planificar launch strategy',
          'Ejecutar PR campaign',
          'Coordinar media outreach',
        ],
      },
      {
        code: 'VECH-305',
        title: 'Competition Strategy & Positioning',
        description: 'Estrategia competitiva y posicionamiento',
        duration: '0.5 días',
        difficulty: 'Advanced',
        outcomes: [
          'Preparar Onchain Summer',
          'Optimizar positioning',
          'Finalizar submission',
        ],
      },
    ],
    dailyFocus: [
      {
        day: 15,
        title: 'Product Polish',
        description: 'Optimization & Performance',
        icon: <Zap className="h-5 w-5" />,
      },
      {
        day: 16,
        title: 'Growth Strategy',
        description: 'User Acquisition',
        icon: <Target className="h-5 w-5" />,
      },
      {
        day: 17,
        title: 'Demo Production',
        description: 'Video & Storytelling',
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        day: 18,
        title: 'PR Strategy',
        description: 'Media Outreach',
        icon: <Globe className="h-5 w-5" />,
      },
      {
        day: 19,
        title: 'Competition Prep',
        description: 'Onchain Summer',
        icon: <Trophy className="h-5 w-5" />,
      },
      {
        day: 20,
        title: 'Launch Day',
        description: 'Coordination & Execution',
        icon: <Rocket className="h-5 w-5" />,
      },
      {
        day: 21,
        title: 'Results Analysis',
        description: 'Next Steps Planning',
        icon: <CheckCircle className="h-5 w-5" />,
      },
    ],
    metrics: [
      { label: 'Launch Impressions', target: '1000+' },
      { label: 'Media Mentions', target: '5+' },
      { label: 'Lighthouse Score', target: '95+' },
      { label: 'Onchain Summer', target: 'Submitted' },
    ],
  },
]

const techStack: TechCategory[] = [
  {
    category: 'AI Tools',
    technologies: [
      {
        name: 'Cursor IDE',
        description: 'AI-powered code editor',
        icon: <Brain className="h-6 w-6" />,
      },
      {
        name: 'ChatGPT',
        description: 'AI assistant for development',
        icon: <Brain className="h-6 w-6" />,
      },
      {
        name: 'Claude',
        description: 'Advanced AI for complex tasks',
        icon: <Brain className="h-6 w-6" />,
      },
    ],
  },
  {
    category: 'Frontend',
    technologies: [
      {
        name: 'NextJS 14',
        description: 'React framework',
        icon: <Code className="h-6 w-6" />,
      },
      {
        name: 'React',
        description: 'UI library',
        icon: <Code className="h-6 w-6" />,
      },
      {
        name: 'TypeScript',
        description: 'Type-safe JavaScript',
        icon: <Code className="h-6 w-6" />,
      },
      {
        name: 'TailwindCSS',
        description: 'Utility-first CSS',
        icon: <Code className="h-6 w-6" />,
      },
    ],
  },
  {
    category: 'Backend',
    technologies: [
      {
        name: 'PostgreSQL',
        description: 'Relational database',
        icon: <Database className="h-6 w-6" />,
      },
      {
        name: 'Supabase',
        description: 'Backend as a service',
        icon: <Database className="h-6 w-6" />,
      },
    ],
  },
  {
    category: 'Blockchain',
    technologies: [
      {
        name: 'Base',
        description: 'Ethereum L2',
        icon: <Globe className="h-6 w-6" />,
      },
      {
        name: 'Farcaster',
        description: 'Decentralized social',
        icon: <Smartphone className="h-6 w-6" />,
      },
    ],
  },
]

function WeekTimeline({
  week,
  isActive,
  onClick,
}: {
  week: WeekData
  isActive: boolean
  onClick: () => void
}) {
  const colorClasses = {
    primary: isActive
      ? 'bg-primary text-primary-foreground'
      : 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: isActive
      ? 'bg-secondary text-secondary-foreground'
      : 'bg-secondary/10 text-secondary hover:bg-secondary/20',
    accent: isActive
      ? 'bg-accent text-accent-foreground'
      : 'bg-accent/10 text-accent hover:bg-accent/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: week.week * 0.1 }}
      className="flex cursor-pointer flex-col items-center"
      onClick={onClick}
    >
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold transition-all duration-300',
          colorClasses[week.color],
        )}
      >
        {week.week}
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold">{week.duration}</div>
        <div className="text-xs text-foreground">{week.commitment}</div>
      </div>
    </motion.div>
  )
}

function CourseCard({
  course,
  isExpanded,
  onToggle,
}: {
  course: Course
  isExpanded: boolean
  onToggle: () => void
}) {
  const difficultyColors = {
    Beginner: 'text-accent',
    Intermediate: 'text-primary',
    Advanced: 'text-secondary',
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm text-foreground">
              {course.code}
            </div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                difficultyColors[course.difficulty],
              )}
            >
              {course.difficulty}
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
        <p className="text-sm text-foreground">{course.description}</p>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Learning Outcomes</h4>
                  <ul className="space-y-1">
                    {course.outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-foreground" />
                    <span className="text-sm">Duration: {course.duration}</span>
                  </div>
                  {course.prerequisites && (
                    <div>
                      <h4 className="mb-1 text-sm font-semibold">
                        Prerequisites
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {course.prerequisites.map((prereq, i) => (
                          <span
                            key={i}
                            className="rounded bg-muted px-2 py-1 font-mono text-xs"
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function TechStackGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {techStack.map((category, i) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="text-primary">{tech.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{tech.name}</div>
                    <div className="text-xs text-foreground">
                      {tech.description}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export function VeranoCurriculum({ className }: VeranoCurriculumProps) {
  const [activeWeek, setActiveWeek] = useState(1)
  const [expandedCourses, setExpandedCourses] = useState<string[]>([])

  const toggleCourse = (courseCode: string) => {
    setExpandedCourses((prev) =>
      prev.includes(courseCode)
        ? prev.filter((code) => code !== courseCode)
        : [...prev, courseCode],
    )
  }

  const currentWeek = weekData.find((w) => w.week === activeWeek)!

  return (
    <section className={cn('space-y-12 pt-16 md:pt-8', className)}>
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4">
            <span className="font-bold underline decoration-secondary decoration-4 underline-offset-4">
              21 Días
            </span>{' '}
            para dominar el Futuro
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-foreground">
            El curriculum más intensivo de Centroamérica. Transformación
            acelerada por IA de developer a founder en 3 semanas.
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <div className="mb-12 flex items-center justify-center gap-8 md:gap-16">
          {weekData.map((week) => (
            <WeekTimeline
              key={week.week}
              week={week}
              isActive={activeWeek === week.week}
              onClick={() => setActiveWeek(week.week)}
            />
          ))}
        </div>

        {/* Week Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWeek}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold">
                Semana {currentWeek.week}: {currentWeek.theme}
              </h3>
              <p className="mb-4 text-lg text-foreground">
                {currentWeek.description}
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{currentWeek.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentWeek.commitment}</span>
                </div>
              </div>
            </div>

            {/* Daily Focus */}
            <div className="mb-8">
              <h4 className="mb-4 text-center text-lg font-semibold">
                Enfoque Diario
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-7">
                {currentWeek.dailyFocus.map((day, i) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="rounded-lg bg-muted/30 p-3 text-center transition-colors hover:bg-muted/50"
                  >
                    <div className="mb-2 flex justify-center text-primary">
                      {day.icon}
                    </div>
                    <div className="text-sm font-medium">Día {day.day}</div>
                    <div className="text-xs font-semibold">{day.title}</div>
                    <div className="text-xs text-foreground">
                      {day.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div className="mb-8">
              <h4 className="mb-4 text-lg font-semibold">Cursos Principales</h4>
              <div className="space-y-4">
                {currentWeek.courses.map((course, i) => (
                  <motion.div
                    key={course.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <CourseCard
                      course={course}
                      isExpanded={expandedCourses.includes(course.code)}
                      onToggle={() => toggleCourse(course.code)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {currentWeek.metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="rounded-lg bg-muted/30 p-4 text-center"
                >
                  <div className="text-2xl font-bold text-primary">
                    {metric.target}
                  </div>
                  <div className="text-sm text-foreground">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Technology Stack */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h3 className="mb-2 text-2xl font-bold">Stack Tecnológico</h3>
          <p className="text-foreground">
            Herramientas y tecnologías que dominarás durante el programa
          </p>
        </motion.div>

        <TechStackGrid />
      </div>

      {/* Support System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Card className="mx-auto max-w-4xl border-primary/20 bg-primary/5">
          <CardContent className="pt-8">
            <h3 className="mb-4 text-2xl font-bold">Sistema de Apoyo 24/7</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <Users className="mb-2 h-8 w-8 text-primary" />
                <h4 className="font-semibold">Comunidad Discord</h4>
                <p className="text-sm text-foreground">200+ builders activos</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="mb-2 h-8 w-8 text-primary" />
                <h4 className="font-semibold">Office Hours</h4>
                <p className="text-sm text-foreground">
                  12:00 PM y 8:00 PM CST
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Target className="mb-2 h-8 w-8 text-primary" />
                <h4 className="font-semibold">Mentoría 1:1</h4>
                <p className="text-sm text-foreground">
                  Sesiones personalizadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
