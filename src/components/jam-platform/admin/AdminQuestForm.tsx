'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useAppAuth } from '@/store/auth-context'

interface AdminQuestFormProps {
  onSuccess?: () => void
}

export function AdminQuestForm({ onSuccess }: AdminQuestFormProps) {
  const { user } = useAppAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'TEAM' | 'BOTH',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    rewardPoints: 10,
    bountyUsd: undefined as number | undefined,
    maxSubmissions: undefined as number | undefined,
    start: '',
    end: '',
    availableFrom: '',
    dueDate: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Debes iniciar sesión')
      return
    }

    if (!formData.title || !formData.start || !formData.end) {
      toast.error('Título, fecha de inicio y fin son requeridos')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/jam/admin/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear quest')
      }

      toast.success('Quest creado exitosamente')
      onSuccess?.()

      // Reset form
      setFormData({
        title: '',
        description: '',
        questType: 'INDIVIDUAL',
        category: '',
        difficulty: 'medium',
        rewardPoints: 10,
        bountyUsd: undefined,
        maxSubmissions: undefined,
        start: '',
        end: '',
        availableFrom: '',
        dueDate: '',
      })
    } catch (error) {
      console.error('Failed to create quest:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear quest'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Quest</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Quest Type */}
            <div>
              <Label htmlFor="questType">Tipo de Quest</Label>
              <Select
                value={formData.questType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    questType: value as 'INDIVIDUAL' | 'TEAM' | 'BOTH',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                  <SelectItem value="TEAM">Team</SelectItem>
                  <SelectItem value="BOTH">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div>
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    difficulty: value as 'easy' | 'medium' | 'hard',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="technical, community, etc."
              />
            </div>

            {/* Reward Points */}
            <div>
              <Label htmlFor="rewardPoints">Puntos de Recompensa</Label>
              <Input
                id="rewardPoints"
                type="number"
                value={formData.rewardPoints}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rewardPoints: parseInt(e.target.value),
                  })
                }
              />
            </div>

            {/* Bounty USD */}
            <div>
              <Label htmlFor="bountyUsd">Bounty (USD)</Label>
              <Input
                id="bountyUsd"
                type="number"
                value={formData.bountyUsd || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bountyUsd: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="Para team quests"
              />
            </div>

            {/* Max Submissions */}
            <div>
              <Label htmlFor="maxSubmissions">Máximo de Submissions</Label>
              <Input
                id="maxSubmissions"
                type="number"
                value={formData.maxSubmissions || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxSubmissions: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="Dejar vacío para ilimitado"
              />
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="start">
                Fecha de Inicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={formData.start}
                onChange={(e) =>
                  setFormData({ ...formData, start: e.target.value })
                }
                required
              />
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="end">
                Fecha de Fin <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.end}
                onChange={(e) =>
                  setFormData({ ...formData, end: e.target.value })
                }
                required
              />
            </div>

            {/* Available From */}
            <div>
              <Label htmlFor="availableFrom">Disponible Desde</Label>
              <Input
                id="availableFrom"
                type="datetime-local"
                value={formData.availableFrom}
                onChange={(e) =>
                  setFormData({ ...formData, availableFrom: e.target.value })
                }
              />
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="dueDate">Fecha Límite</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creando...' : 'Crear Quest'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
