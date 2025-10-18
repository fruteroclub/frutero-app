'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  updateQuestProgress,
  submitQuest,
  type ProjectQuest,
} from '@/services/jam/project-quests.service'
import { useAppAuth } from '@/store/auth-context'
import { toast } from 'sonner'

interface QuestSubmissionFormProps {
  projectSlug: string
  questId: string
  currentSubmission?: ProjectQuest
  onUpdate?: () => void
}

export function QuestSubmissionForm({
  projectSlug,
  questId,
  currentSubmission,
  onUpdate,
}: QuestSubmissionFormProps) {
  const { user } = useAppAuth()
  const [submissionLink, setSubmissionLink] = useState(
    currentSubmission?.submissionLink || ''
  )
  const [submissionText, setSubmissionText] = useState(
    currentSubmission?.submissionText || ''
  )
  const [progress, setProgress] = useState(currentSubmission?.progress || 0)
  const [loading, setLoading] = useState(false)

  const isSubmitted =
    currentSubmission?.status === 'SUBMITTED' ||
    currentSubmission?.status === 'VERIFIED'
  const isVerified = currentSubmission?.status === 'VERIFIED'

  const handleSaveProgress = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión')
      return
    }

    setLoading(true)
    try {
      await updateQuestProgress(projectSlug, questId, user.id, {
        progress,
        submissionLink,
        submissionText,
      })
      toast.success('Progreso guardado')
      onUpdate?.()
    } catch (error) {
      console.error('Failed to save:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar progreso'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Debes iniciar sesión')
      return
    }

    if (progress < 100) {
      toast.error('Debes completar el quest al 100% para enviar')
      return
    }

    if (!submissionLink || !submissionText) {
      toast.error('Link y descripción son requeridos')
      return
    }

    setLoading(true)
    try {
      await submitQuest(projectSlug, questId, user.id, {
        submissionLink,
        submissionText,
      })
      toast.success('¡Quest enviado para verificación!')
      onUpdate?.()
    } catch (error) {
      console.error('Failed to submit:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar quest'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (isVerified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quest Verificado ✅</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este quest ha sido verificado y aprobado.
          </p>
          {currentSubmission.verificationNotes && (
            <div className="mt-4 bg-muted p-3 rounded-md">
              <p className="text-xs font-medium mb-1">Notas de verificación:</p>
              <p className="text-xs text-muted-foreground">
                {currentSubmission.verificationNotes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isSubmitted ? 'Quest Enviado' : 'Envía Tu Trabajo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tu quest ha sido enviado y está pendiente de verificación.
            </p>
            {submissionLink && (
              <div>
                <p className="text-xs font-medium mb-1">Link enviado:</p>
                <a
                  href={submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {submissionLink}
                </a>
              </div>
            )}
            {submissionText && (
              <div>
                <p className="text-xs font-medium mb-1">Descripción:</p>
                <p className="text-sm text-muted-foreground">{submissionText}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="progress">Progreso</Label>
              <div className="flex items-center gap-4">
                <input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold w-12">{progress}%</span>
              </div>
            </div>

            <div>
              <Label htmlFor="link">Link de Entrega</Label>
              <Input
                id="link"
                type="url"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                placeholder="https://github.com/equipo/proyecto"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Link a tu proyecto, demo, o repositorio
              </p>
            </div>

            <div>
              <Label htmlFor="text">Descripción</Label>
              <Textarea
                id="text"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Describe lo que construiste, los desafíos que enfrentaste y los logros clave..."
                rows={6}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveProgress}
                disabled={loading}
              >
                Guardar Progreso
              </Button>
              <Button type="submit" disabled={loading || progress < 100}>
                {loading ? 'Enviando...' : 'Enviar para Verificación'}
              </Button>
            </div>

            {progress < 100 && (
              <p className="text-xs text-muted-foreground">
                Completa el quest al 100% para enviarlo para verificación
              </p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  )
}
