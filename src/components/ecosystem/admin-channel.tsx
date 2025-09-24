'use client'

import { useState, useEffect } from 'react'
import { ArenaChannelResponse } from '@/types/arena'
import ArenaBlockCard from './arena-block-card'
import { ExternalLink, Lock } from 'lucide-react'

export default function AdminChannel() {
  const [channelData, setChannelData] = useState<ArenaChannelResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const channelSlug = process.env.NEXT_PUBLIC_ARENA_ADMIN_CHANNEL || 'frutero-dzu67mbzaac'

  const loadChannelData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/arena/admin-channel', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setChannelData(data)
    } catch (err) {
      setError('Error al cargar el contenido')
      console.error('Error loading channel:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChannelData()
    
    // Auto-refresh cada 60 segundos para nuevos contenidos de admin
    const interval = setInterval(() => {
      loadChannelData()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="border-2 border-yellow-500/30 rounded-lg p-6 bg-gradient-to-br from-yellow-50/50 to-orange-50/50">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5 text-yellow-600" />
          <h2 className="text-2xl font-funnel font-bold text-foreground">
            Hackatones
          </h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-2 border-red-500/30 rounded-lg p-6 bg-gradient-to-br from-red-50/50 to-pink-50/50">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5 text-red-600" />
          <h2 className="text-2xl font-funnel font-bold text-foreground">
            Hackatones
          </h2>
        </div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadChannelData}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="border-2 border-yellow-500/30 rounded-lg p-6 bg-gradient-to-br from-yellow-50/50 to-orange-50/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-yellow-600" />
          <h2 className="text-2xl font-funnel font-bold text-foreground">
            Hackatones
          </h2>
        </div>
        <a
          href={`https://www.are.na/scarf-homie/${channelSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Ver en Are.na</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Contenido curado por el equipo Frutero. Eventos, recursos y oportunidades especiales para la comunidad.
      </p>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {channelData?.contents?.length > 0 ? (
          channelData.contents.map((block) => (
            <ArenaBlockCard
              key={block.id}
              block={block}
              variant="admin"
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay contenido disponible aún</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-yellow-200 text-xs text-muted-foreground">
        Total: {channelData?.length || 0} elementos
      </div>
    </div>
  )
}