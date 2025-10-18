'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Briefcase, Zap } from 'lucide-react';

type Track = 'founder' | 'professional' | 'freelancer';

interface TrackSelectionStepProps {
  selected?: Track;
  onUpdate: (track: Track) => void;
  onNext: () => void;
  onBack: () => void;
}

const TRACKS = [
  {
    id: 'founder' as Track,
    title: 'Founder Track',
    icon: Rocket,
    description: 'Build and launch your startup',
    details: [
      'Product-market fit validation',
      'User acquisition strategies',
      'Fundraising preparation',
      'Team building and scaling',
    ],
  },
  {
    id: 'professional' as Track,
    title: 'Professional Track',
    icon: Briefcase,
    description: 'Level up your tech career',
    details: [
      'Portfolio project development',
      'Interview preparation',
      'Networking opportunities',
      'Career advancement strategies',
    ],
  },
  {
    id: 'freelancer' as Track,
    title: 'Freelancer Track',
    icon: Zap,
    description: 'Build your independent practice',
    details: [
      'Client acquisition methods',
      'Rate optimization',
      'Personal branding',
      'Service productization',
    ],
  },
];

export function TrackSelectionStep({
  selected,
  onUpdate,
  onNext,
  onBack,
}: TrackSelectionStepProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track | undefined>(
    selected
  );

  const handleSelect = (track: Track) => {
    setSelectedTrack(track);
    onUpdate(track);
  };

  const handleSubmit = () => {
    if (!selectedTrack) {
      alert('Please select a track');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Track</h2>
        <p className="text-muted-foreground">
          Select the path that aligns with your goals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {TRACKS.map((track) => {
          const Icon = track.icon;
          const isSelected = selectedTrack === track.id;

          return (
            <Card
              key={track.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-primary ring-2 ring-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelect(track.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-lg">{track.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">{track.description}</p>
                <ul className="space-y-1.5">
                  {track.details.map((detail, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Your track determines which quests and
          mentors you&apos;ll be matched with. You can switch tracks later if your
          goals change.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1" disabled={!selectedTrack}>
          Continue
        </Button>
      </div>
    </div>
  );
}
