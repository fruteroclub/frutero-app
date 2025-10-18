'use client';

import { useAppAuth } from '@/store/auth-context';
import { ProjectForm } from '@/components/jam-platform/projects/ProjectForm';
import Link from 'next/link';

export default function CreateProjectPage() {
  const { user, isAppAuthenticated, isLoading } = useAppAuth();

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAppAuthenticated || !user) {
    return (
      <div className="container max-w-2xl py-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Autenticación Requerida</h2>
            <p className="text-muted-foreground">
              Por favor inicia sesión para crear un proyecto.
            </p>
            <Link
              href="/"
              className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Ir a Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Crea Tu Proyecto</h1>
        <p className="text-muted-foreground">
          Inicia un nuevo proyecto e invita a miembros del equipo para colaborar
        </p>
      </div>

      <ProjectForm userId={user.id} />
    </div>
  );
}
