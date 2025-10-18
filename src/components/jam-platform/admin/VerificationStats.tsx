'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'

interface Stats {
  pending: number
  verifiedToday: number
  totalPaid: number
}

async function getVerificationStats(adminId: string): Promise<Stats> {
  const response = await fetch(
    `/api/jam/admin/submissions?stats=true&adminId=${adminId}`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }
  return response.json()
}

export function VerificationStats() {
  const { user } = useAppAuth()

  const { data: stats } = useQuery<Stats>({
    queryKey: ['verification-stats'],
    queryFn: () => getVerificationStats(user!.id),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (!stats) {
    return null
  }

  return (
    <div className="flex gap-4">
      <StatCard label="Pendientes" value={stats.pending} color="yellow" />
      <StatCard label="Verificados Hoy" value={stats.verifiedToday} color="green" />
      <StatCard label="Bounties Pagados" value={`$${stats.totalPaid}`} color="blue" />
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: 'yellow' | 'green' | 'blue'
}) {
  const colorClasses = {
    yellow: 'bg-yellow-50 dark:bg-yellow-950',
    green: 'bg-green-50 dark:bg-green-950',
    blue: 'bg-blue-50 dark:bg-blue-950',
  }

  return (
    <div className={`${colorClasses[color]} p-4 rounded-lg`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
