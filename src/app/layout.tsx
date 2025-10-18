import type { Metadata } from 'next'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'
import OnchainProvider from '@/providers/onchain-provider'
import { Toaster } from '@/components/ui/sonner'
import { fonts } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Frutero Club',
  description: 'Donde el talento se transforma en impacto',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fonts.funnelDisplay.variable,
          fonts.ledger.variable,
          fonts.raleway.variable,
          fonts.spaceGrotesk.variable,
        )}
      >
        <OnchainProvider>{children}</OnchainProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
