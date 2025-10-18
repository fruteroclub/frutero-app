-- Manual migration for team-based quest support
-- Run this with: psql $DATABASE_URL < scripts/manual-migration.sql

-- 1. Create new enum for project quest status
CREATE TYPE project_quest_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'VERIFIED', 'REJECTED');

-- 2. Add wallet_address to projects table
ALTER TABLE projects ADD COLUMN wallet_address TEXT UNIQUE;

-- 3. Add quest type fields to quests table
ALTER TABLE quests ADD COLUMN quest_type TEXT NOT NULL DEFAULT 'INDIVIDUAL';
ALTER TABLE quests ADD COLUMN bounty_usd INTEGER;
ALTER TABLE quests ADD COLUMN max_submissions INTEGER;

-- 4. Create program_projects junction table (many-to-many)
CREATE TABLE program_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(program_id, project_id)
);

CREATE INDEX idx_program_projects_program ON program_projects(program_id);
CREATE INDEX idx_program_projects_project ON program_projects(project_id);

-- 5. Migrate existing project-program relationships
INSERT INTO program_projects (program_id, project_id, joined_at)
SELECT program_id, id, created_at
FROM projects
WHERE program_id IS NOT NULL;

-- 6. Remove old program_id column from projects
ALTER TABLE projects DROP COLUMN program_id;

-- 7. Create project_members junction table
CREATE TABLE project_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- 8. Auto-populate project admins as ADMIN members
INSERT INTO project_members (project_id, user_id, role, joined_at)
SELECT id, admin_id, 'ADMIN', created_at
FROM projects;

-- 9. Create project_quests table
CREATE TABLE project_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  status project_quest_status NOT NULL DEFAULT 'NOT_STARTED',
  progress INTEGER NOT NULL DEFAULT 0,
  submission_link TEXT,
  submission_text TEXT,
  submitted_at TIMESTAMP,
  submitted_by TEXT REFERENCES users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by TEXT REFERENCES users(id),
  verification_notes TEXT,
  verified_at TIMESTAMP,
  payment_tx_hash TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, quest_id)
);

CREATE INDEX idx_project_quests_project ON project_quests(project_id);
CREATE INDEX idx_project_quests_quest ON project_quests(quest_id);
CREATE INDEX idx_project_quests_status ON project_quests(status);
CREATE INDEX idx_project_quests_verified ON project_quests(is_verified);
