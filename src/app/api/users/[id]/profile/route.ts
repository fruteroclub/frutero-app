import { NextRequest, NextResponse } from 'next/server'
import { UserControllerDrizzle } from '@/server/controllers/user-controller'
import { AppError } from '@/server/utils'

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const data = await request.json()
    const user = await UserControllerDrizzle.updateUserProfile(params.id, data)
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    const params = await props.params
    console.error(`POST /api/users/${params.id}/profile error:`, error)
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
