'use client'

import { SparkleIcon, ExternalLink, Copy } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function PulpaHeroSection() {
  const CONTRACT_ADDRESS = '0x029263aa1be88127f1794780d9eef453221c2f30'
  const ETHERSCAN_LINK =
    'https://optimistic.etherscan.io/token/0x029263aa1be88127f1794780d9eef453221c2f30'
  const UNISWAP_LINK =
    'https://app.uniswap.org/swap?chain=optimism&outputCurrency=0x029263aa1be88127f1794780d9eef453221c2f30'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS)
  }

  return (
    <div className="min-h-[70svh] w-full pt-12 pb-8">
      <div className="container mx-auto space-y-2 px-4 lg:space-y-4">
        {/* Badge - centered on all viewports */}
        {/* <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <SparkleIcon className="mr-2 h-4 w-4 fill-primary" />
            Token Comunitario Oficial
          </Badge>
        </div> */}

        {/* Title - centered on all viewports */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl leading-tight font-semibold text-foreground md:text-5xl">
            <span className="inline-block -rotate-2 transform rounded-lg bg-primary px-4 py-2 text-white">
              $PULPA
            </span>
          </h1>
        </div>

        <p className="text-center text-2xl text-foreground md:text-3xl md:font-medium lg:hidden">
          Tu reputación tiene{' '}
          <span className="inline-block rotate-2 transform rounded-lg bg-accent px-4 py-2 text-foreground">
            valor
          </span>
        </p>

        <p className="mx-auto max-w-2xl text-center text-xl text-muted-foreground lg:hidden">
          El token que convierte tus contribuciones en oportunidades
        </p>

        {/* Mobile Layout: Image → Contract → Bullets */}
        <div className="mx-auto max-w-2xl space-y-2 lg:hidden">
          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/images/fruits/pulpa.svg"
              alt="PULPA"
              width={200}
              height={200}
              className="w-full max-w-xs"
            />
          </div>

          {/* Contract Info Card */}
          <div className="space-y-4 rounded-2xl border-2 border-border bg-card p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Contrato en Optimism
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-auto p-1"
                >
                  <a
                    href={ETHERSCAN_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 overflow-x-auto rounded-md bg-background px-3 py-2 font-mono text-xs break-all">
                  {CONTRACT_ADDRESS}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full" size="lg">
                <a
                  href={UNISWAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Comprar $PULPA
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <a href="#earn">Ganar $PULPA</a>
              </Button>
            </div>
          </div>

          {/* Pulpa Bullets */}
          <div className="space-y-4 pt-6">
            <div className="text-left">
              <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                <SparkleIcon className="h-5 w-5 fill-primary" />
                Gana $PULPA
              </h3>
              <p className="text-lg text-muted-foreground">
                Por contribuir, enseñar y ayudar a la comunidad
              </p>
            </div>
            <div className="text-left">
              <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                <SparkleIcon className="h-5 w-5 fill-primary" />
                Crea reputación
              </h3>
              <p className="text-lg text-muted-foreground">
                +$PULPA ➞ +Beneficios ➞ +Reconocimiento
              </p>
            </div>
            <div className="text-left">
              <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                <SparkleIcon className="h-5 w-5 fill-primary" />
                Cuentas Premium
              </h3>
              <p className="text-lg text-muted-foreground">
                Acceso gratuito a Cursor, Claude y otras herramientas
              </p>
            </div>
            <div className="text-left">
              <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                <SparkleIcon className="h-5 w-5 fill-primary" />
                Recompensas
              </h3>
              <p className="text-lg text-muted-foreground">
                Prioridad para eventos, hacker houses y oportunidades
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout: 2 columns (Image + Contract left | Subheader + Bullets right) */}
        <div className="mx-auto hidden max-w-6xl lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Image + Contract Info */}
          <div className="space-y-6">
            {/* Image */}
            <div className="flex justify-center">
              <Image
                src="/images/fruits/pulpa.svg"
                alt="PULPA"
                width={400}
                height={400}
                className="w-full max-w-md lg:max-w-sm"
              />
            </div>
          </div>

          {/* Right Column - Subheader + Bullets */}
          <div className="space-y-4">
            {/* Subheader */}
            <div className="space-y-2">
              <p className="text-2xl text-foreground md:text-3xl md:font-medium">
                Tu reputación tiene{' '}
                <span className="inline-block rotate-2 transform rounded-lg bg-accent px-4 py-2 text-foreground">
                  valor
                </span>
              </p>
              <p className="text-xl text-muted-foreground">
                El token que convierte tus contribuciones en oportunidades
              </p>
            </div>

            {/* Pulpa Bullets */}
            <div className="space-y-2">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                  <SparkleIcon className="h-4 w-4 fill-primary" />
                  Gana $PULPA
                </h3>
                <p className="text-lg text-muted-foreground">
                  Por contribuir, enseñar y ayudar a la comunidad
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                  <SparkleIcon className="h-4 w-4 fill-primary" />
                  Crea reputación
                </h3>
                <p className="text-lg text-muted-foreground">
                  + $PULPA ➞ + Beneficios ➞ + Reconocimiento
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                  <SparkleIcon className="h-4 w-4 fill-primary" />
                  Cuentas Premium
                </h3>
                <p className="text-lg text-muted-foreground">
                  Acceso gratuito a Cursor, Claude y otras herramientas
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                  <SparkleIcon className="h-4 w-4 fill-primary" />
                  Recompensas
                </h3>
                <p className="text-lg text-muted-foreground">
                  Prioridad para eventos, hacker houses y oportunidades
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Info Card */}
        <div className="space-y-4 rounded-2xl border-2 border-border bg-card p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Contrato en Optimism
              </p>
              <Button asChild size="sm" variant="ghost" className="h-auto p-1">
                <a
                  href={ETHERSCAN_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 overflow-x-auto rounded-md bg-background px-3 py-2 font-mono text-sm">
                {CONTRACT_ADDRESS}
              </code>
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button asChild className="flex-1" size="lg">
              <a href={UNISWAP_LINK} target="_blank" rel="noopener noreferrer">
                Comprar $PULPA
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <a href="#earn">Ganar $PULPA</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
