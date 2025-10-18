import { NextRequest, NextResponse } from 'next/server'
import { UserControllerDrizzle } from '@/server/controllers/user-controller'
import { AppError } from '@/server/utils'

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const data = await request.json()

    if (!data.farcasterId || !data.farcasterDisplayName || !data.farcasterUsername || !data.farcasterAvatarUrl) {
      return NextResponse.json(
        { error: 'Missing required Farcaster data' },
        { status: 400 }
      )
    }

    const user = await UserControllerDrizzle.updateUserFarcasterAccount(
      params.id,
      data.farcasterId,
      data.farcasterDisplayName,
      data.farcasterUsername,
      data.farcasterAvatarUrl
    )
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    const params = await props.params
    console.error(`PATCH /api/users/${params.id}/farcaster error:`, error)
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
