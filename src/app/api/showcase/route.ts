import { NextResponse } from 'next/server';
import { ShowcaseController } from '@/server/controllers/showcase-controller';
import { AppError } from '@/server/utils';

export async function GET() {
  try {
    const showcaseData = await ShowcaseController.getAllShowcaseData();
    return NextResponse.json({ data: showcaseData });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
