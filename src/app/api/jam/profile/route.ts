import { NextRequest, NextResponse } from 'next/server';
import { completeOnboarding, type OnboardingData } from '@/lib/jam/onboarding';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...onboardingData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!onboardingData.profile?.firstName) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }

    if (!onboardingData.track) {
      return NextResponse.json(
        { error: 'Track selection is required' },
        { status: 400 }
      );
    }

    if (!onboardingData.goals) {
      return NextResponse.json(
        { error: 'Goals are required' },
        { status: 400 }
      );
    }

    // Complete onboarding
    const result = await completeOnboarding(
      userId,
      onboardingData as OnboardingData
    );

    return NextResponse.json({
      success: true,
      projectId: result.projectId,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
