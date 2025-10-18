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
