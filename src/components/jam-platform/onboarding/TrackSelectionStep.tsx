'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Rocket, Briefcase, Target } from 'lucide-react';
import { TRACKS, type Track } from '@/lib/jam/tracks';

interface TrackSelectionStepProps {
  selected?: Track;
  onUpdate: (track: Track) => void;
  onNext: () => void;
  onBack: () => void;
}

const TRACK_ICONS = {
  LEARNING: Sprout,
  FOUNDER: Rocket,
  PROFESSIONAL: Briefcase,
  FREELANCER: Target,
};

const TRACK_UI_CONFIG: Record<
  Track,
  { details: string[] }
> = {
  LEARNING: {
    details: [
      'Fundamentos de programación',
      'Tu primer proyecto con IA',
      'Desarrollo web básico',
      'Unirse a la comunidad tech',
    ],
  },
  FOUNDER: {
    details: [
      'Validación producto-mercado',
      'Estrategias de adquisición de usuarios',
      'Preparación para fundraising',
      'Construir y escalar equipo',
    ],
  },
  PROFESSIONAL: {
    details: [
      'Desarrollo de portafolio',
      'Preparación para entrevistas',
      'Oportunidades de networking',
      'Estrategias de avance profesional',
    ],
  },
  FREELANCER: {
    details: [
      'Métodos de adquisición de clientes',
      'Optimización de tarifas',
      'Marca personal',
      'Productización de servicios',
    ],
  },
};

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
      alert('Por favor selecciona una ruta');
      return;
    }
    onNext();
  };

  const allTracks = Object.keys(TRACKS) as Track[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Elige Tu Ruta</h2>
        <p className="text-muted-foreground">
          Selecciona el camino que se alinea con tus objetivos
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {allTracks.map((trackKey) => {
          const track = TRACKS[trackKey];
          const Icon = TRACK_ICONS[trackKey];
          const uiConfig = TRACK_UI_CONFIG[trackKey];
          const isSelected = selectedTrack === trackKey;

          return (
            <Card
              key={trackKey}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-primary ring-2 ring-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelect(trackKey)}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-2xl">{track.icon}</div>
                </div>
                <CardTitle className="text-lg">{track.titleEs}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">{track.descriptionEs}</p>
                <ul className="space-y-1.5">
                  {uiConfig.details.map((detail, idx) => (
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
          <strong>Nota:</strong> Tu ruta determina las misiones y mentores con los que
          serás emparejado. Puedes cambiar de ruta más adelante si tus objetivos cambian.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={handleSubmit} className="flex-1" disabled={!selectedTrack}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
