import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MentorFiltersProps {
  availability: string
  expertiseArea: string
  onAvailabilityChange: (value: string) => void
  onExpertiseAreaChange: (value: string) => void
}

export function MentorFilters({
  availability,
  expertiseArea,
  onAvailabilityChange,
  onExpertiseAreaChange,
}: MentorFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Select value={availability} onValueChange={onAvailabilityChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Disponibilidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="available">Disponible</SelectItem>
          <SelectItem value="limited">Limitada</SelectItem>
          <SelectItem value="unavailable">No Disponible</SelectItem>
        </SelectContent>
      </Select>

      <Select value={expertiseArea} onValueChange={onExpertiseAreaChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Área de Expertise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Áreas</SelectItem>
          <SelectItem value="frontend">Frontend</SelectItem>
          <SelectItem value="backend">Backend</SelectItem>
          <SelectItem value="blockchain">Blockchain</SelectItem>
          <SelectItem value="ai">Inteligencia Artificial</SelectItem>
          <SelectItem value="mobile">Mobile</SelectItem>
          <SelectItem value="devops">DevOps</SelectItem>
          <SelectItem value="design">Diseño</SelectItem>
          <SelectItem value="product">Producto</SelectItem>
          <SelectItem value="growth">Growth</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
