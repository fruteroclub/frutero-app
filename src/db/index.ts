import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Cliente PostgreSQL optimizado para Neon + Next.js
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false, // Requerido para Neon
  max: 1,         // Límite de conexiones para serverless
});

// Instancia de Drizzle ORM con schema
export const db = drizzle(client, { schema });

// Exportar cliente para migraciones
export { client };