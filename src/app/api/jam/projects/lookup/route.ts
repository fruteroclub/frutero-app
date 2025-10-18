import { NextRequest, NextResponse } from 'next/server';
import { findProjectByCode } from '@/server/controllers/onboarding';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Project code is required' },
        { status: 400 }
      );
    }

    const project = await findProjectByCode(code);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Project lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup project' },
      { status: 500 }
    );
  }
}
