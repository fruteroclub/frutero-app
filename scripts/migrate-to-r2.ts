#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { R2StorageClient } from '../src/lib/r2/client';

async function migrateLogsToR2() {
  console.log('🚚 Starting migration of existing logs to R2...\n');

  const r2Client = new R2StorageClient();
  const logsDir = path.join(process.cwd(), 'omi-logs');
  
  let migratedCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  try {
    // Check if logs directory exists
    try {
      await fs.access(logsDir);
    } catch {
      console.log('✅ No existing logs directory found - nothing to migrate');
      return;
    }

    console.log('📁 Found logs directory at:', logsDir);

    // Check for memory logs directory
    const memoryDir = path.join(logsDir, 'memory', 'all');
    try {
      await fs.access(memoryDir);
      console.log('📁 Found memory logs directory');
      
      // Read all memory log files
      const files = await fs.readdir(memoryDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      console.log(`📄 Found ${jsonFiles.length} memory log files to migrate\n`);

      for (const file of jsonFiles) {
        try {
          console.log(`Migrating: ${file}`);
          
          const content = await fs.readFile(path.join(memoryDir, file), 'utf-8');
          const data = JSON.parse(content);
          
          // Extract user ID and memory ID from data
          let userId = 'unknown';
          let memoryId = 'unknown';
          
          if (data.uid) {
            userId = data.uid;
          } else if (data.processed?.uid) {
            userId = data.processed.uid;
          } else if (data.memory?.uid) {
            userId = data.memory.uid;
          }
          
          if (data.memory?.id) {
            memoryId = data.memory.id;
          } else if (data.id) {
            memoryId = data.id;
          } else if (data.processed?.id) {
            memoryId = data.processed.id;
          }
          
          // Add migration metadata
          data.migrated_from_file = file;
          data.migrated_at = new Date().toISOString();
          data.migration_source = 'filesystem';
          
          // Upload to R2
          const r2Key = await r2Client.uploadMentorshipLog(userId, memoryId, data);
          
          // Also upload to "all" folder
          await r2Client.uploadToAllFolder(userId, memoryId, data);
          
          console.log(`   ✅ Migrated to R2 key: ${r2Key}`);
          migratedCount++;
          
        } catch (error) {
          console.log(`   ❌ Failed to migrate ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          errors.push(`${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          failedCount++;
        }
      }
    } catch {
      console.log('📁 No memory logs directory found');
    }

    // Check for old transcript logs in the main directory
    try {
      const files = await fs.readdir(logsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length > 0) {
        console.log(`\n📄 Found ${jsonFiles.length} transcript log files to migrate`);
        
        for (const file of jsonFiles) {
          try {
            console.log(`Migrating transcript: ${file}`);
            
            const content = await fs.readFile(path.join(logsDir, file), 'utf-8');
            const data = JSON.parse(content);
            
            // Extract user ID from the data or filename
            let userId = 'transcript-user';
            let memoryId = file.replace('.json', '');
            
            if (data.uid) {
              userId = data.uid;
            } else if (data.user_id) {
              userId = data.user_id;
            }
            
            if (data.id) {
              memoryId = data.id;
            }
            
            // Mark as transcript type and add migration metadata
            data.type = 'transcript';
            data.migrated_from_file = file;
            data.migrated_at = new Date().toISOString();
            data.migration_source = 'filesystem';
            
            // Upload to R2
            const r2Key = await r2Client.uploadMentorshipLog(userId, memoryId, data);
            
            // Also upload to "all" folder
            await r2Client.uploadToAllFolder(userId, memoryId, data);
            
            console.log(`   ✅ Migrated transcript to R2 key: ${r2Key}`);
            migratedCount++;
            
          } catch (error) {
            console.log(`   ❌ Failed to migrate ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            errors.push(`${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            failedCount++;
          }
        }
      }
    } catch (error) {
      console.log('Error reading main logs directory:', error);
    }

    // Migration summary
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migratedCount} files`);
    console.log(`❌ Failed to migrate: ${failedCount} files`);
    
    if (errors.length > 0) {
      console.log('\n❌ Migration Errors:');
      errors.forEach(error => console.log(`   - ${error}`));
    }

    if (migratedCount > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Verify migrated data in your R2 bucket');
      console.log('2. Test the API endpoints with migrated data');
      console.log('3. Once verified, you can safely archive/remove the local logs');
      console.log('4. Update your application to use R2 exclusively');
      
      console.log('\nR2 Storage Structure Created:');
      console.log('📁 mobil3-mentorships/');
      console.log('├── 📁 by-user/');
      console.log('│   ├── 📁 {user_id}/');
      console.log('│   │   └── 📁 {year}/{month}/');
      console.log('│   │       └── 📄 {memory_id}-{timestamp}.json');
      console.log('└── 📁 all/');
      console.log('    └── 📁 {date}/');
      console.log('        └── 📄 {user_id}-{memory_id}-{timestamp}.json');
    } else if (failedCount === 0) {
      console.log('✅ No files found to migrate - you\'re all set!');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error('Error:', error instanceof Error ? error.message : error);
    console.error('\nPlease check:');
    console.error('1. R2 credentials are correct');
    console.error('2. R2 bucket exists and is accessible');
    console.error('3. Network connectivity');
    
    process.exit(1);
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateLogsToR2();
}

export { migrateLogsToR2 };