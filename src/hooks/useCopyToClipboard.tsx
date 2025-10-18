import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'

interface UseCopyToClipboardProps {
  text: string
  successMessage?: string
  duration?: number
}

interface UseCopyToClipboardReturn {
  hasCopied: boolean
  handleCopy: () => void
}

export function useCopyToClipboard({
  text,
  successMessage = 'Copied to clipboard',
  duration = 4000,
}: UseCopyToClipboardProps): UseCopyToClipboardReturn {
  const [hasCopied, setHasCopied] = useState(false)

  const handleCopy = useCallback(() => {
    copyToClipboard(text)
    setHasCopied(true)
    toast.info(successMessage)

    setTimeout(() => {
      setHasCopied(false)
    }, duration)
  }, [text, successMessage, duration])

  return { hasCopied, handleCopy }
}
