'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ExternalLink, DollarSign } from 'lucide-react'
import { VerificationDialog } from './VerificationDialog'

interface Submission {
  id: string
  projectId: string
  questId: string
  status: string
  progress: number
  submissionLink: string | null
  submissionText: string | null
  submittedAt: string | null
  submittedBy: string | null
  project: {
    id: string
    name: string
    walletAddress?: string | null
  }
  quest: {
    id: string
    title: string
    bountyUsd: number | null
  }
  submitter: {
    id: string
    displayName: string
    avatarUrl?: string | null
  } | null
}

interface VerificationQueueProps {
  submissions: Submission[]
  onVerified?: () => void
}

export function VerificationQueue({
  submissions,
  onVerified,
}: VerificationQueueProps) {
  if (submissions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-foreground">No hay submissions en esta categoría</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          onVerified={onVerified}
        />
      ))}
    </div>
  )
}

function SubmissionCard({
  submission,
  onVerified,
}: {
  submission: Submission
  onVerified?: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <CardTitle className="text-lg">
                {submission.quest.title}
              </CardTitle>
              {submission.quest.bountyUsd && (
                <Badge variant="default" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />$
                  {submission.quest.bountyUsd}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <span>{submission.project.name}</span>
              <span>•</span>
              <span>
                Enviado{' '}
                {submission.submittedAt
                  ? new Date(submission.submittedAt).toLocaleDateString('es-ES')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Submitter Info */}
        {submission.submitter && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={submission.submitter.avatarUrl || undefined} />
              <AvatarFallback>
                {submission.submitter.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              Enviado por <strong>{submission.submitter.displayName}</strong>
            </span>
          </div>
        )}

        {/* Submission Content */}
        <div className="space-y-2">
          {submission.submissionLink && (
            <div>
              <p className="mb-1 text-sm font-medium">Link de Entrega</p>
              <a
                href={submission.submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {submission.submissionLink}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {submission.submissionText && (
            <div>
              <p className="mb-1 text-sm font-medium">Descripción</p>
              <p className="text-sm text-foreground">
                {submission.submissionText}
              </p>
            </div>
          )}
        </div>

        {/* Payment Info */}
        {submission.project.walletAddress && (
          <div className="rounded-md bg-muted p-3">
            <p className="mb-1 text-xs font-medium">Wallet del Equipo</p>
            <code className="text-xs break-all">
              {submission.project.walletAddress}
            </code>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <VerificationDialog
            submission={submission}
            action="verify"
            onSuccess={onVerified}
          />
          <VerificationDialog
            submission={submission}
            action="reject"
            onSuccess={onVerified}
          />
        </div>
      </CardContent>
    </Card>
  )
}
