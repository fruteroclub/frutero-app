import { motion } from 'framer-motion'
import Image from 'next/image'
import { Globe, ExternalLink, Mail } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { selectSocial } from '../socials'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface FrutaCardProps {
  name: string
  username: string
  description: string
  socialNetworks: string[]
  avatar: string
  calendarUrl: string
  email: string
  roles: string[]
}

export default function FrutaCard({
  name,
  username,
  description,
  socialNetworks,
  avatar,
  calendarUrl,
  email,
  roles,
}: FrutaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
    >
      <Card
        className={`h-full w-full rounded-2xl border-2 px-2 py-6 text-center`}
      >
        <CardHeader className="flex flex-row items-center gap-4 px-4">
          <div className="relative h-20 w-20 flex-shrink-0 lg:h-16 lg:w-16">
            <Image
              src={avatar}
              alt={`${name}'s avatar`}
              fill
              sizes="64px"
              className="rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h3 className="truncate font-bold text-primary lg:text-2xl">
              {name}
            </h3>
            <p className="text-lg text-secondary">@{username}</p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="line-clamp-2 text-gray-600">{description}</p>
          <div className="flex items-center justify-center">
            <div className="flex space-x-2">
              {socialNetworks.map((network, index) => {
                const social = selectSocial({ url: network })

                return (
                  <Link
                    key={index}
                    href={network}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <span className="sr-only">{social?.name ?? 'Website'}</span>
                    {social ? (
                      <social.icon
                        className={`${
                          social.name === 'Telegram' || social.name === 'X'
                            ? '-mt-0.5 h-6 w-6'
                            : social.name === 'LinkedIn'
                              ? '-mt-1 h-6 w-6'
                              : 'h-5 w-5'
                        } text-secondary hover:text-primary`}
                        aria-hidden="true"
                      />
                    ) : (
                      <Globe size={20} />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
          {roles.includes('mentor') && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex w-full justify-center"
            >
              <Link
                href={Boolean(calendarUrl) ? calendarUrl : `mailto:${email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">
                  Mentoría
                  {calendarUrl ? (
                    <ExternalLink size={16} className="ml-2" />
                  ) : (
                    <Mail size={16} className="ml-2" />
                  )}
                </Button>
              </Link>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
