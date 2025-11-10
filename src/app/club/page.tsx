'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import FrutaCard from '@/components/cards/fruta-card'
import { Section } from '@/components/layout/section'
import PageWrapper from '@/components/layout/page-wrapper'
import { Rocket, GraduationCap, Grape } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface ClubMember {
  name: string
  username: string
  description: string
  socialNetworks: string[]
  avatar: string
  calendarUrl: string
  email: string
  roles: string[]
}

// Fallback data in case API fails
const fallbackUsers = [
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

const roleConfig = [
  { id: 'hacker', label: 'Frutas', icon: Grape },
  { id: 'founder', label: 'Founders', icon: Rocket },
  { id: 'mentor', label: 'Mentores', icon: GraduationCap },
]

export default function FrutasPage() {
  const [selectedRole, setSelectedRole] = useState('hacker')

  // Fetch club members from API
  const { data: members, isLoading, error } = useQuery<ClubMember[]>({
    queryKey: ['club-members'],
    queryFn: async () => {
      const response = await fetch('/api/club/members')
      if (!response.ok) throw new Error('Failed to fetch members')
      return response.json()
    },
  })

  // Use fetched data or fallback
  const users = members || fallbackUsers

  const filteredUsers =
    selectedRole === 'hacker'
      ? [...users].sort(() => Math.random() - 0.5)
      : [...users]
          .sort(() => Math.random() - 0.5)
          .filter((user) => user.roles.includes(selectedRole))

  return (
    <PageWrapper>
      <Section>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-center text-4xl font-bold"
        >
          Miembros del Club
        </motion.h1>

        {error && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800">
            ⚠️ Usando datos de respaldo. La conexión a la base de datos falló.
          </div>
        )}

        <div className="mb-4 flex justify-center">
          <div className="inline-flex gap-2 rounded-lg">
            {roleConfig.map((role) => {
              const Icon = role.icon
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex w-1/3 flex-col items-center gap-1 rounded-md p-2 text-sm font-medium ${
                    selectedRole === role.id
                      ? 'text-primary'
                      : 'text-gray-600 hover:cursor-pointer hover:text-primary'
                  } `}
                >
                  <Icon size={24} />
                  <span
                    className={`${selectedRole === role.id ? 'text-primary' : ''}`}
                  >
                    {role.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-sm text-gray-600">Cargando miembros del club...</p>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-8 px-6 md:grid-cols-2 md:px-0 lg:grid-cols-3"
          >
            {filteredUsers.map((user) => (
              <FrutaCard key={user.username} {...user} />
            ))}
          </motion.div>
        )}
      </Section>
    </PageWrapper>
  )
}
