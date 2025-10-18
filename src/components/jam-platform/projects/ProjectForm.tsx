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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Github,
  Video,
  Globe,
  Presentation,
  Image as ImageIcon,
  Twitter,
  Wallet,
} from 'lucide-react'

interface ProjectFormProps {
  userId: string
  initialData?: {
    id?: string
    name?: string
    description?: string
    category?: string
    stage?: string
    repositoryUrl?: string
    videoUrl?: string
    productionUrl?: string
    pitchDeckUrl?: string
    avatarUrl?: string
    xUsername?: string
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
    repositoryUrl: initialData?.repositoryUrl || '',
    videoUrl: initialData?.videoUrl || '',
    productionUrl: initialData?.productionUrl || '',
    pitchDeckUrl: initialData?.pitchDeckUrl || '',
    avatarUrl: initialData?.avatarUrl || '',
    xUsername: initialData?.xUsername || '',
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
        <CardDescription>
          Completa la información de tu proyecto para la submission del
          hackathon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {mutation.error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Failed to save project'}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              <p className="text-sm text-foreground">
                Datos principales de tu proyecto
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  Nombre del Proyecto{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: DeFi Protocol"
                  required
                  maxLength={100}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Descripción <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe tu proyecto en 2-3 oraciones. ¿Qué problema resuelves? ¿Cómo funciona?"
                  required
                  maxLength={500}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/500 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DeFi">
                      DeFi/Decentralized Finance
                    </SelectItem>
                    <SelectItem value="RWA">RWA/Real World Assets</SelectItem>
                    <SelectItem value="Consumer">Consumer Apps</SelectItem>
                    <SelectItem value="Stablecoins">Stablecoins</SelectItem>
                    <SelectItem value="Infrastructure">
                      Infrastructure
                    </SelectItem>
                    <SelectItem value="PublicGoods">Public Goods</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
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
                    <SelectItem value="IDEA">💡 Idea</SelectItem>
                    <SelectItem value="PROTOTYPE">🔨 Prototipo</SelectItem>
                    <SelectItem value="BUILD">🚧 En Construcción</SelectItem>
                    <SelectItem value="PROJECT">🚀 Proyecto Activo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Demo & Assets */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">Demo & Recursos</h3>
              <p className="text-sm text-muted-foreground">
                Links para que los jueces puedan evaluar tu proyecto
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video Demo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  placeholder="https://loom.com/share/..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Link a Loom, YouTube, o video de demostración
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="repositoryUrl"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  Repositorio GitHub <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="repositoryUrl"
                  type="url"
                  value={formData.repositoryUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, repositoryUrl: e.target.value })
                  }
                  placeholder="https://github.com/username/repo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="productionUrl"
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  URL de Producción <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productionUrl"
                  type="url"
                  value={formData.productionUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, productionUrl: e.target.value })
                  }
                  placeholder="https://tuproyecto.vercel.app"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Deployment en Vercel, Netlify, o similar
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="pitchDeckUrl"
                  className="flex items-center gap-2"
                >
                  <Presentation className="h-4 w-4" />
                  Pitch Deck
                </Label>
                <Input
                  id="pitchDeckUrl"
                  type="url"
                  value={formData.pitchDeckUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, pitchDeckUrl: e.target.value })
                  }
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-muted-foreground">
                  Link público a Google Drive, Dropbox, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Branding */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">Identidad Visual</h3>
              <p className="text-sm text-muted-foreground">
                Logo y presencia web de tu proyecto
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Logo del Proyecto
                </Label>
                <Input
                  id="avatarUrl"
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, avatarUrl: e.target.value })
                  }
                  placeholder="https://tu-logo.png"
                />
                <p className="text-xs text-muted-foreground">
                  URL de imagen cuadrada (recomendado 400x400px)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Sitio Web
                </Label>
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
            </div>
          </div>

          {/* Section 4: Social & Contact */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">Redes & Contacto</h3>
              <p className="text-sm text-muted-foreground">
                Información de contacto y redes sociales
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="xUsername" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter/X Username
                </Label>
                <Input
                  id="xUsername"
                  value={formData.xUsername}
                  onChange={(e) =>
                    setFormData({ ...formData, xUsername: e.target.value })
                  }
                  placeholder="@tuproyecto"
                />
                <p className="text-xs text-muted-foreground">
                  Cuenta de Twitter/X del proyecto
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="walletAddress"
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet del Equipo
                </Label>
                <Input
                  id="walletAddress"
                  value={formData.walletAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, walletAddress: e.target.value })
                  }
                  placeholder="0x..."
                />
                <p className="text-xs text-muted-foreground">
                  Dirección para recibir premios y bounties
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending
                ? initialData?.id
                  ? 'Actualizando...'
                  : 'Creando...'
                : initialData?.id
                  ? 'Actualizar Proyecto'
                  : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
