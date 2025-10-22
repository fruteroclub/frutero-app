'use client'

import { useState, useEffect } from 'react'
import { ProcessedWordFrequency } from '@/lib/omi/memory-types'

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

export default function OmiTestPage() {
  const [logs, setLogs] = useState<OmiLog[]>([])
  const [transcriptLogs, setTranscriptLogs] = useState<OmiLog[]>([])
  const [memoryLogs, setMemoryLogs] = useState<OmiLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [testResponse, setTestResponse] = useState<Record<
    string,
    unknown
  > | null>(null)
  const [memoryTestResponse, setMemoryTestResponse] = useState<Record<
    string,
    unknown
  > | null>(null)

  useEffect(() => {
    fetchLogs()

    // Auto-refresh every 5 seconds if enabled
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
      console.log('Logs count:', data.logs?.length || 0)
      console.log('Memory logs count:', data.memory_logs?.length || 0)
      console.log('Transcript logs count:', data.transcript_logs?.length || 0)

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
    if (confirm('Are you sure you want to clear all logs?')) {
      try {
        await fetch('/api/omi/logs', { method: 'DELETE' })
        fetchLogs()
      } catch (error) {
        console.error('Failed to clear logs:', error)
      }
    }
  }

  const sendTestWebhook = async () => {
    const testData = {
      memory_id: `test-${Date.now()}`,
      transcript:
        'This is a test conversation about building amazing products with artificial intelligence and machine learning. We need to focus on user experience and create valuable solutions for our community. The implementation should be scalable and maintainable.',
      context: 'meeting',
      timestamp: new Date().toISOString(),
      user_id: 'test-user',
    }

    try {
      const response = await fetch('/api/omi/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })

      const result = await response.json()
      setTestResponse(result)

      // Refresh logs after sending test
      setTimeout(fetchLogs, 1000)
    } catch (error) {
      console.error('Failed to send test webhook:', error)
      setTestResponse({ error: 'Failed to send test webhook' })
    }
  }

  const sendMemoryTest = async (
    language: 'en' | 'es' = 'en',
    uid: string = 'test_user',
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

      // Refresh logs after sending test
      setTimeout(fetchLogs, 1500)
    } catch (error) {
      console.error('Failed to send memory test:', error)
      setMemoryTestResponse({ error: 'Failed to send memory test' })
    }
  }

  const [urls, setUrls] = useState({
    webhookUrl: '',
    testUrl: '',
    memoryUrl: '',
    memoryTestUrl: '',
  })

  useEffect(() => {
    // Set URLs only on client side after component mounts
    if (typeof window !== 'undefined') {
      setUrls({
        webhookUrl: `${window.location.origin}/api/omi/webhook`,
        testUrl: `${window.location.origin}/api/omi/test`,
        memoryUrl: `${window.location.origin}/api/omi/memory?uid=YOUR_USER_ID`,
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
              className="rounded-full bg-blue-100 px-3 py-1 text-sm"
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

    // Get unique speakers and assign colors
    const speakers = [
      ...new Set(
        segments.map((s) => s.speaker || s.speaker_id?.toString() || 'Unknown'),
      ),
    ]
    const speakerColors = [
      'bg-blue-100 text-blue-900',
      'bg-purple-100 text-purple-900',
      'bg-orange-100 text-orange-900',
      'bg-pink-100 text-pink-900',
      'bg-indigo-100 text-indigo-900',
      'bg-teal-100 text-teal-900',
    ]

    return (
      <div className="max-h-96 space-y-3 overflow-y-auto rounded-lg border bg-gray-50 p-3">
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
                className={`max-w-xs rounded-lg px-3 py-2 lg:max-w-md ${
                  isUser ? 'ml-4 bg-green-600 text-white' : `${colorClass} mr-4`
                }`}
              >
                <div className="mb-1 text-xs opacity-75">
                  {segment.speaker ||
                    `Speaker ${segment.speaker_id || 'Unknown'}`}
                  {segment.start && segment.end && (
                    <span className="ml-2">
                      {Math.round(segment.start)}s - {Math.round(segment.end)}s
                    </span>
                  )}
                </div>
                <div className="text-sm">{segment.text}</div>
                {segment.translations && segment.translations.length > 0 && (
                  <div className="border-opacity-20 mt-2 border-t pt-2">
                    <div className="text-xs opacity-75">
                      Translation ({segment.translations[0].lang}):
                    </div>
                    <div className="text-sm italic">
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
    console.log('Rendering memory log:', index, log)
    const memory = log.memory
    const analytics = log.analytics

    return (
      <div key={index} className="rounded-lg border bg-green-50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-white">
                MEMORY
              </span>
              {memory?.structured?.emoji && (
                <span className="text-lg">{memory.structured.emoji}</span>
              )}
              <span className="font-semibold text-green-900">
                {memory?.structured?.title || 'Untitled Memory'}
              </span>
            </div>
            <div className="text-sm text-green-700">
              Received:{' '}
              {new Date(
                log.webhook_received_at || log.timestamp,
              ).toLocaleString()}
            </div>
            <div className="text-sm text-green-700">
              User: {log.processed?.uid || 'Unknown'}
            </div>
            {memory?.structured?.category && (
              <div className="text-sm text-green-700">
                Category: {memory.structured.category}
              </div>
            )}
          </div>
          <div className="text-sm text-green-600">
            {analytics?.duration_seconds && (
              <div>
                Duration: {Math.round(analytics.duration_seconds / 60)}m
              </div>
            )}
            {analytics?.total_words && (
              <div>Words: {analytics.total_words}</div>
            )}
            {analytics?.speakers && <div>Speakers: {analytics.speakers}</div>}
          </div>
        </div>

        {memory?.structured?.overview && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-green-900">
              Overview:
            </h4>
            <p className="text-sm text-green-800">
              {memory.structured.overview}
            </p>
          </div>
        )}

        {/* Chat-style Transcript */}
        {memory?.transcript_segments &&
          memory.transcript_segments.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-3 text-sm font-semibold text-green-900">
                Conversation:
              </h4>
              {renderChatTranscript(memory.transcript_segments)}
            </div>
          )}

        {memory?.structured?.action_items &&
          memory.structured.action_items.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-semibold text-green-900">
                Action Items:
              </h4>
              <ul className="space-y-1">
                {memory.structured.action_items?.map((item, i: number) => (
                  <li key={i} className="text-sm text-green-800">
                    • {item.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {analytics?.top_words && analytics.top_words.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-semibold text-green-900">
              Top Words:
            </h4>
            {renderWordFrequency(analytics.top_words)}
          </div>
        )}

        {log.processed?.speaker_stats &&
          log.processed.speaker_stats.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-3 text-sm font-semibold text-green-900">
                Speaker Stats:
              </h4>
              <div className="space-y-2">
                {log.processed?.speaker_stats?.map((speaker, i: number) => (
                  <div key={i} className="rounded bg-green-100 p-2 text-sm">
                    <div className="font-medium">{speaker.speaker}</div>
                    <div className="text-green-700">
                      {speaker.wordCount} words • {Math.round(speaker.duration)}
                      s
                    </div>
                    {speaker.topWords?.length > 0 && (
                      <div className="mt-1">
                        {renderWordFrequency(speaker.topWords, 5)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        <details className="cursor-pointer">
          <summary className="text-sm font-medium hover:text-green-600">
            View Raw Data
          </summary>
          <div className="mt-3">
            <pre className="mt-1 max-h-60 overflow-auto rounded bg-green-100 p-2 text-xs">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    )
  }

  const renderTranscriptLog = (log: OmiLog, index: number) => {
    console.log('Rendering transcript log:', index, log)
    return (
      <div key={index} className="rounded-lg border bg-blue-50 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                TRANSCRIPT
              </span>
              <span className="font-semibold text-blue-900">
                Real-time Transcript
              </span>
            </div>
            <div className="text-sm text-blue-700">
              Received: {new Date(log.timestamp).toLocaleString()}
            </div>
            {log.filename && (
              <div className="text-xs text-blue-600">File: {log.filename}</div>
            )}
          </div>
          {log.textLength && (
            <div className="text-sm text-blue-600">
              Text: {log.textLength} chars
            </div>
          )}
        </div>

        {log.wordFrequency && log.wordFrequency.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-semibold text-blue-900">
              Top Words:
            </h4>
            {renderWordFrequency(log.wordFrequency)}
          </div>
        )}

        <details className="cursor-pointer">
          <summary className="text-sm font-medium hover:text-blue-600">
            View Raw Data
          </summary>
          <div className="mt-3 space-y-2">
            {log.headers && (
              <div>
                <div className="text-xs font-semibold text-blue-700">
                  Headers:
                </div>
                <pre className="mt-1 max-h-40 overflow-auto rounded bg-blue-100 p-2 text-xs">
                  {JSON.stringify(log.headers, null, 2)}
                </pre>
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-blue-700">Body:</div>
              <pre className="mt-1 max-h-60 overflow-auto rounded bg-blue-100 p-2 text-xs">
                {JSON.stringify(log.body, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold">
          Omi Integration Test Dashboard
        </h1>

        {/* Webhook URLs Section */}
        <div className="mb-8 space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Webhook Endpoints</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Real-time Transcript Webhook:
                </label>
                <code className="block rounded bg-muted p-3 text-sm">
                  {urls.webhookUrl || 'Loading...'}
                </code>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Memory Creation Webhook:
                </label>
                <code className="block rounded bg-green-100 p-3 text-sm">
                  {urls.memoryUrl || 'Loading...'}
                </code>
                <div className="mt-2 text-xs text-foreground">
                  Replace YOUR_USER_ID with your custom identifier (e.g.,
                  @melguachun, mel_twitter)
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Test Endpoint (flexible):
                </label>
                <code className="block rounded bg-muted p-3 text-sm">
                  {urls.testUrl || 'Loading...'}
                </code>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm">
              <p className="font-medium text-blue-900">Quick Test with cURL:</p>
              <pre className="mt-2 overflow-x-auto rounded bg-blue-100 p-2 text-xs">
                {`curl -X POST ${urls.memoryUrl.replace('YOUR_USER_ID', 'mel_test') || 'Loading...'} \\
  -H "Content-Type: application/json" \\
  -d '{"transcript": "Test conversation about AI and technology"}'`}
              </pre>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={sendTestWebhook}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Send Transcript Test
          </button>

          <button
            onClick={() => sendMemoryTest('en', 'test_user')}
            className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Send Memory Test (EN)
          </button>

          <button
            onClick={() => sendMemoryTest('es', 'test_spanish')}
            className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Send Memory Test (ES)
          </button>

          <button
            onClick={fetchLogs}
            className="rounded-lg border bg-white px-4 py-2 transition-colors hover:bg-gray-50"
          >
            Refresh Logs
          </button>

          <button
            onClick={clearLogs}
            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
          >
            Clear All Logs
          </button>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span>Auto-refresh (5s)</span>
          </label>
        </div>

        {/* Test Responses */}
        {testResponse && (
          <div className="mb-6 rounded-lg border bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">
              Transcript Test Response:
            </h3>
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(testResponse, null, 2)}
            </pre>
          </div>
        )}

        {memoryTestResponse && (
          <div className="mb-6 rounded-lg border bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-900">
              Memory Test Response:
            </h3>
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(memoryTestResponse, null, 2)}
            </pre>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Total Webhooks</h3>
            <p className="text-2xl font-bold text-blue-600">{logs.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Real-time Transcripts</h3>
            <p className="text-2xl font-bold text-blue-600">
              {transcriptLogs.length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">Memory Creations</h3>
            <p className="text-2xl font-bold text-green-600">
              {memoryLogs.length}
            </p>
          </div>
        </div>

        {/* Logs Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            All Webhooks ({logs.length})
          </h2>

          {loading ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <div className="text-foreground">Loading logs...</div>
              <div className="mt-2">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-300 bg-red-50 p-8 text-center">
              <div className="font-medium text-red-600">Error loading logs</div>
              <div className="mt-2 text-sm text-red-500">{error}</div>
              <button
                onClick={fetchLogs}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <div className="text-foreground">
                No webhooks received yet. Send a test webhook to see it here.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => {
                console.log(`Rendering log ${index}:`, {
                  type: log.type,
                  hasMemory: !!log.memory,
                  hasBody: !!log.body,
                })
                return log.type === 'memory'
                  ? renderMemoryLog(log, index)
                  : renderTranscriptLog(log, index)
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
