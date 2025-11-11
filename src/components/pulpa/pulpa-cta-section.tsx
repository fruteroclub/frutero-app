'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export default function PulpaCTASection() {
  return (
    <div className="page">
      <div className="container">
        <div className="w-full md:max-w-screen-sm rounded-xl bg-primary px-8 py-12 md:py-16 text-center text-white space-y-4">
          {/* Mascot */}
          <div className="flex justify-center space-x-8">
            <Image
              src="/images/fruits/pulpa.svg"
              alt="PULPA te invita"
              className="w-full md:w-3/4 max-w-xs"
              width={100}
              height={100}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-bold">Empieza a ganar $PULPA hoy</h2>
            <p className="text-2xl font-medium">
              Construye tu reputación on-chain
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="w-full md:w-1/2 bg-white text-foreground hover:bg-accent hover:text-foreground px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex gap-x-2 items-center"
            >
              <a href="https://discord.gg/frutero" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="text-primary w-5 h-5" />
                ¡Únete a Discord!
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold">100+</p>
              <p className="text-sm opacity-90">Miembros activos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm opacity-90">$PULPA distribuidos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">25+</p>
              <p className="text-sm opacity-90">Eventos mensuales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
