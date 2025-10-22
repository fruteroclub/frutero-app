'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function QuestFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || 'all'
  const currentDifficulty = searchParams.get('difficulty') || 'all'

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Card>
      <CardContent className="flex gap-4 pt-6">
        {/* Category Filter */}
        <div className="flex-1 space-y-2">
          <Label className="text-xs font-medium">Categoría</Label>
          <Select
            value={currentCategory}
            onValueChange={(value) => updateFilter('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="technical">Técnico</SelectItem>
              <SelectItem value="community">Comunidad</SelectItem>
              <SelectItem value="learning">Aprendizaje</SelectItem>
              <SelectItem value="project">Proyecto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex-1 space-y-2">
          <Label className="text-xs font-medium">Dificultad</Label>
          <Select
            value={currentDifficulty}
            onValueChange={(value) => updateFilter('difficulty', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="easy">Fácil</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="hard">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
