import { CheckIcon, CopyIcon } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface CopyButtonProps {
  text: string
  className?: string
  successMessage?: string
  duration?: number
}

export function CopyButton({
  text,
  className = '',
  successMessage,
  duration,
}: CopyButtonProps) {
  const { hasCopied, handleCopy } = useCopyToClipboard({
    text,
    successMessage,
    duration,
  })

  return (
    <button
      onClick={handleCopy}
      className={`text-foreground transition-colors hover:text-primary ${className}`}
    >
      {hasCopied ? (
        <CheckIcon className="h-[0.875rem] w-[0.875rem]" />
      ) : (
        <CopyIcon className="h-[0.875rem] w-[0.875rem]" />
      )}
    </button>
  )
}
