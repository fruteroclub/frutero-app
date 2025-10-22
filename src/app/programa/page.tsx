'use client'

import { useState, useEffect } from 'react'
import PageWrapper from '@/components/layout/page-wrapper'
import { ProcessedWordFrequency } from '@/lib/omi/memory-types'
import {
  SparkleIcon,
  RefreshCwIcon,
  TrashIcon,
  PlayIcon,
  MicIcon,
  ChevronDownIcon,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// TypeScript interfaces
interface MemoryStructured {
  title?: string
  overview?: string
  emoji?: string
  category?: string
  action_items?: Array<{ description: string; completed: boolean }>
}

interface MemoryData {
  structured?: MemoryStructured
  transcript_segments?: Array<{
    id?: string
    text?: string
    speaker?: string
    speaker_id?: number
    is_user?: boolean
    start?: number
    end?: number
    translations?: Array<{ lang: string; text: string }>
  }>
}

interface ProcessedData {
  uid?: string
  speaker_stats?: Array<{
    speaker: string
    wordCount: number
    duration: number
    topWords: ProcessedWordFrequency[]
  }>
}

interface AnalyticsData {
  duration_seconds?: number
  total_words?: number
  speakers?: number
  top_words?: ProcessedWordFrequency[]
}

interface OmiLog {
  timestamp: string
  webhook_received_at?: string
  body?: Record<string, unknown>
  memory?: MemoryData
  analytics?: AnalyticsData
  processed?: ProcessedData
  headers?: Record<string, string>
  wordFrequency?: ProcessedWordFrequency[]
  textLength?: number
  filename?: string
  endpoint?: string
  type?: 'transcript' | 'memory'
}

export default function Mobil3Page() {
  const [logs, setLogs] = useState<OmiLog[]>([])
  const [transcriptLogs, setTranscriptLogs] = useState<OmiLog[]>([])
  const [memoryLogs, setMemoryLogs] = useState<OmiLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [memoryTestResponse, setMemoryTestResponse] = useState<Record<
    string,
    unknown
  > | null>(null)

  useEffect(() => {
    fetchLogs()

    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchLogs = async () => {
    try {
      console.log('Fetching logs...')
      setError(null)

      const response = await fetch('/api/omi/logs')
      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)

      setLogs(data.logs || [])
      setTranscriptLogs(data.transcript_logs || [])
      setMemoryLogs(data.memory_logs || [])
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    if (
      confirm('¿Estás seguro de que quieres limpiar todas las conversaciones?')
    ) {
      try {
        await fetch('/api/omi/logs', { method: 'DELETE' })
        fetchLogs()
      } catch (error) {
        console.error('Failed to clear logs:', error)
      }
    }
  }

  const sendMemoryTest = async (
    language: 'en' | 'es' = 'en',
    uid: string = 'frutero_test',
  ) => {
    try {
      const response = await fetch(
        `/api/omi/memory/test?uid=${uid}&lang=${language}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const result = await response.json()
      setMemoryTestResponse(result)

      setTimeout(fetchLogs, 1500)
    } catch (error) {
      console.error('Failed to send memory test:', error)
      setMemoryTestResponse({ error: 'Failed to send memory test' })
    }
  }

  const [urls, setUrls] = useState({
    webhookUrl: '',
    memoryUrl: '',
    memoryTestUrl: '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrls({
        webhookUrl: `${window.location.origin}/api/omi/webhook`,
        memoryUrl: `https://frutero-club.vercel.app/api/omi/memory?uid=TU_USERNAME`,
        memoryTestUrl: `${window.location.origin}/api/omi/memory/test`,
      })
    }
  }, [])

  const renderWordFrequency = (
    words: ProcessedWordFrequency[],
    maxWords: number = 10,
  ) => {
    if (!words || words.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2">
        {words.slice(0, maxWords).map((wordData, i) => {
          const word = wordData.word
          const count = wordData.count

          return (
            <span
              key={`${word}-${i}`}
              className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent-foreground"
              style={{
                fontSize: `${Math.max(14 - i * 0.5, 12)}px`,
                opacity: Math.max(1 - i * 0.08, 0.5),
              }}
            >
              {word} ({count})
            </span>
          )
        })}
      </div>
    )
  }

  const renderChatTranscript = (
    segments: MemoryData['transcript_segments'],
  ) => {
    if (!segments || segments.length === 0) return null

    const speakers = [
      ...new Set(
        segments.map((s) => s.speaker || s.speaker_id?.toString() || 'Unknown'),
      ),
    ]
    const speakerColors = [
      'bg-primary/10 text-foreground border-primary/20',
      'bg-secondary/10 text-foreground border-secondary/20',
      'bg-accent/10 text-foreground border-accent/20',
      'bg-muted/10 text-foreground border-muted-foreground/20',
    ]

    return (
      <div className="max-h-96 space-y-4 overflow-y-auto rounded-lg border border-border bg-card/50 p-4">
        {segments.map((segment, i) => {
          const speakerIndex = speakers.indexOf(
            segment.speaker || segment.speaker_id?.toString() || 'Unknown',
          )
          const colorClass = speakerColors[speakerIndex % speakerColors.length]
          const isUser = segment.is_user

          return (
            <div
              key={segment.id || i}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-xl border-2 px-4 py-3 lg:max-w-md ${
                  isUser
                    ? 'ml-4 border-primary/30 bg-primary text-foreground'
                    : `${colorClass} mr-4`
                }`}
              >
                <div className="mb-2 text-xs font-medium opacity-75">
                  {segment.speaker ||
                    `Speaker ${segment.speaker_id || 'Unknown'}`}
                  {segment.start && segment.end && (
                    <span className="ml-2">
                      {Math.round(segment.start)}s - {Math.round(segment.end)}s
                    </span>
                  )}
                </div>
                <div className="text-sm leading-relaxed">{segment.text}</div>
                {segment.translations && segment.translations.length > 0 && (
                  <div className="mt-3 border-t border-current/20 pt-3">
                    <div className="text-xs font-medium opacity-75">
                      Traducción ({segment.translations[0].lang}):
                    </div>
                    <div className="mt-1 text-sm italic">
                      {segment.translations[0].text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMemoryLog = (log: OmiLog, index: number) => {
    const memory = log.memory
    const analytics = log.analytics

    return (
      <div
        key={index}
        className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                <MicIcon className="mr-1 inline h-3 w-3" />
                CONVERSACIÓN
              </span>
              {memory?.structured?.emoji && (
                <span className="text-xl">{memory.structured.emoji}</span>
              )}
              <h3 className="font-funnel text-lg font-semibold text-foreground">
                {memory?.structured?.title || 'Conversación sin título'}
              </h3>
            </div>
            <div className="space-y-1 text-sm text-foreground">
              <div>
                Recibido:{' '}
                {new Date(
                  log.webhook_received_at || log.timestamp,
                ).toLocaleString()}
              </div>
              <div>Usuario: {log.processed?.uid || 'Anónimo'}</div>
              {memory?.structured?.category && (
                <div>
                  Categoría:{' '}
                  <span className="font-medium">
                    {memory.structured.category}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1 text-right text-sm text-foreground">
            {analytics?.duration_seconds && (
              <div className="flex items-center gap-1">
                <span>⏱️ {Math.round(analytics.duration_seconds / 60)}min</span>
              </div>
            )}
            {analytics?.total_words && (
              <div>📝 {analytics.total_words} palabras</div>
            )}
            {analytics?.speakers && <div>👥 {analytics.speakers} personas</div>}
          </div>
        </div>

        {memory?.structured?.overview && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Resumen:
            </h4>
            <p className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
              {memory.structured.overview}
            </p>
          </div>
        )}

        {memory?.transcript_segments &&
          memory.transcript_segments.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Conversación:
              </h4>
              {renderChatTranscript(memory.transcript_segments)}
            </div>
          )}

        {memory?.structured?.action_items &&
          memory.structured.action_items.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                Acciones pendientes:
              </h4>
              <ul className="space-y-2">
                {memory.structured.action_items?.map((item, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1 text-primary">→</span>
                    {item.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {analytics?.top_words && analytics.top_words.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Palabras frecuentes:
            </h4>
            {renderWordFrequency(analytics.top_words)}
          </div>
        )}

        {log.processed?.speaker_stats &&
          log.processed.speaker_stats.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                Estadísticas por persona:
              </h4>
              <div className="grid gap-3">
                {log.processed?.speaker_stats?.map((speaker, i: number) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-3 text-sm">
                    <div className="font-medium text-foreground">
                      {speaker.speaker}
                    </div>
                    <div className="mt-1 text-foreground">
                      {speaker.wordCount} palabras •{' '}
                      {Math.round(speaker.duration)}s
                    </div>
                    {speaker.topWords?.length > 0 && (
                      <div className="mt-2">
                        {renderWordFrequency(speaker.topWords, 5)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        <details className="cursor-pointer">
          <summary className="text-sm font-medium transition-colors hover:text-primary">
            Ver datos técnicos
          </summary>
          <div className="mt-3">
            <pre className="mt-1 max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    )
  }

  const renderTranscriptLog = (log: OmiLog, index: number) => {
    return (
      <div
        key={index}
        className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <PlayIcon className="mr-1 inline h-3 w-3" />
                TRANSCRIPCIÓN
              </span>
              <h3 className="font-funnel text-lg font-semibold text-foreground">
                Transcripción en tiempo real
              </h3>
            </div>
            <div className="space-y-1 text-sm text-foreground">
              <div>Recibido: {new Date(log.timestamp).toLocaleString()}</div>
              {log.filename && (
                <div className="text-xs">Archivo: {log.filename}</div>
              )}
            </div>
          </div>
          {log.textLength && (
            <div className="text-sm text-foreground">
              📄 {log.textLength} caracteres
            </div>
          )}
        </div>

        {log.wordFrequency && log.wordFrequency.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Palabras principales:
            </h4>
            {renderWordFrequency(log.wordFrequency)}
          </div>
        )}

        <details className="cursor-pointer">
          <summary className="text-sm font-medium transition-colors hover:text-primary">
            Ver datos técnicos
          </summary>
          <div className="mt-3 space-y-3">
            {log.headers && (
              <div>
                <div className="mb-2 text-xs font-semibold text-foreground">
                  Headers:
                </div>
                <pre className="max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs">
                  {JSON.stringify(log.headers, null, 2)}
                </pre>
              </div>
            )}
            <div>
              <div className="mb-2 text-xs font-semibold text-foreground">
                Body:
              </div>
              <pre className="max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs">
                {JSON.stringify(log.body, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    )
  }

  return (
    <PageWrapper>
      <div className="page">
        <div className="container">
          <div className="section">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <h1 className="mb-4 font-funnel text-6xl font-medium text-foreground">
                mobil<span className="text-primary">3</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-foreground">
                Tu dashboard de conversaciones con IA. Analiza, organiza y
                descubre insights de tus interacciones inteligentes.
              </p>
            </div>

            {/* Mentor Integration Card */}
            <div className="mb-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="mentor-integration"
                  className="rounded-2xl border-border bg-card/50 backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-8 py-6 hover:no-underline">
                    <h2 className="font-funnel text-2xl font-semibold text-foreground">
                      Integración para Mentores
                    </h2>
                    <ChevronDownIcon className="h-5 w-5 shrink-0 text-foreground transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-8">
                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-semibold text-foreground">
                          Webhook para registro de Mentorías:
                        </label>
                        <code className="block rounded-lg border border-primary/20 bg-primary/5 p-4 font-mono text-sm text-primary">
                          {urls.memoryUrl || 'Cargando...'}
                        </code>
                        <div className="mt-3 space-y-2 text-sm text-foreground">
                          <p>
                            <strong>📝 Instrucciones para Mentores:</strong>
                          </p>
                          <ul className="ml-4 space-y-1">
                            <li>
                              • Reemplaza{' '}
                              <code className="rounded bg-muted px-1 text-background">
                                TU_USERNAME
                              </code>{' '}
                              con tu usuario único (ej:{' '}
                              <code className="rounded bg-muted px-1 text-background">
                                carlos_mentor
                              </code>
                              ,{' '}
                              <code className="rounded bg-muted px-1 text-background">
                                @ana_frutero
                              </code>
                              )
                            </li>
                            <li>
                              • Configura este URL en tu app Omi para registrar
                              automáticamente tus sesiones de mentoría
                            </li>
                            <li>
                              • Cada conversación se procesará y aparecerá aquí
                              con análisis de palabras clave y insights
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm">
                        <p className="mb-3 font-medium text-accent-foreground">
                          🔧 Configuración en Omi App:
                        </p>
                        <div className="space-y-3">
                          <div>
                            <p className="mb-1 text-xs font-semibold">
                              1. Abre tu app Omi
                            </p>
                            <p className="text-xs text-foreground">
                              Ve a Configuración → Integraciones → Memory
                              Creation
                            </p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-semibold">
                              2. Pega este URL:
                            </p>
                            <code className="block rounded bg-accent/10 p-2 font-mono text-xs">
                              {urls.memoryUrl.replace(
                                'TU_USERNAME',
                                'tu_usuario_mentor',
                              ) || 'Cargando...'}
                            </code>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-semibold">
                              3. Activa &quot;Memory Creation Trigger&quot;
                            </p>
                            <p className="text-xs text-foreground">
                              Tus mentorías se registrarán automáticamente
                              después de cada conversación
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4 text-sm">
                        <p className="mb-2 font-medium text-background">
                          💡 Beneficios para Mentores:
                        </p>
                        <ul className="space-y-1 text-xs text-foreground">
                          <li>
                            • <strong>Seguimiento automático:</strong> Registra
                            insights y temas clave de cada sesión
                          </li>
                          <li>
                            • <strong>Análisis de progreso:</strong> Ve patrones
                            en las conversaciones con tus mentorados
                          </li>
                          <li>
                            • <strong>Reportes inteligentes:</strong> Genera
                            resúmenes y acciones pendientes automáticamente
                          </li>
                          <li>
                            • <strong>Historial organizado:</strong> Todas tus
                            mentorías en un solo lugar
                          </li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Controls */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => sendMemoryTest('es', 'mentor_carlos')}
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
                >
                  <SparkleIcon className="h-4 w-4" />
                  Simular Mentoría (ES)
                </button>

                <button
                  onClick={() => sendMemoryTest('en', 'mentor_ana')}
                  className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-all hover:scale-105 hover:bg-secondary/90"
                >
                  <SparkleIcon className="h-4 w-4" />
                  Simulate Mentoring (EN)
                </button>

                <button
                  onClick={fetchLogs}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition-all hover:scale-105 hover:bg-muted/50"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Actualizar
                </button>

                <button
                  onClick={clearLogs}
                  className="flex items-center gap-2 rounded-full border border-destructive/30 bg-card px-6 py-3 font-medium text-destructive transition-all hover:scale-105 hover:bg-destructive/10"
                >
                  <TrashIcon className="h-4 w-4" />
                  Limpiar Todo
                </button>

                <label className="flex items-center gap-3 rounded-full bg-muted/50 px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  <span>Auto-refresh (5s)</span>
                </label>
              </div>
            </div>

            {/* Test Response */}
            {memoryTestResponse && (
              <div className="mb-8">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                  <h3 className="mb-3 font-funnel text-lg font-semibold text-primary">
                    Respuesta de Prueba:
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-primary/10 p-3 text-xs">
                    {JSON.stringify(memoryTestResponse, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
                  <h3 className="font-funnel text-lg font-semibold text-foreground">
                    Total
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    {logs.length}
                  </p>
                  <p className="mt-1 text-sm text-foreground">Conversaciones</p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
                  <h3 className="font-funnel text-lg font-semibold text-foreground">
                    Transcripciones
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-secondary">
                    {transcriptLogs.length}
                  </p>
                  <p className="mt-1 text-sm text-foreground">En tiempo real</p>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
                  <h3 className="font-funnel text-lg font-semibold text-foreground">
                    Memorias
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-accent">
                    {memoryLogs.length}
                  </p>
                  <p className="mt-1 text-sm text-foreground">Procesadas</p>
                </div>
              </div>
            </div>

            {/* Logs Section */}
            <div>
              <div className="mb-6">
                <h2 className="mb-2 font-funnel text-3xl font-semibold text-foreground">
                  Mentorías Registradas ({logs.length})
                </h2>
                <p className="text-foreground">
                  Sesiones de mentoría capturadas automáticamente con análisis
                  inteligente
                </p>
              </div>

              {loading ? (
                <div className="rounded-xl border border-border bg-card/50 p-12 text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <div className="text-foreground">
                    Cargando conversaciones...
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
                  <div className="mb-2 font-medium text-destructive">
                    Error al cargar conversaciones
                  </div>
                  <div className="mb-4 text-sm text-destructive/70">
                    {error}
                  </div>
                  <button
                    onClick={fetchLogs}
                    className="text-destructive-foreground rounded-full bg-destructive px-6 py-2 transition-all hover:bg-destructive/90"
                  >
                    Reintentar
                  </button>
                </div>
              ) : logs.length === 0 ? (
                <div className="rounded-xl border border-border bg-card/50 p-12 text-center">
                  <MicIcon className="mx-auto mb-4 h-16 w-16 text-foreground/50" />
                  <div className="mb-4 text-foreground">
                    No hay mentorías registradas aún. Configura tu app Omi o
                    simula una sesión para comenzar.
                  </div>
                  <button
                    onClick={() => sendMemoryTest('es', 'mentor_demo')}
                    className="rounded-full bg-primary px-6 py-2 text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    Simular Mentoría de Prueba
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {logs.map((log, index) => {
                    return log.type === 'memory'
                      ? renderMemoryLog(log, index)
                      : renderTranscriptLog(log, index)
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
