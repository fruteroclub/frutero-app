import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Edit, Share2 } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          disabled
        >
          <Plus className="mr-2 h-4 w-4" />
          Enviar Quest Completado
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          disabled
        >
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Sesión con Mentor
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          disabled
        >
          <Edit className="mr-2 h-4 w-4" />
          Actualizar Proyecto
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          disabled
        >
          <Share2 className="mr-2 h-4 w-4" />
          Crear Post Build in Public
        </Button>
      </CardContent>
    </Card>
  );
}
