import { db, client } from '../src/db'
import { users, profiles, mentorProfiles } from '../src/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Seed script for Frutero Club mentors
 * Uses real mentor data from /club page
 */

interface MentorData {
  name: string
  username: string
  description: string
  socialNetworks: string[]
  avatar: string
  calendarUrl: string
  email: string
  roles: string[]
}

const mentorData: MentorData[] = [
  {
    name: 'Robin',
    username: 'robinhodl69',
    description:
      'Project Manager y CEO de Psy Labs, equipo especializado en el desarrollo de soluciones web3. Expertise en gestión de productos. Liderando proyectos, como la creación de una aplicación de lending y borrowing en Vara Network, financiada mediante un grant y actualmente en fase de testnet. Seleccionado para la incubadora Polkadot Relayers en Singapur 2023  y ganador del primer lugar en el track de Vara Network durante ETH Global Bruselas 2024. Apasionado por DeFi y la integración de inteligencia artificial en blockchain.',
    socialNetworks: [
      'https://twitter.com/robinhodl69',
      'https://www.linkedin.com/in/jaramillojesuslini/',
    ],
    avatar: '/images/mentores/robinhodl69.jpg',
    calendarUrl: 'https://calendly.com/robinhodl',
    email: 'jaramillo.jesusj@gmail.com',
    roles: ['hacker', 'founder', 'mentor'],
  },
  {
    name: 'Julio Cruz',
    username: 'JulioMCruz',
    description:
      'Ingeniero de software experto en blockchain y soluciones cloud, con experiencia en proyectos corporativos, gubernamentales y financieros en América Latina y EE. UU. Especialista en sistemas escalables, identidad digital, contratos inteligentes y migración a arquitecturas descentralizadas, impulsando la transformación digital con liderazgo e innovación.',
    socialNetworks: [
      'https://x.com/JulioMCruz',
      'https://warpcast.com/juliomcruz',
      'https://t.me/JulioMCruz',
    ],
    avatar: '/images/mentores/JulioMCruz.png',
    calendarUrl: 'https://calendly.com/juliomcruz/30min',
    email: 'Julio.cruz@eb-ms.net',
    roles: ['hacker', 'mentor'],
  },
  {
    name: 'Germán',
    username: 'ariutokintumi',
    description: 'Logic, Architecture, UX, Product. RollaMate.io Founder.',
    socialNetworks: ['https://x.com/ariutokintumi'],
    avatar: '/images/mentores/ariutokintumi.jpg',
    calendarUrl: '',
    email: 'german@zonalibre.com.uy',
    roles: ['hacker', 'founder', 'mentor'],
  },
  {
    name: 'Sury Bonfil',
    username: 'SuryBonfil',
    description:
      'Sury Bonfil. Mexicana, especialista en marketing digital y diseño. He participado en cuatro hackathons de ETHGlobal, en México, Colombia y Bangkok, También en varios más como Ethereum Argentina y hackathons online, en roles de diseño, marketing y Project Manager. Fui mentora en los hackathons de OpenWebAcademy y Vara en 2023, enfocándome en el área de pitch. Mi experiencia y especialidad radican en ayudar a los equipos a preparar presentaciones claras y estratégicas, cubriendo los puntos clave para un pitch exitoso en hackathons.',
    socialNetworks: ['https://x.com/holaNFT'],
    avatar: '/images/mentores/SuryBonfil.jpg',
    calendarUrl: 'https://calendly.com/surybonfil',
    email: 'surybonfilmarketing@gmail.com',
    roles: ['hacker', 'mentor'],
  },
  {
    name: 'Víctor',
    username: 'victorxva',
    description:
      'Diseño Multidisciplinar (Visual, Branding, Pitch Decks...) ETHDenver 2024 Finalist, +10 EthGlobal Tracks, +3 years web3 experience',
    socialNetworks: ['https://x.com/victorxva'],
    avatar: '/images/mentores/victorxva.jpg',
    calendarUrl: 'https://calendly.com/victorxva/1-1-meeting',
    email: 'victordelval16@gmail.com',
    roles: ['hacker', 'mentor'],
  },
  {
    name: 'Michael',
    username: 'michsoftster',
    description:
      'Experiencia en desarrollo de videojuegos, profesor del diplomado Diseño y Programación de Videojuegos en FI | UNAM, embajador senior Vara Network.',
    socialNetworks: ['https://x.com/michsoftster'],
    avatar: '/images/mentores/michsoftster.jpg',
    calendarUrl: 'https://calendly.com/michsoftster/mentor-hours',
    email: 'michsoftster@gmail.com',
    roles: ['hacker', 'mentor'],
  },
  {
    name: 'Rafa',
    username: '0xrafacc',
    description:
      'Software developer, previously working at PWN DAO, currently working at OdiseaLabs. Experienced in working with international teams in blockchain startups and programming trading strategies in crypto investment funds between CEXes and DEXes.',
    socialNetworks: ['https://www.youtube.com/@rafacanseco'],
    avatar: '/images/mentores/0xrafacc.jpg',
    calendarUrl: 'https://calendly.com/rafa-canseco/30min',
    email: 'rafa@odisea.xyz',
    roles: ['hacker', 'mentor'],
  },
  {
    name: 'Diana Castillo',
    username: 'dianalaucst',
    description:
      'Diana se ha destacado en el ámbito de la innovación digital. Su trayectoria abarca múltiples roles de liderazgo donde ha demostrado su capacidad para impulsar el crecimiento orgánico y posicionar startups en etapa temprana, desarrollando estrategias multicanal. Además de sus logros en el sector privado, ha dedicado tiempo y esfuerzo a proyectos de impacto social.Fungió como directora de operaciones de una iniciativa centrada en la educación, ha implementado el modelo STEM en varios proyectos, demostrando su compromiso con la educación y el desarrollo comunitario. Su participación en hackathones y su enfoque en el desarrollo tecnológico, demuestran su habilidad para pensar creativamente y resolver problemas de manera efectiva. Con una sólida formación académica en contabilidad, Diana ha combinado su experiencia práctica con un profundo conocimiento teórico, lo que la llevó a cofundar Goblin, la startup que soluciona tus problemas de la vida adulta, empezando con ponerte al día con el SAT.',
    socialNetworks: ['https://x.com/dianalaucst'],
    avatar: '/images/mentores/dianalaucst.jpg',
    calendarUrl: 'https://calendly.com/hola-goblintax/30min',
    email: 'hola@goblintax.com',
    roles: ['hacker', 'mentor', 'founder'],
  },
  {
    name: 'Emmi',
    username: 'Emmi',
    description:
      'Experiencia en productos DeFi y Tokenización, 4 años de experiencia en web3, colaboraciones con The Graph y Bitcoin Address Services (prev) conocimiento en smart contracts y desarrollo blockchain. Core team de Ethereum Bolivia y Graphtronauts, tengo un podcast :D ',
    socialNetworks: ['https://x.com/emmilili_eth'],
    avatar: '/images/mentores/emmi.jpg',
    calendarUrl: '',
    email: 'emmilili.04@gmail.com',
    roles: ['hacker', 'mentor'],
  },
  {
    name: 'Carlos',
    username: 'haycarlitos',
    description: 'Co-founder, CEO @hichipipay, YC alumni, Shark Tank Mx s.7',
    socialNetworks: ['https://x.com/haycarlitos'],
    avatar: '/images/mentores/haycarlitos.jpg',
    calendarUrl: 'https://calendly.com/chipipay/1-1',
    email: 'carlos@diosplan.com',
    roles: ['hacker', 'founder', 'mentor'],
  },
  {
    name: 'Robert',
    username: 'RobertoYamanaka',
    description: '⁠⁠Product at ChipiPay | Buildspace Finalist | Full Stack Dev',
    socialNetworks: [],
    avatar: '/images/mentores/RobertoYamanaka.jpg',
    calendarUrl: '',
    email: 'calendly.com/roberto-yamanaka/30min',
    roles: ['hacker', 'founder', 'mentor'],
  },
  {
    name: 'Tony',
    username: 'toony1908',
    description:
      '2 veces finalista ETHGlobal, 10+ bounties ganados, experiencia en producto principalmente en mobile consumer web3, solidity, react native y en general el mundo js y go, 3x time founder, YC founder and CTO',
    socialNetworks: ['https://x.com/@toony1908'],
    avatar: '/images/mentores/toony1908.jpg',
    calendarUrl: 'https://calendly.com/tony-starkfit/30min',
    email: 'tony@starkfit.club',
    roles: ['hacker', 'founder', 'mentor'],
  },
  {
    name: 'Alex Soto',
    username: 'alexsotodigital',
    description:
      'Facilitador de equipos colaborativos, consultor en desarrollo organizacional y emprendedor social. Co-founder de Matriz.coop y govNERD en el Optimism Collective. Con enfoque en gobernanza dinámica, gestión ágil de proyectos y redes de mutualismo.',
    socialNetworks: ['https://x.com/alexsotodigital'],
    avatar: '/images/mentores/alexsotodigital.png',
    calendarUrl: 'https://calendly.com/alexsotodigital/llamada',
    email: 'alex.soto.digital@gmail.com',
    roles: ['hacker', 'founder', 'mentor'],
  },
  {
    name: 'Artur',
    username: 'lil_code',
    description: 'OG Builder Tumbado',
    socialNetworks: ['https://x.com/0xVato'],
    avatar: '/images/mentores/lil_code.jpg',
    calendarUrl: '',
    email: '',
    roles: ['hacker', 'founder', 'mentor'],
  },
  {
    name: 'Carlos',
    username: 'juminstock',
    description:
      'Developer Relations, technical writer, project & community management, organization and sales.',
    socialNetworks: ['https://linktr.ee/juminstock'],
    avatar: '/images/mentores/juminstock.jpg',
    calendarUrl: '',
    email: 'juminstock@gmail.com',
    roles: ['hacker', 'mentor'],
  },
]

