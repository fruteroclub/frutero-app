'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Plus, X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  updateQuestProgress,
  submitQuestForCompletion,
} from '@/services/jam/user-quests.service'
import { useAppAuth } from '@/store/auth-context'

interface IndividualQuestSubmissionFormProps {
  questId: string
  currentProgress?: number
  currentStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  currentSubmission?: {
    submissionText?: string | null
    submissionUrls?: string[] | null
  }
  onSuccess?: () => void
}

export function IndividualQuestSubmissionForm({
  questId,
  currentProgress = 0,
  currentStatus = 'NOT_STARTED',
  currentSubmission,
  onSuccess,
}: IndividualQuestSubmissionFormProps) {
  const { user } = useAppAuth()
  const [progress, setProgress] = useState(currentProgress)
  const [submissionText, setSubmissionText] = useState(
    currentSubmission?.submissionText || ''
  )
  const [submissionUrls, setSubmissionUrls] = useState<string[]>(
    currentSubmission?.submissionUrls || ['']
  )
  const [loading, setLoading] = useState(false)

  const isCompleted = currentStatus === 'COMPLETED'

  const handleAddUrl = () => {
    setSubmissionUrls([...submissionUrls, ''])
  }

  const handleRemoveUrl = (index: number) => {
    setSubmissionUrls(submissionUrls.filter((_, i) => i !== index))
  }

  const handleUpdateUrl = (index: number, value: string) => {
    const newUrls = [...submissionUrls]
    newUrls[index] = value
    setSubmissionUrls(newUrls)
  }

  const handleSaveProgress = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión')
      return
    }

    setLoading(true)
    try {
      await updateQuestProgress(questId, user.id, {
        progress,
        submissionText: submissionText || undefined,
        submissionUrls: submissionUrls.filter((url) => url.trim() !== ''),
      })

      toast.success('Progreso guardado')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save progress:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Error al guardar progreso'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión')
      return
    }

    if (!submissionText.trim()) {
      toast.error('Debes describir tu trabajo')
      return
    }

    setLoading(true)
    try {
      await submitQuestForCompletion(questId, user.id, {
        submissionText,
        submissionUrls: submissionUrls.filter((url) => url.trim() !== ''),
      })

      toast.success('¡Quest completado!')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to submit quest:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Error al enviar quest'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (isCompleted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quest Completado</CardTitle>
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="mr-1 h-4 w-4" />
              Completado
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Descripción del Trabajo</Label>
              <p className="mt-2 rounded-md border p-3 text-sm">
                {currentSubmission?.submissionText}
              </p>
            </div>

            {currentSubmission?.submissionUrls &&
              currentSubmission.submissionUrls.length > 0 && (
                <div>
                  <Label>Links de Evidencia</Label>
                  <div className="mt-2 space-y-2">
                    {currentSubmission.submissionUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envía tu Progreso</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (progress >= 100) {
              handleSubmit()
            } else {
              handleSaveProgress()
            }
          }}
          className="space-y-6"
        >
          {/* Progress Slider */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Progreso Completado</Label>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
            />
            <Progress value={progress} className="mt-2" />
          </div>

          {/* Submission Text */}
          <div>
            <Label htmlFor="submissionText">
              Descripción del Trabajo
              {progress >= 100 && <span className="text-red-500"> *</span>}
            </Label>
            <Textarea
              id="submissionText"
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="¿Qué lograste? ¿Qué aprendiste?"
              rows={4}
              className="mt-2"
            />
          </div>

          {/* Submission URLs */}
          <div>
            <Label>Pruebas de Trabajo (Links)</Label>
            <div className="mt-2 space-y-2">
              {submissionUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleUpdateUrl(i, e.target.value)}
                    placeholder="GitHub, demo, screenshot, etc."
                  />
                  {submissionUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveUrl(i)}
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
                onClick={handleAddUrl}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Link
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {progress < 100 ? (
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Guardando...' : 'Guardar Progreso'}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || !submissionText.trim()}
                className="w-full"
              >
                {loading ? 'Enviando...' : 'Enviar para Completar'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
