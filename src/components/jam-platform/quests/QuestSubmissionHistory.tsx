'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, CheckCircle2 } from 'lucide-react'

interface SubmissionHistoryItem {
  id: string
  progress: number
  description: string | null
  links: string[]
  submittedAt: Date
  status?: string
}

interface QuestSubmissionHistoryProps {
  history: SubmissionHistoryItem[]
}

export function QuestSubmissionHistory({
  history,
}: QuestSubmissionHistoryProps) {
  if (!history || history.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Envíos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {history.map((item) => (
            <div
              key={item.id}
              className="relative pl-6 pb-6 border-l-2 border-muted last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-primary border-2 border-background" />

              {/* Submission content */}
              <div className="space-y-3">
                {/* Header with progress and date */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={item.progress === 100 ? 'default' : 'secondary'}
                      className="font-semibold"
                    >
                      {item.progress === 100 ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : null}
                      {item.progress}% Completo
                    </Badge>
                    {item.status === 'COMPLETED' && (
                      <Badge variant="outline" className="text-green-600">
                        Completado
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(item.submittedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div className="text-sm">
                    <p className="text-foreground whitespace-pre-wrap">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Links */}
                {item.links && item.links.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Enlaces:
                    </p>
                    <ul className="space-y-1">
                      {item.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-md">{link}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {history.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay envíos todavía</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
