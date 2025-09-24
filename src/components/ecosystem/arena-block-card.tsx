import { ArenaBlock } from '@/types/arena'
import { formatArenaContent } from '@/lib/arena-api'
import { ExternalLink, FileText, Image as ImageIcon, Link as LinkIcon, User } from 'lucide-react'
import Image from 'next/image'

interface ArenaBlockCardProps {
  block: ArenaBlock
  variant: 'admin' | 'public'
}

export default function ArenaBlockCard({ block, variant }: ArenaBlockCardProps) {
  const content = formatArenaContent(block)
  const isAdmin = variant === 'admin'
  
  const borderColor = isAdmin ? 'border-yellow-200' : 'border-green-200'
  const bgColor = isAdmin ? 'bg-yellow-50/50' : 'bg-green-50/50'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    })
  }

  const renderContent = () => {
    switch (content.type) {
      case 'image':
        return (
          <div className="space-y-3">
            {content.url && (
              <div className="relative w-full h-32 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={content.url}
                  alt={content.title || 'Imagen'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            {content.title && (
              <h4 className="font-medium text-sm text-foreground line-clamp-2">
                {content.title}
              </h4>
            )}
            {content.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {content.description}
              </p>
            )}
          </div>
        )
      
      case 'link':
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <LinkIcon className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm text-foreground line-clamp-2">
                  {content.title}
                </h4>
                {content.url && (
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors line-clamp-1 flex items-center gap-1"
                  >
                    <span className="truncate">{content.url}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                )}
                {content.provider && (
                  <span className="text-xs text-muted-foreground">
                    via {content.provider}
                  </span>
                )}
              </div>
            </div>
            {content.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 ml-6">
                {content.description}
              </p>
            )}
          </div>
        )
      
      case 'text':
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                {content.title && (
                  <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                    {content.title}
                  </h4>
                )}
                {content.content && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {content.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground line-clamp-2">
              {content.title || 'Contenido sin título'}
            </h4>
            {content.content && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {content.content}
              </p>
            )}
          </div>
        )
    }
  }

  return (
    <div className={`border ${borderColor} ${bgColor} rounded-lg p-4 hover:shadow-sm transition-all duration-200`}>
      <div className="space-y-3">
        {renderContent()}
        
        <div className="flex items-center justify-between pt-2 border-t border-current/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{block.user.first_name}</span>
          </div>
          <time className="text-xs text-muted-foreground">
            {formatDate(block.connected_at)}
          </time>
        </div>
      </div>
    </div>
  )
}