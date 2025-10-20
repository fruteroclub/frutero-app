# Seed External Programs

## Quick Start

```bash
# Seed the programs into database
bun run seed:programs
```

## What Gets Seeded

4 **real, active external programs** for the Jam Platform:

### 1. 🔐 MetaMask Smart Accounts x Monad Dev Cook Off
- **Type**: Hackathon
- **Organizer**: MetaMask & Monad
- **Tracks**: Infrastructure, DeFi
- **Deadline**: Feb 15, 2025
- **URL**: https://www.hackquest.io/hackathons/MetaMask-Smart-Accounts-x-Monad-Dev-Cook-Off

### 2. 🚀 Base Batches 2025
- **Type**: Accelerator (3 months)
- **Organizer**: Base
- **Tracks**: Infrastructure, DeFi, Social
- **Deadline**: Oct 17, 2025
- **Period**: Sep 29 - Dec 12, 2025
- **Capacity**: 100 participants
- **URL**: https://basebatches.xyz

### 3. ⚡ Solana Cypherpunk Hackathon
- **Type**: Hackathon
- **Organizer**: Colosseum
- **Prize Pool**: $2.5M total
- **Tracks**: DeFi, Infrastructure, Social, NFT
- **Deadline**: Oct 30, 2025
- **URL**: https://www.colosseum.com/cypherpunk

### 4. 💰 Octant DeFi Hackathon 2025
- **Type**: Hackathon
- **Organizer**: Octant
- **Tracks**: DeFi
- **Period**: Oct 30 - Nov 11, 2025
- **Deadline**: Nov 11, 2025
- **URL**: https://octant.devfolio.co

## Testing After Seed

1. **Visit the programs page**:
   ```
   http://localhost:3000/jam/programs
   ```

2. **Test filters**:
   - Category: BUILD (hackathons), ACCELERATE (Base Batches)
   - Track: DeFi, Infrastructure, Social, NFT
   - Timeline: Upcoming, Active, Past

3. **Test deadline warnings**:
   - Programs with deadlines ≤3 days will show red warning
   - Urgency indicators on cards

4. **Test program details**:
   - Click any program to view detail page
   - Check timeline visualization
   - Test external application links

5. **Mobile responsive**:
   - Test on different screen sizes
   - Grid adapts: 1 → 2 → 3 columns

## Re-seeding

To clear and re-seed:

```bash
# Delete existing programs
psql $DATABASE_URL -c "DELETE FROM programs;"

# Re-seed
bun run seed:programs
```

## Adding More Programs

Edit `scripts/seed-programs.sql` and add new `INSERT` statements following the same pattern.

### Example Template:
```sql
INSERT INTO programs (
  name,
  description,
  type,                  -- 'BUILD', 'ACCELERATE', 'LEARN', 'ONBOARD', 'REVENUE'
  status,                -- 'ACTIVE', 'PLANNED', 'COMPLETED', 'RECURRING'
  start_date,
  end_date,
  submission_deadline,
  organizer,
  tracks,                -- ARRAY['defi', 'infrastructure', 'nft', 'gaming', 'ai', 'social']
  website_url,
  application_url,
  location,
  capacity,
  tags
) VALUES (
  'Your Program Name',
  'Descripción en español del programa...',
  'BUILD',
  'ACTIVE',
  '2025-01-01',
  '2025-03-01',
  '2025-02-15',
  'Organizer Name',
  ARRAY['defi', 'infrastructure'],
  'https://program-website.com',
  'https://apply-here.com',
  'Online',
  100,
  ARRAY['tag1', 'tag2']
);
```
