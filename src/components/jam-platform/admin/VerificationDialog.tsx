'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useAppAuth } from '@/store/auth-context'
import { toast } from 'sonner'

interface Submission {
  id: string
  quest: {
    title: string
  }
}

interface VerificationDialogProps {
  submission: Submission
  action: 'verify' | 'reject'
  onSuccess?: () => void
}

export function VerificationDialog({
  submission,
  action,
  onSuccess,
}: VerificationDialogProps) {
  const { user } = useAppAuth()
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [paymentTxHash, setPaymentTxHash] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Debes iniciar sesión')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/jam/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectQuestId: submission.id,
          action,
          verificationNotes: notes || undefined,
          paymentTxHash:
            action === 'verify' ? paymentTxHash || undefined : undefined,
          adminId: user.id, // TODO: Remove once we have server-side auth
        }),
      })

      if (response.ok) {
        toast.success(
          action === 'verify'
            ? 'Submission verificado exitosamente'
            : 'Submission rechazado',
        )
        setOpen(false)
        setNotes('')
        setPaymentTxHash('')
        onSuccess?.()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al procesar verificación')
      }
    } catch (error) {
      console.error('Verification failed:', error)
      toast.error('Error al procesar verificación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {action === 'verify' ? (
          <Button variant="default" className="flex-1">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verificar & Aprobar
          </Button>
        ) : (
          <Button variant="outline" className="flex-1">
            <XCircle className="mr-2 h-4 w-4" />
            Rechazar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'verify'
              ? 'Verificar Quest Submission'
              : 'Rechazar Quest Submission'}
          </DialogTitle>
          <DialogDescription>
            {action === 'verify'
              ? 'Aprueba este submission y opcionalmente registra los detalles de pago'
              : 'Rechaza este submission con feedback para el equipo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="notes">
              {action === 'verify'
                ? 'Notas de Verificación (Opcional)'
                : 'Razón del Rechazo'}
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                action === 'verify'
                  ? '¡Excelente trabajo! Cumple todos los requisitos...'
                  : 'Por favor aborda los siguientes puntos...'
              }
              required={action === 'reject'}
              rows={4}
            />
          </div>

          {action === 'verify' && (
            <div>
              <Label htmlFor="txHash">
                Hash de Transacción de Pago (Opcional)
              </Label>
              <Input
                id="txHash"
                value={paymentTxHash}
                onChange={(e) => setPaymentTxHash(e.target.value)}
                placeholder="0x..."
              />
              <p className="mt-1 text-xs text-foreground">
                Registra la transacción on-chain del pago del bounty
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={action === 'verify' ? 'default' : 'destructive'}
              disabled={loading}
            >
              {loading
                ? 'Procesando...'
                : action === 'verify'
                  ? 'Verificar & Aprobar'
                  : 'Rechazar Submission'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