/**
 * Extract expertise areas from description
 */
function extractExpertise(description: string, roles: string[]): string[] {
  const expertise: Set<string> = new Set()

  // Check roles
  if (roles.includes('founder')) expertise.add('startup')
  if (roles.includes('hacker')) expertise.add('development')

  const desc = description.toLowerCase()

  // Technical skills
  if (desc.includes('blockchain') || desc.includes('web3')) expertise.add('blockchain')
  if (desc.includes('defi')) expertise.add('defi')
  if (desc.includes('smart contract') || desc.includes('solidity')) expertise.add('smart-contracts')
  if (desc.includes('frontend') || desc.includes('ui') || desc.includes('ux'))
    expertise.add('frontend')
  if (desc.includes('backend') || desc.includes('server')) expertise.add('backend')
  if (desc.includes('fullstack') || desc.includes('full stack')) expertise.add('fullstack')
  if (desc.includes('mobile') || desc.includes('react native')) expertise.add('mobile')
  if (desc.includes('devops') || desc.includes('infrastructure')) expertise.add('devops')
  if (desc.includes('ai') || desc.includes('ml') || desc.includes('machine learning'))
    expertise.add('ai')

  // Business & Design
  if (desc.includes('product')) expertise.add('product')
  if (desc.includes('diseño') || desc.includes('design')) expertise.add('design')
  if (desc.includes('marketing')) expertise.add('marketing')
  if (desc.includes('growth')) expertise.add('growth')
  if (desc.includes('pitch')) expertise.add('pitching')
  if (desc.includes('founder') || desc.includes('ceo') || desc.includes('co-founder'))
    expertise.add('entrepreneurship')
  if (desc.includes('yc') || desc.includes('y combinator')) expertise.add('fundraising')

  // Hackathons & Community
  if (desc.includes('hackathon') || desc.includes('ethglobal')) expertise.add('hackathons')
  if (desc.includes('community') || desc.includes('developer relations')) expertise.add('community')

  return Array.from(expertise)
}

