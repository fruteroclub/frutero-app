-- Seed External Programs for JAM Platform
-- Run with: psql $DATABASE_URL -f scripts/seed-programs.sql

-- 1. MetaMask Smart Accounts x Monad Dev Cook Off
INSERT INTO programs (
  name,
  description,
  type,
  status,
  start_date,
  end_date,
  submission_deadline,
  organizer,
  tracks,
  website_url,
  application_url,
  location,
  tags
) VALUES (
  'MetaMask Smart Accounts x Monad Dev Cook Off',
  'Hackathon enfocado en construir con MetaMask Smart Accounts y la blockchain Monad. Explora el futuro de las cuentas inteligentes y la infraestructura de alto rendimiento.',
  'BUILD',
  'ACTIVE',
  '2025-01-15',
  '2025-02-28',
  '2025-02-15',
  'MetaMask & Monad',
  ARRAY['infrastructure', 'defi'],
  'https://www.hackquest.io/hackathons/MetaMask-Smart-Accounts-x-Monad-Dev-Cook-Off',
  'https://www.hackquest.io/hackathons/MetaMask-Smart-Accounts-x-Monad-Dev-Cook-Off',
  'Online',
  ARRAY['smart-accounts', 'monad', 'infrastructure']
);

-- 2. Base Batches 2025
INSERT INTO programs (
  name,
  description,
  type,
  status,
  start_date,
  end_date,
  submission_deadline,
  organizer,
  tracks,
  website_url,
  application_url,
  location,
  capacity,
  cohort,
  tags
) VALUES (
  'Base Batches 2025',
  'Programa de aceleración de 3 meses que ayuda a builders a convertir su idea en producto y lanzar su negocio. Incluye mentoría virtual y Demo Day. Dos tracks: Startup Track y Builder Track.',
  'ACCELERATE',
  'ACTIVE',
  '2025-09-29',
  '2025-12-12',
  '2025-10-17',
  'Base',
  ARRAY['infrastructure', 'defi', 'social'],
  'https://basebatches.xyz',
  'https://base-batches-startup-track.devfolio.co/overview',
  'Online',
  100,
  'Batch 2025',
  ARRAY['base', 'accelerator', 'mentorship']
);

-- 3. Solana Cypherpunk Hackathon
INSERT INTO programs (
  name,
  description,
  type,
  status,
  start_date,
  end_date,
  submission_deadline,
  organizer,
  tracks,
  website_url,
  application_url,
  location,
  tags
) VALUES (
  'Solana Cypherpunk Hackathon',
  'Hackathon online con $2.5M en premios totales. Construye aplicaciones descentralizadas en Solana. Premios incluyen $30K Grand Champion, $10K Public Goods Award, $10K University Award y hasta $10K en Solana Mobile Developer Grants.',
  'BUILD',
  'ACTIVE',
  '2025-09-01',
  '2025-10-30',
  '2025-10-30',
  'Colosseum',
  ARRAY['defi', 'infrastructure', 'social', 'nft'],
  'https://www.colosseum.com/cypherpunk',
  'https://arena.colosseum.org/hackathon/register',
  'Online',
  ARRAY['solana', 'cypherpunk', 'mobile']
);

-- 4. Octant DeFi Hackathon 2025
INSERT INTO programs (
  name,
  description,
  type,
  status,
  start_date,
  end_date,
  submission_deadline,
  organizer,
  tracks,
  website_url,
  application_url,
  location,
  tags
) VALUES (
  'Octant DeFi Hackathon 2025',
  'DeFi ha alcanzado velocidad de escape y está siendo adoptado en todo el mundo. Construye estrategias DeFi innovadoras y bienes públicos para los vaults generadores de rendimiento de Octant v2. Enfoque en integraciones ERC-4626 y mecanismos de crecimiento del ecosistema.',
  'BUILD',
  'ACTIVE',
  '2025-10-30',
  '2025-11-11',
  '2025-11-11',
  'Octant',
  ARRAY['defi'],
  'https://octant.devfolio.co',
  'https://octant.devfolio.co/overview',
  'Online',
  ARRAY['defi', 'vaults', 'public-goods']
);

-- Display seeded programs
SELECT
  name,
  type,
  status,
  organizer,
  tracks,
  submission_deadline
FROM programs
ORDER BY submission_deadline;
