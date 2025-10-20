# Mentor Seed Data

This directory contains scripts to seed the database with sample mentor data for JAM-010 (Mentor Directory & Matching).

## Files

- **`seed-mentors.sql`**: SQL file with sample mentor data
- **`seed-mentors.sh`**: Bash script to run the SQL seed
- **`README-seed-mentors.md`**: This file

## Sample Mentors

The seed data creates 5 mentors across different expertise areas:

1. **María González** - Frontend & Design
   - Expertise: frontend, design, ui
   - Availability: Available
   - Location: Ciudad de México, México

2. **Carlos Ramírez** - Blockchain & DeFi
   - Expertise: blockchain, defi, backend
   - Availability: Limited (3 max mentees)
   - Location: Bogotá, Colombia

3. **Lucía Morales** - AI & Product
   - Expertise: ai, backend, product
   - Availability: Available
   - Location: Buenos Aires, Argentina

4. **Diego Hernández** - DevOps & Infrastructure
   - Expertise: devops, backend, infrastructure
   - Availability: Available
   - Location: Santiago, Chile

5. **Ana Torres** - Growth & Mobile
   - Expertise: growth, product, mobile
   - Availability: Available
   - Location: Guadalajara, México

## Usage

### Prerequisites

1. Make sure you have PostgreSQL installed
2. Ensure `.env.local` file exists with `DATABASE_URL` variable
3. Database must already be set up with the schema

### Running the Seed

```bash
# Using npm script (recommended)
bun run seed:mentors

# Or directly
bash scripts/seed-mentors.sh
```

### What Gets Seeded

1. **Mentor Users**: 5 users with `isMentor: true` in metadata JSONB
2. **Profiles**: Complete profile information for each mentor
3. **Sample Mentorships**: 5 mentorship records (3 completed with ratings, 2 active)

### Mentor Metadata Structure

Each mentor has the following metadata stored in `users.metadata`:

```json
{
  "isMentor": true,
  "mentorAvailability": "available" | "limited" | "unavailable",
  "expertiseAreas": ["frontend", "design", "ui"],
  "mentoringApproach": "Description of mentoring style...",
  "maxParticipants": 5,
  "experience": "Professional background..."
}
```

## Testing the Mentor Directory

After seeding, test the mentor discovery flow:

1. **Mentors Directory**: http://localhost:3000/jam/mentors
   - View all mentors with filters
   - See personalized recommendations (requires authentication)

2. **Mentor Profile**: http://localhost:3000/jam/mentors/[mentor-id]
   - View individual mentor details
   - Request mentorship connection

## Development Notes

- Mentors are stored in the `users` table with `metadata->>'isMentor' = 'true'`
- Uses JSONB metadata to avoid schema migration (fastest MVP route)
- Matching algorithm scores mentors based on:
  - Expertise match (40%)
  - Track alignment (30%)
  - Availability (20%)
  - Geographic proximity (10%)

## Troubleshooting

If seeding fails:

1. Check that `DATABASE_URL` is set in `.env.local`
2. Verify PostgreSQL is running
3. Ensure database schema is up to date
4. Check for conflicts with existing user IDs

## Re-seeding

The script uses `ON CONFLICT DO UPDATE` for users and profiles, so you can re-run it safely to update existing mentor data.
