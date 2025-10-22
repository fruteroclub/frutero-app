'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Plus, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface IndividualQuestSubmissionFormProps {
  questId: string
  userId: string
  rewardPoints?: number
  currentProgress?: number
  currentSubmission?: {
    submissionText?: string | null
    submissionUrls?: string[] | null
    status?: string
  }
  onUpdate?: () => void
}

export function IndividualQuestSubmissionForm({
  questId,
  userId,
  rewardPoints = 0,
  currentProgress = 0,
  currentSubmission,
  onUpdate,
}: IndividualQuestSubmissionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(currentProgress)
  const [previousProgress, setPreviousProgress] = useState(currentProgress)
  const [submissionText, setSubmissionText] = useState(
    currentSubmission?.submissionText || ''
  )
  const [links, setLinks] = useState<string[]>(
    currentSubmission?.submissionUrls && currentSubmission.submissionUrls.length > 0
      ? currentSubmission.submissionUrls
      : ['']
  )

  const addLink = () => {
    if (links.length < 5) {
      setLinks([...links, ''])
    }
  }

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index))
    }
  }

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!submissionText.trim()) {
      toast.error('Por favor describe tu trabajo')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/jam/quests/${questId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          progress,
          submissionText,
          submissionUrls: links.filter((l) => l.trim()),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit progress')
      }

      const data = await response.json()

      if (data.status === 'COMPLETED') {
        toast.success(
          rewardPoints > 0
            ? `🎉 Quest completado! +${rewardPoints} puntos ganados!`
            : '🎉 Quest completado!',
          {
            description: 'Excelente trabajo completando este quest!',
          }
        )
      } else {
        // Check for milestone achievements
        const milestones = [25, 50, 75]
        const achievedMilestone = milestones.find(
          (milestone) => previousProgress < milestone && progress >= milestone
        )

        if (achievedMilestone) {
          const milestoneMessages = {
            25: '¡Buen comienzo! Continúa así',
            50: '¡Vas a la mitad! Sigue adelante',
            75: '¡Casi terminado! Un último empujón',
          }
          toast.success('Progreso actualizado!', {
            description: milestoneMessages[achievedMilestone as keyof typeof milestoneMessages],
          })
        } else {
          toast.success('Progreso actualizado exitosamente!', {
            description: `El quest está ahora ${progress}% completo`,
          })
        }
      }

      // Update previous progress for milestone tracking
      setPreviousProgress(progress)

      // Refresh page data
      router.refresh()
      onUpdate?.()
    } catch (error) {
      console.error('Error submitting progress:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al enviar progreso'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isComplete = currentProgress >= 100
  const status = currentSubmission?.status

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isComplete ? 'Quest Completado' : 'Enviar Progreso'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isComplete && status === 'COMPLETED' ? (
          <div className="text-center py-8">
            <div className="mb-4 text-4xl">🎉</div>
            <p className="text-lg font-medium mb-2">
              ¡Felicitaciones! Completaste este quest!
            </p>
            <p className="text-sm text-muted-foreground">
              Tu envío ha sido registrado y los puntos han sido otorgados.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Slider */}
            <div className="space-y-3">
              <Label htmlFor="progress">Progreso Completado</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="progress"
                  value={[progress]}
                  onValueChange={([v]) => setProgress(v)}
                  max={100}
                  step={10}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <span className="w-16 text-right font-medium tabular-nums">
                  {progress}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Desliza para indicar cuánto del quest has completado
              </p>
            </div>

            {/* Submission Text */}
            <div className="space-y-2">
              <Label htmlFor="submission-text">
                Descripción del Trabajo{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="submission-text"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="¿Qué lograste? ¿Qué aprendiste? ¿Qué desafíos enfrentaste?"
                rows={6}
                required
                disabled={isSubmitting}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Comparte tu progreso, aprendizajes y obstáculos que encontraste
              </p>
            </div>

            {/* Proof of Work Links */}
            <div className="space-y-3">
              <Label>Prueba de Trabajo (Links)</Label>
              <div className="space-y-2">
                {links.map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      type="url"
                      value={link}
                      onChange={(e) => updateLink(i, e.target.value)}
                      placeholder="GitHub, demo, screenshot, etc."
                      disabled={isSubmitting}
                    />
                    {links.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(i)}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLink}
                  disabled={isSubmitting || links.length >= 5}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Otro Link {links.length >= 5 && '(Máx 5)'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Agrega links a tu trabajo (GitHub, demo, screenshots, etc.)
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !submissionText.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>Actualizar Progreso</>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