/**
 * Extract X (Twitter) username from social networks
 */
function extractXUsername(socialNetworks: string[]): string | null {
  for (const url of socialNetworks) {
    if (url.includes('twitter.com') || url.includes('x.com')) {
      const match = url.match(/(?:twitter\.com|x\.com)\/([^\/]+)/)
      return match ? match[1] : null
    }
  }
  return null
}

async function seedMentors() {
  console.log('🌱 Starting mentor seeding...\n')

  let created = 0
  let updated = 0
  let errors = 0

  for (const mentor of mentorData) {
    try {
      const expertiseAreas = extractExpertise(mentor.description, mentor.roles)
      const xUsername = extractXUsername(mentor.socialNetworks)

      // Check if user exists by username
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.username, mentor.username))
        .limit(1)

      if (existingUser.length === 0) {
        // Create user (UUID will be auto-generated)
        const [newUser] = await db
          .insert(users)
          .values({
            username: mentor.username,
            displayName: mentor.name,
            email: mentor.email || null,
            bio: mentor.description,
            avatarUrl: mentor.avatar,
            website: mentor.calendarUrl || null,
            metadata: {
              socialNetworks: mentor.socialNetworks,
              roles: mentor.roles,
            },
            isAdmin: false,
          })
          .returning()

        const userId = newUser.id

        // Create profile
        await db.insert(profiles).values({
          userId,
          professionalProfile: mentor.description,
          xUsername,
        })

        // Create mentor profile
        await db.insert(mentorProfiles).values({
          userId,
          availability: mentor.calendarUrl ? 'AVAILABLE' : 'LIMITED',
          maxParticipants: 5,
          expertiseAreas,
          mentoringApproach: mentor.description.slice(0, 500), // First 500 chars
        })

        created++
        console.log(`✅ Created mentor: ${mentor.name} (@${mentor.username})`)
        console.log(`   Expertise: ${expertiseAreas.join(', ')}`)
      } else {
        const userId = existingUser[0].id

        // Update existing user
        await db
          .update(users)
          .set({
            displayName: mentor.name,
            email: mentor.email || null,
            bio: mentor.description,
            avatarUrl: mentor.avatar,
            website: mentor.calendarUrl || null,
            metadata: {
              socialNetworks: mentor.socialNetworks,
              roles: mentor.roles,
            },
          })
          .where(eq(users.id, userId))

        // Update or create profile
        const existingProfile = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, userId))
          .limit(1)

        if (existingProfile.length === 0) {
          await db.insert(profiles).values({
            userId,
            professionalProfile: mentor.description,
            xUsername,
          })
        } else {
          await db
            .update(profiles)
            .set({
              professionalProfile: mentor.description,
              xUsername,
            })
            .where(eq(profiles.userId, userId))
        }

        // Update or create mentor profile
        const existingMentorProfile = await db
          .select()
          .from(mentorProfiles)
          .where(eq(mentorProfiles.userId, userId))
          .limit(1)

        if (existingMentorProfile.length === 0) {
          await db.insert(mentorProfiles).values({
            userId,
            availability: mentor.calendarUrl ? 'AVAILABLE' : 'LIMITED',
            maxParticipants: 5,
            expertiseAreas,
            mentoringApproach: mentor.description.slice(0, 500),
          })
        } else {
          await db
            .update(mentorProfiles)
            .set({
              availability: mentor.calendarUrl ? 'AVAILABLE' : 'LIMITED',
              expertiseAreas,
              mentoringApproach: mentor.description.slice(0, 500),
            })
            .where(eq(mentorProfiles.userId, userId))
        }

        updated++
        console.log(`🔄 Updated mentor: ${mentor.name} (@${mentor.username})`)
      }
    } catch (error) {
      errors++
      console.error(`❌ Error processing ${mentor.name}:`, error)
    }
  }

  console.log('\n📊 Seeding Summary:')
  console.log(`   ✅ Created: ${created}`)
  console.log(`   🔄 Updated: ${updated}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📝 Total mentors: ${mentorData.length}\n`)
}

// Run seed function
seedMentors()
  .then(async () => {
    console.log('✨ Mentor seeding completed successfully!')
    // Properly close database connection before exit
    await client.end()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('💥 Mentor seeding failed:', error)
    await client.end()
    process.exit(1)
  })
