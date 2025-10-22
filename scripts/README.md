# Database Seeding Scripts

Scripts for populating the JAM platform database with initial data.

## Available Seeds

### Mentors

Seeds mentor data from the Frutero Club page into the database.

```bash
bun run seed:mentors
```

**Data Source:** Real mentor profiles from `/club` page
**Records:** 17 mentors with expertise in blockchain, product, design, and more
**Tables:** `users`, `profiles`, `mentor_profiles`

**Features:**
- Automatic expertise extraction from descriptions
- X (Twitter) username extraction
- Upsert logic (creates or updates existing mentors)
- Availability status based on Calendly link presence

**Note:** This script may take 30-60 seconds to complete due to database operations. It successfully seeds all mentors even if the process appears to hang briefly.

### Programs

Seeds external program data (hackathons, courses, etc.).

```bash
bun run seed:programs
```

### Quests

Seeds quest data for the JAM platform.

```bash
bun run seed:quests
```

## Implementation Notes

### Mentor Seed Script

The mentor seeding script (`seed-mentors.ts`) extracts data from the club page and intelligently processes it:

**Expertise Detection:**
- Technical skills: blockchain, DeFi, smart contracts, frontend, backend, mobile, AI/ML
- Business & Design: product management, marketing, growth, design, pitching
- Community: hackathons, developer relations

**Mentor Profile Fields:**
- `availability`: Set to `AVAILABLE` if Calendly link exists, otherwise `LIMITED`
- `maxParticipants`: Default 5 participants per mentor
- `expertiseAreas`: Array of extracted expertise tags
- `mentoringApproach`: First 500 characters of description

**Data Mapping:**
```typescript
users table → {
  id: "mentor-{username}",
  username, displayName, email, bio, avatarUrl,
  website: calendarUrl,
  metadata: { socialNetworks, roles }
}

profiles table → {
  professionalProfile: description,
  xUsername: extracted from social links
}

mentor_profiles table → {
  availability, maxParticipants, expertiseAreas, mentoringApproach
}
```

## Running All Seeds

To seed the entire database:

```bash
bun run seed:programs
bun run seed:mentors
bun run seed:quests
```

## Database Reset

To reset the database and re-seed:

```bash
bun run db:reset
bun run seed:programs
bun run seed:mentors
bun run seed:quests
```

## Adding New Mentors

To add new mentors:

1. Update the `mentorData` array in `scripts/seed-mentors.ts`
2. Follow the existing mentor data structure
3. Run `bun run seed:mentors`

The script will automatically:
- Create new mentor records
- Update existing mentors if they already exist (based on username)
- Extract expertise areas and X username
- Set availability based on Calendly link

## Troubleshooting

**Script hangs after completion:**
- This is expected behavior due to Postgres connection pooling
- The data is successfully seeded even if the process doesn't exit immediately
- You can safely Ctrl+C after seeing "Updated mentor" messages for all mentors

**Duplicate key errors:**
- The script uses upsert logic, so re-running is safe
- Existing mentors will be updated with new data

**Missing profiles or mentor profiles:**
- The script creates profiles and mentor_profiles if they don't exist
- Check that the username doesn't contain special characters
