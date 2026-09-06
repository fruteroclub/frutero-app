#!/bin/bash

# Seed Programs Script
# Usage: bun run seed:programs

echo "🌱 Seeding external programs..."

# Load .env.local if it exists
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable not set"
  echo "💡 Make sure .env.local exists with DATABASE_URL"
  exit 1
fi

# Run the seed SQL file
psql "$DATABASE_URL" -f scripts/seed-programs.sql

if [ $? -eq 0 ]; then
  echo "✅ Programs seeded successfully!"
  echo ""
  echo "🎯 Test the programs page:"
  echo "   http://localhost:3000/jam/programs"
else
  echo "❌ Error seeding programs"
  exit 1
fi
