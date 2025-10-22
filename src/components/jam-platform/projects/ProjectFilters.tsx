import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface ProjectFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  stageFilter: string
  onStageChange: (value: string) => void
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  stageFilter,
  onStageChange,
}: ProjectFiltersProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="md:col-span-3">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              <SelectItem value="DeFi">DeFi/Decentralized Finance</SelectItem>
              <SelectItem value="RWA">RWA/Real World Assets</SelectItem>
              <SelectItem value="Consumer">Consumer Apps</SelectItem>
              <SelectItem value="Stablecoins">Stablecoins</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="PublicGoods">Public Goods</SelectItem>
              <SelectItem value="AI">AI</SelectItem>
              <SelectItem value="Web3">Web3/Blockchain</SelectItem>
              <SelectItem value="NFT">NFT/Digital Art</SelectItem>
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stage Filter */}
        <div>
          <Label htmlFor="stage">Etapa</Label>
          <Select value={stageFilter} onValueChange={onStageChange}>
            <SelectTrigger id="stage">
              <SelectValue placeholder="Todas las etapas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              <SelectItem value="IDEA">Idea</SelectItem>
              <SelectItem value="PROTOTYPE">Prototype</SelectItem>
              <SelectItem value="BUILD">Building</SelectItem>
              <SelectItem value="PROJECT">Live Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
