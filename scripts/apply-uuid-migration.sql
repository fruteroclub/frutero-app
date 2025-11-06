-- Manual UUID Migration Script
-- WARNING: This will drop and recreate all tables, losing all data

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS project_quests CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS program_projects CASCADE;
DROP TABLE IF EXISTS user_quests CASCADE;
DROP TABLE IF EXISTS program_users CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS tiers CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS proof_of_communities CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS mentor_profiles CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS mentorships CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop enums
DROP TYPE IF EXISTS mentor_availability CASCADE;
DROP TYPE IF EXISTS track CASCADE;
DROP TYPE IF EXISTS project_quest_status CASCADE;
DROP TYPE IF EXISTS program_status CASCADE;
DROP TYPE IF EXISTS program_type CASCADE;
DROP TYPE IF EXISTS user_quest_status CASCADE;
DROP TYPE IF EXISTS project_stage CASCADE;

-- Note: After running this, execute: bun x drizzle-kit push
-- This will recreate all tables with the new UUID schema
