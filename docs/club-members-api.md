# Club Members API

## Overview
Dynamic club member directory that loads users from the database instead of hardcoded data.

## API Endpoint

### GET `/api/club/members`

Returns all club members with their roles and profile information.

**Response Format**:
```json
[
  {
    "name": "Robin",
    "username": "robinhodl69",
    "description": "Project Manager y CEO de Psy Labs...",
    "socialNetworks": ["https://twitter.com/robinhodl69"],
    "avatar": "/images/mentores/robinhodl69.jpg",
    "calendarUrl": "https://calendly.com/robinhodl",
    "email": "jaramillo.jesusj@gmail.com",
    "roles": ["hacker", "founder", "mentor"]
  }
]
```

**Role Types**:
- `hacker` - All club members (default)
- `mentor` - Users with mentor profiles
- `founder` - Users with founder role in metadata

## Frontend Implementation

### Page: `/club`

**Features**:
- ✅ Fetches members from database via TanStack Query
- ✅ Real-time data with automatic caching
- ✅ Role-based filtering (Frutas, Founders, Mentores)
- ✅ Loading states with spinner
- ✅ Error handling with fallback to static data
- ✅ Randomized display order per role

**Components Used**:
- `FrutaCard` - Member card display
- `PageWrapper` - Layout with navbar/footer
- `Section` - Content container with responsive max-width

## Database Schema

**Tables Used**:
- `users` - Core user data
- `mentor_profiles` - Mentor-specific data (determines mentor role)
- `metadata` (JSON field) - Stores roles and social networks

## Member Types

### Mentors (15)
Users with entries in `mentor_profiles` table. Automatically tagged with `mentor` role.

### Regular Members (23)
JAM platform participants without mentor profiles. Tagged as `hacker`.

### Founders (8)
Users with `founder` in their metadata roles array.

## Testing

```bash
# Seed mentors
bun run seed:mentors

# Check mentor count
bun run check:mentors

# Test API endpoint
curl http://localhost:3000/api/club/members | jq 'length'
```

## Fallback Behavior

If the database connection fails, the page falls back to static data (original hardcoded mentors array) and displays a warning message to the user.
