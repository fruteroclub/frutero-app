import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'mobil3 - Dashboard de Conversaciones AI | Frutero Club',
  description: 'Explora tus conversaciones con IA de forma inteligente. Analiza, organiza y descubre insights de tus interacciones.',
  keywords: 'AI, conversaciones, análisis, Frutero Club, inteligencia artificial, mobil3',
}

export default function ProgramaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}