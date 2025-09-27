import { sql } from 'drizzle-orm';
import { db, client } from './index';

async function resetDatabase() {
  console.log('🗑️ Dropping all existing tables and types...');
  
  try {
    // Drop all tables first (in reverse dependency order)
    const dropTablesQuery = sql`
      DROP TABLE IF EXISTS program_users CASCADE;
      DROP TABLE IF EXISTS user_quests CASCADE;
      DROP TABLE IF EXISTS user_badges CASCADE;
      DROP TABLE IF EXISTS tiers CASCADE;
      DROP TABLE IF EXISTS rewards CASCADE;
      DROP TABLE IF EXISTS proof_of_communities CASCADE;
      DROP TABLE IF EXISTS comments CASCADE;
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS quests CASCADE;
      DROP TABLE IF EXISTS badges CASCADE;
      DROP TABLE IF EXISTS projects CASCADE;
      DROP TABLE IF EXISTS programs CASCADE;
      DROP TABLE IF EXISTS profiles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      
      -- Drop old tables that we're removing
      DROP TABLE IF EXISTS aluxes_to_abilities CASCADE;
      DROP TABLE IF EXISTS alux_abilities CASCADE;
      DROP TABLE IF EXISTS aluxes CASCADE;
      DROP TABLE IF EXISTS users_to_aluxes CASCADE;
      DROP TABLE IF EXISTS role_permissions CASCADE;
      DROP TABLE IF EXISTS role_grants CASCADE;
      DROP TABLE IF EXISTS user_roles CASCADE;
      DROP TABLE IF EXISTS roles CASCADE;
      DROP TABLE IF EXISTS permissions CASCADE;
      DROP TABLE IF EXISTS user_tokens CASCADE;
      DROP TABLE IF EXISTS community_tokens CASCADE;
      DROP TABLE IF EXISTS tokens CASCADE;
      DROP TABLE IF EXISTS conversation_participants CASCADE;
      DROP TABLE IF EXISTS conversations CASCADE;
      DROP TABLE IF EXISTS memories CASCADE;
      DROP TABLE IF EXISTS community_partners CASCADE;
      DROP TABLE IF EXISTS user_communities CASCADE;
      DROP TABLE IF EXISTS communities CASCADE;
      DROP TABLE IF EXISTS votes CASCADE;
      DROP TABLE IF EXISTS program_projects CASCADE;
      DROP TABLE IF EXISTS program_milestones CASCADE;
      DROP TABLE IF EXISTS program_sponsors CASCADE;
      DROP TABLE IF EXISTS dummy CASCADE;
    `;
    
    await db.execute(dropTablesQuery);
    console.log('✅ Tables dropped successfully');
    
    // Drop all enum types
    const dropEnumsQuery = sql`
      DROP TYPE IF EXISTS program_status CASCADE;
      DROP TYPE IF EXISTS program_type CASCADE;
      DROP TYPE IF EXISTS user_quest_status CASCADE;
      DROP TYPE IF EXISTS project_stage CASCADE;
      DROP TYPE IF EXISTS role_category CASCADE;
      DROP TYPE IF EXISTS participant_role CASCADE;
      DROP TYPE IF EXISTS alux_type CASCADE;
      DROP TYPE IF EXISTS alignment CASCADE;
    `;
    
    await db.execute(dropEnumsQuery);
    console.log('✅ Enum types dropped successfully');
    
    // Drop drizzle migrations table to start fresh
    await db.execute(sql`DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE`);
    console.log('✅ Migration tracking table dropped');
    
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
}

async function runMigration() {
  console.log('\n🚀 Running fresh migrations...');
  const { migrate } = await import('drizzle-orm/postgres-js/migrator');
  
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function main() {
  try {
    await resetDatabase();
    await runMigration();
    console.log('\n🎉 Database reset and migration complete!');
  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();