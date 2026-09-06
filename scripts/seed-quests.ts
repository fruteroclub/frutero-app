/**
 * Seed quests for JAM Platform
 */

import { db } from '../src/db'
import { quests } from '../src/db/schema'

const sampleQuests = [
  // Individual Quests - Easy
  {
    title: 'Completa tu Perfil',
    description: 'Añade tu foto, bio, habilidades y links de redes sociales a tu perfil.',
    category: 'learning',
    difficulty: 'easy',
    questType: 'INDIVIDUAL',
    rewardPoints: 50,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    bountyUsd: null,
    maxSubmissions: null,
    requirements: [
      'Tener cuenta activa en la plataforma',
      'Acceso a foto de perfil o avatar',
      'Links de redes sociales o GitHub',
    ],
    deliverables: [
      'Foto de perfil subida',
      'Bio completa (mínimo 50 caracteres)',
      'Al menos 2 links de redes sociales o GitHub',
      'Habilidades técnicas añadidas (mínimo 3)',
    ],
  },
  {
    title: 'Primera Publicación Build-in-Public',
    description: 'Comparte tu progreso o aprendizaje en la comunidad. Incluye qué estás construyendo y qué has aprendido.',
    category: 'community',
    difficulty: 'easy',
    questType: 'INDIVIDUAL',
    rewardPoints: 75,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    bountyUsd: null,
    maxSubmissions: null,
    requirements: [
      'Tener proyecto o aprendizaje activo para compartir',
      'Acceso a la sección de comunidad',
    ],
    deliverables: [
      'Post publicado en la comunidad',
      'Incluir qué estás construyendo',
      'Compartir al menos un aprendizaje o desafío',
      'Añadir imagen o screenshot (opcional pero recomendado)',
    ],
  },

  // Individual Quests - Medium
  {
    title: 'Deploy Smart Contract en Base',
    description: 'Crea y despliega un smart contract simple en Base L2. Puede ser un contrato de ejemplo o parte de tu proyecto.',
    category: 'technical',
    difficulty: 'medium',
    questType: 'BOTH',
    rewardPoints: 200,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    bountyUsd: 100,
    maxSubmissions: 10,
    requirements: [
      'Conocimiento básico de Solidity',
      'Wallet configurada para Base L2',
      'Fondos para gas (al menos 0.001 ETH)',
      'Entorno de desarrollo (Hardhat, Foundry, o Remix)',
    ],
    deliverables: [
      'Código del smart contract en GitHub',
      'Dirección del contrato desplegado en Base',
      'Link a block explorer (Basescan)',
      'Breve documentación del contrato y su función',
    ],
  },
  {
    title: 'Integración de Wallet',
    description: 'Añade autenticación con wallet a tu aplicación. Usa Privy, Wagmi, o similar.',
    category: 'technical',
    difficulty: 'medium',
    questType: 'BOTH',
    rewardPoints: 150,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    bountyUsd: 50,
    maxSubmissions: 15,
    requirements: [
      'Aplicación web existente',
      'Conocimiento básico de Web3',
      'Cuenta en Privy o servicio similar',
    ],
    deliverables: [
      'Botón de conexión de wallet implementado',
      'Manejo de estado de autenticación',
      'Código en GitHub',
      'Screenshot o video de la funcionalidad',
    ],
  },

  // Team Quests - Hard
  {
    title: 'Lanza tu MVP',
    description: 'Despliega la primera versión de tu producto en producción. Debe ser accesible públicamente y funcional.',
    category: 'project',
    difficulty: 'hard',
    questType: 'TEAM',
    rewardPoints: 500,
    start: new Date(),
    end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    bountyUsd: 500,
    maxSubmissions: 5,
    requirements: [
      'Proyecto con idea validada',
      'Equipo con roles definidos',
      'Stack tecnológico decidido',
      'Dominio y hosting configurados',
    ],
    deliverables: [
      'URL pública del producto funcionando',
      'Video demo (2-3 minutos) mostrando funcionalidad',
      'README con instrucciones de uso',
      'Métricas básicas: tiempo de carga, core features implementadas',
      'Feedback de al menos 5 usuarios de prueba',
    ],
  },
  {
    title: 'Consigue tus Primeros 10 Usuarios',
    description: 'Valida tu MVP con usuarios reales. Documenta feedback y métricas de uso.',
    category: 'project',
    difficulty: 'hard',
    questType: 'TEAM',
    rewardPoints: 400,
    start: new Date(),
    end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    bountyUsd: 300,
    maxSubmissions: 8,
    requirements: [
      'MVP lanzado y accesible',
      'Plan de adquisición de usuarios',
      'Herramientas de tracking configuradas',
    ],
    deliverables: [
      'Lista de 10 usuarios con contactos',
      'Documento con feedback de cada usuario',
      'Métricas de uso (sesiones, features usadas, tiempo)',
      'Screenshots o videos de usuarios usando el producto',
      'Plan de mejoras basado en feedback',
    ],
  },

  // Community Quests
  {
    title: 'Ayuda a 3 Builders',
    description: 'Responde preguntas, revisa código, o comparte feedback con otros builders de la comunidad.',
    category: 'community',
    difficulty: 'easy',
    questType: 'INDIVIDUAL',
    rewardPoints: 100,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    bountyUsd: null,
    maxSubmissions: null,
    requirements: [
      'Experiencia en al menos un área técnica',
      'Participación activa en la comunidad',
    ],
    deliverables: [
      'Links a 3 interacciones donde ayudaste (posts, reviews, comentarios)',
      'Breve descripción de cómo ayudaste en cada caso',
    ],
  },

  // Learning Quests
  {
    title: 'Tutorial de Next.js 15',
    description: 'Completa el tutorial oficial de Next.js 15 y comparte lo que aprendiste.',
    category: 'learning',
    difficulty: 'medium',
    questType: 'INDIVIDUAL',
    rewardPoints: 150,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
    bountyUsd: null,
    maxSubmissions: null,
    requirements: [
      'Conocimiento básico de React',
      'Node.js instalado',
    ],
    deliverables: [
      'Proyecto del tutorial completado en GitHub',
      'Post compartiendo 3 aprendizajes clave',
      'Screenshots del proyecto funcionando',
    ],
  },
  {
    title: 'Aprende Solidity Básico',
    description: 'Completa un curso de Solidity básico. Crea al menos 2 contratos de práctica.',
    category: 'learning',
    difficulty: 'medium',
    questType: 'INDIVIDUAL',
    rewardPoints: 175,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    bountyUsd: null,
    maxSubmissions: null,
    requirements: [
      'Conocimiento básico de programación',
      'Entorno de desarrollo Solidity (Remix o Hardhat)',
    ],
    deliverables: [
      'Link al curso completado (certificado si aplica)',
      '2 contratos de práctica en GitHub',
      'README explicando qué hace cada contrato',
    ],
  },

  // Technical Quests
  {
    title: 'Setup CI/CD Pipeline',
    description: 'Configura GitHub Actions o similar para tu proyecto. Incluye tests y deploy automático.',
    category: 'technical',
    difficulty: 'medium',
    questType: 'TEAM',
    rewardPoints: 200,
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    availableFrom: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    bountyUsd: 150,
    maxSubmissions: 10,
    requirements: [
      'Proyecto en GitHub',
      'Tests existentes (al menos básicos)',
      'Entorno de deployment configurado',
    ],
    deliverables: [
      'Archivo de workflow (.github/workflows)',
      'Pipeline ejecutándose exitosamente',
      'README documentando el proceso CI/CD',
      'Badge de build status en el README',
    ],
  },
]

async function seedQuests() {
  console.log('🌱 Seeding quests...')

  try {
    // Insert all quests
    const inserted = await db.insert(quests).values(sampleQuests).returning()

    console.log(`✅ Successfully seeded ${inserted.length} quests`)
    console.log('Quests created:')
    inserted.forEach((quest) => {
      console.log(`  - ${quest.title} (${quest.questType}, ${quest.difficulty})`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding quests:', error)
    process.exit(1)
  }
}

seedQuests()
