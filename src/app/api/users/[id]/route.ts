import { NextRequest, NextResponse } from 'next/server'
import { UserControllerDrizzle } from '@/server/controllers/user-controller'
import { AppError } from '@/server/utils'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const user = await UserControllerDrizzle.findById(params.id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    const params = await props.params
    console.error(`GET /api/users/${params.id} error:`, error)
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

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const data = await request.json()
    const user = await UserControllerDrizzle.updateUser(params.id, data)
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    const params = await props.params
    console.error(`PATCH /api/users/${params.id} error:`, error)
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

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    await UserControllerDrizzle.deleteUser(params.id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const params = await props.params
    console.error(`DELETE /api/users/${params.id} error:`, error)
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
