'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectFormProps {
  userId: string
  initialData?: {
    id?: string
    name?: string
    description?: string
    category?: string
    stage?: string
    walletAddress?: string
    website?: string
  }
}

export function ProjectForm({ userId, initialData }: ProjectFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    stage: initialData?.stage || 'IDEA',
    walletAddress: initialData?.walletAddress || '',
    website: initialData?.website || '',
  })

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/jam/projects', {
        method: initialData?.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          adminId: userId,
          ...(initialData?.id && { id: initialData.id }),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save project')
      }

      return response.json()
    },
    onSuccess: (project) => {
      router.push(`/jam/projects/${project.slug}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData?.id ? 'Editar Proyecto' : 'Detalles del Proyecto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mutation.error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Failed to save project'}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Proyecto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Awesome DApp"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="¿Qué estás construyendo? (2-3 oraciones)"
              required
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web3">Web3/Blockchain</SelectItem>
                <SelectItem value="DeFi">DeFi</SelectItem>
                <SelectItem value="NFT">NFT/Digital Art</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="AI">AI/ML</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Etapa del Proyecto</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) =>
                setFormData({ ...formData, stage: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDEA">Idea</SelectItem>
                <SelectItem value="PROTOTYPE">Prototipo</SelectItem>
                <SelectItem value="BUILD">En Construcción</SelectItem>
                <SelectItem value="PROJECT">Proyecto Activo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet del Equipo (Opcional)</Label>
            <Input
              id="wallet"
              type="text"
              value={formData.walletAddress}
              onChange={(e) =>
                setFormData({ ...formData, walletAddress: e.target.value })
              }
              placeholder="0x... (para recibir pagos de bounties)"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Dirección de wallet para recibir bounties de quests del equipo
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web (Opcional)</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://tuproyecto.com"
            />
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending
              ? initialData?.id
                ? 'Actualizando...'
                : 'Creando...'
              : initialData?.id
                ? 'Actualizar Proyecto'
                : 'Crear Proyecto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
