'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { AdminProtected } from '@/components/auth/AdminProtected'
import { VerificationQueue } from '@/components/jam-platform/admin/VerificationQueue'
import { VerificationStats } from '@/components/jam-platform/admin/VerificationStats'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

async function getSubmissions(adminId: string, status: string) {
  const response = await fetch(
    `/api/jam/admin/submissions?status=${status}&adminId=${adminId}`
  )
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Unauthorized')
    }
    throw new Error('Failed to fetch submissions')
  }
  return response.json()
}

export default function VerificationDashboardPage() {
  const { user, isAppAuthenticated } = useAppAuth()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'SUBMITTED'

  // Fetch submissions
  const {
    data: submissions = [],
    isLoading: submissionsLoading,
    refetch,
  } = useQuery({
    queryKey: ['submissions', statusFilter],
    queryFn: () => getSubmissions(user!.id, statusFilter),
    enabled: isAppAuthenticated && !!user,
  })

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl pl-64">
          <AdminProtected>
            <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Verificaciones de Quests</h1>
              <p className="text-muted-foreground">
                Revisa y aprueba submissions de quests de equipos
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/jam/admin/quests">Gestionar Quests</Link>
              </Button>
              <VerificationStats />
            </div>
          </div>

          {/* Status Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <StatusFilterButton
                  status="SUBMITTED"
                  label="Pendientes"
                  active={statusFilter === 'SUBMITTED'}
                />
                <StatusFilterButton
                  status="VERIFIED"
                  label="Verificados"
                  active={statusFilter === 'VERIFIED'}
                />
                <StatusFilterButton
                  status="REJECTED"
                  label="Rechazados"
                  active={statusFilter === 'REJECTED'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submissions Queue */}
          {submissionsLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <VerificationQueue submissions={submissions} onVerified={() => refetch()} />
          )}
            </div>
          </AdminProtected>
        </div>
      </div>
    </PageWrapper>
  )
}

function StatusFilterButton({
  status,
  label,
  active,
}: {
  status: string
  label: string
  active: boolean
}) {
  return (
    <Button
      asChild
      variant={active ? 'default' : 'outline'}
      size="sm"
    >
      <Link href={`/jam/admin/verifications?status=${status}`}>{label}</Link>
    </Button>
  )
}
