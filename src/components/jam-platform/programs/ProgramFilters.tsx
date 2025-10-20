'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProgramFiltersProps {
  category: string
  track: string
  timeline: string
  onCategoryChange: (value: string) => void
  onTrackChange: (value: string) => void
  onTimelineChange: (value: string) => void
}

export function ProgramFilters({
  category,
  track,
  timeline,
  onCategoryChange,
  onTrackChange,
  onTimelineChange,
}: ProgramFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Categorías</SelectItem>
          <SelectItem value="BUILD">Hackathons</SelectItem>
          <SelectItem value="LEARN">Cursos</SelectItem>
          <SelectItem value="ACCELERATE">Incubadoras</SelectItem>
          <SelectItem value="ONBOARD">Bootcamps</SelectItem>
        </SelectContent>
      </Select>

      <Select value={track} onValueChange={onTrackChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Track" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Tracks</SelectItem>
          <SelectItem value="defi">DeFi</SelectItem>
          <SelectItem value="nft">NFT</SelectItem>
          <SelectItem value="infrastructure">Infraestructura</SelectItem>
          <SelectItem value="gaming">Gaming</SelectItem>
          <SelectItem value="ai">AI</SelectItem>
          <SelectItem value="social">Social</SelectItem>
        </SelectContent>
      </Select>

      <Select value={timeline} onValueChange={onTimelineChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Cronología" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="upcoming">Próximos</SelectItem>
          <SelectItem value="active">Activos Ahora</SelectItem>
          <SelectItem value="past">Pasados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
