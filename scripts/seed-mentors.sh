#!/bin/bash

# Seed Mentors Script
# Usage: bun run seed:mentors

echo "🌱 Seeding mentors..."

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
psql "$DATABASE_URL" -f scripts/seed-mentors.sql

if [ $? -eq 0 ]; then
  echo "✅ Mentors seeded successfully!"
  echo ""
  echo "🎯 Test the mentors page:"
  echo "   http://localhost:3000/jam/mentors"
else
  echo "❌ Error seeding mentors"
  exit 1
fi
