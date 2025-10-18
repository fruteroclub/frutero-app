#!/usr/bin/env bun

/**
 * Script to reset the database
 * WARNING: This will drop all tables and recreate them from schema
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

async function resetDatabase() {
  console.log("🔄 Connecting to database...");

  const client = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  try {
    console.log("⚠️  Dropping all tables...");

    // Drop junction tables first
    await db.execute(sql`DROP TABLE IF EXISTS user_quests CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS program_users CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS user_badges CASCADE`);

    // Drop dependent tables
    await db.execute(sql`DROP TABLE IF EXISTS mentorships CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS tiers CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS rewards CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS proof_of_communities CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS comments CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS posts CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS quests CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS badges CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS projects CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS profiles CASCADE`);

    // Drop main tables
    await db.execute(sql`DROP TABLE IF EXISTS programs CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    // Drop enums
    await db.execute(sql`DROP TYPE IF EXISTS program_status CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS program_type CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS user_quest_status CASCADE`);
    await db.execute(sql`DROP TYPE IF EXISTS project_stage CASCADE`);

    console.log("✅ All tables and enums dropped successfully");
    console.log("\n📝 Run 'bun db:push' to recreate tables from schema");

  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetDatabase();
