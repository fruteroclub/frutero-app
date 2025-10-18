import { NextResponse } from 'next/server'
import { UserControllerDrizzle } from '@/server/controllers/user-controller'
import { AppError } from '@/server/utils'
import { CreateUserInput } from '@/server/schema/user-services-schema'

export async function GET() {
  try {
    const users = await UserControllerDrizzle.findAll()
    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error('GET /api/users error:', error)
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

export async function POST(request: Request) {
  try {
    const body: CreateUserInput = await request.json()

    const user = await UserControllerDrizzle.findOrCreate(body)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
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
