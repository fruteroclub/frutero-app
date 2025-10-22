'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeStep } from './WelcomeStep';
import { ProfileStep } from './ProfileStep';
import { ProjectChoiceStep } from './ProjectChoiceStep';
import { ProjectDetailsStep } from './ProjectDetailsStep';
import { TrackSelectionStep } from './TrackSelectionStep';
import { GoalsStep } from './GoalsStep';
import { CompleteStep } from './CompleteStep';
import { ProgressIndicator } from './ProgressIndicator';
import type { OnboardingData } from '@/server/controllers/onboarding';

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'profile', title: 'Profile' },
  { id: 'project-choice', title: 'Team Setup' },
  { id: 'project-details', title: 'Project' },
  { id: 'track', title: 'Track' },
  { id: 'goals', title: 'Goals' },
  { id: 'complete', title: 'Complete' },
];

const STORAGE_KEY = 'jam-onboarding-draft';

export function OnboardingWizard({ userId }: { userId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    profile: { firstName: '' },
    projectChoice: 'skip',
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only load draft if it belongs to the current user (or no userId stored)
        if (!parsed.userId || parsed.userId === userId) {
          setFormData(parsed.formData || {});
          setCurrentStep(parsed.currentStep || 0);
        } else {
          // Clear draft from different user
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [userId]);

  // Save draft to localStorage whenever formData or currentStep changes
  useEffect(() => {
    if (currentStep > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ userId, formData, currentStep })
      );
    }
  }, [userId, formData, currentStep]);

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    // Skip project details step if not creating a project
    if (
      currentStep === 2 &&
      formData.projectChoice !== 'create'
    ) {
      setCurrentStep(4); // Jump to track selection
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    // Skip project details step when going back if not creating
    if (
      currentStep === 4 &&
      formData.projectChoice !== 'create'
    ) {
      setCurrentStep(2); // Jump back to project choice
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/jam/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Clear draft from localStorage
      localStorage.removeItem(STORAGE_KEY);

      // Move to completion step
      nextStep();
    } catch (error) {
      console.error('Onboarding submission error:', error);
      alert('Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/jam/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <ProfileStep
            data={formData.profile || {}}
            onUpdate={(profile) => updateFormData({ profile })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <ProjectChoiceStep
            userId={userId}
            choice={formData.projectChoice || 'skip'}
            onUpdate={(choice, projectId) =>
              updateFormData({ projectChoice: choice, projectId })
            }
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ProjectDetailsStep
            data={formData.projectData}
            onUpdate={(projectData) => updateFormData({ projectData })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <TrackSelectionStep
            selected={formData.track}
            onUpdate={(track) => updateFormData({ track })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <GoalsStep
            goals={formData.goals || ''}
            onUpdate={(goals) => updateFormData({ goals })}
            onNext={handleSubmit}
            onBack={prevStep}
            isLoading={isLoading}
          />
        );
      case 6:
        return <CompleteStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <ProgressIndicator
        steps={STEPS}
        currentStep={currentStep}
        projectChoice={formData.projectChoice}
      />
      <div className="mt-8">{renderStep()}</div>
    </div>
  );
}
