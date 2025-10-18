import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Load environment variables from .env.local
config({ path: '.env.local' })

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: false, // Railway proxy handles SSL
  },
  verbose: true,
  strict: true,
  // Studio-specific configuration
  breakpoints: true,
  introspect: {
    casing: 'preserve',
  },
})
