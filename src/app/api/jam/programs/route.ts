import { NextResponse } from 'next/server'
import { getAllPrograms } from '@/server/controllers/programs'

export async function GET() {
  try {
    const programs = await getAllPrograms()
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Programs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}
