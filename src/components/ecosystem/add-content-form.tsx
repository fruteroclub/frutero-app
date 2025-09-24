'use client'

import { useState } from 'react'
import { addBlockToChannelClient } from '@/lib/arena-client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Loader2, Link as LinkIcon, FileText } from 'lucide-react'

interface AddContentFormProps {
  channelSlug: string
  onContentAdded: () => void
}

export default function AddContentForm({ channelSlug, onContentAdded }: AddContentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [textContent, setTextContent] = useState('')
  const [activeTab, setActiveTab] = useState('link')

  const handleSubmit = async (e: React.FormEvent, type: 'link' | 'text') => {
    e.preventDefault()
    
    if (isSubmitting) return

    const content = type === 'link' 
      ? linkUrl.trim() 
      : textContent.trim()
    
    if (!content) return

    setIsSubmitting(true)

    try {
      const body = type === 'link' 
        ? { source: content }
        : { content }
      
      await addBlockToChannelClient(channelSlug, body)
      
      // Reset form
      if (type === 'link') {
        setLinkUrl('')
      } else {
        setTextContent('')
      }
      
      // Notify parent component
      onContentAdded()
    } catch (error) {
      console.error('Error adding content:', error)
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border border-green-300 rounded-lg p-4 bg-white/50">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-4 w-4 text-green-600" />
        <h3 className="font-medium text-sm text-foreground">
          Agregar contenido
        </h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="link" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Link
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Texto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="space-y-3">
          <form onSubmit={(e) => handleSubmit(e, 'link')} className="space-y-3">
            <div>
              <Label htmlFor="link-url" className="text-xs font-medium text-muted-foreground">
                URL del link
              </Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full"
              disabled={!linkUrl.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Agregar Link
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="text" className="space-y-3">
          <form onSubmit={(e) => handleSubmit(e, 'text')} className="space-y-3">
            <div>
              <Label htmlFor="text-content" className="text-xs font-medium text-muted-foreground">
                Contenido de texto
              </Label>
              <Textarea
                id="text-content"
                placeholder="Comparte una idea, reflexión o texto..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={3}
                className="mt-1 resize-none"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full"
              disabled={!textContent.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Agregar Texto
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}