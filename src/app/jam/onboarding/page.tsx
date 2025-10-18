'use client';

import { useAppAuth } from '@/store/auth-context';
import { OnboardingWizard } from '@/components/jam-platform/onboarding/OnboardingWizard';
import PageWrapper from '@/components/layout/page-wrapper';
import Link from 'next/link';

export default function OnboardingPage() {
  const { user, isAppAuthenticated, isLoading } = useAppAuth();

  // Debug logging
  console.log('🔍 JAM Onboarding - Auth State:', {
    isLoading,
    isAppAuthenticated,
    hasUser: !!user,
    userId: user?.id,
  });

  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page">
          <div className="container flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // If not authenticated, show message
  if (!isAppAuthenticated || !user) {
    return (
      <PageWrapper>
        <div className="page">
          <div className="container flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please log in to access the onboarding flow.
              </p>
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // TODO: Check if user already completed JAM onboarding
  // if (user.jamOnboardingComplete) {
  //   redirect('/jam/dashboard');
  // }

  return (
    <PageWrapper>
      <div className="page">
        <div className="container flex flex-col items-center gap-y-8 pb-12 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <OnboardingWizard userId={user.id} />
        </div>
      </div>
    </PageWrapper>
  );
}
