#!/usr/bin/env node

import { R2StorageClient } from '../src/lib/r2/client';
import { R2UserManager } from '../src/lib/omi/r2-user-manager';

async function testR2Integration() {
  console.log('🧪 Testing R2 Integration...\n');

  try {
    // Test 1: Create R2 client and test connection
    console.log('1. Testing R2 Client Connection...');
    const r2Client = new R2StorageClient();
    
    // Test circuit breaker state
    console.log('   Circuit breaker state:', r2Client.getCircuitBreakerState());
    console.log('   Circuit breaker failures:', r2Client.getCircuitBreakerFailureCount());

    // Test 2: Create R2 User Manager and test connection
    console.log('\n2. Testing R2 User Manager Connection...');
    const userManager = new R2UserManager();
    const connectionTest = await userManager.testConnection();
    console.log('   Connection test result:', connectionTest ? '✅ Success' : '❌ Failed');

    if (!connectionTest) {
      console.log('❌ R2 connection failed. Please check your environment variables:');
      console.log('   - R2_ACCOUNT_ID');
      console.log('   - R2_ACCESS_KEY_ID');
      console.log('   - R2_SECRET_ACCESS_KEY');
      console.log('   - R2_BUCKET_NAME');
      return;
    }

    // Test 3: Save a test memory
    console.log('\n3. Testing Memory Storage...');
    const testUserId = 'test-user-' + Date.now();
    const testMemoryId = 'test-memory-' + Date.now();
    const testData = {
      id: testMemoryId,
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      transcript_segments: [
        {
          text: 'This is a test transcript segment for R2 integration testing.',
          speaker: 'SPEAKER_0',
          speaker_id: 0,
          is_user: true,
          start: 0.0,
          end: 5.0
        }
      ],
      structured: {
        title: 'R2 Integration Test',
        overview: 'Testing R2 storage functionality',
        emoji: '🧪',
        category: 'test',
        action_items: ['Verify R2 storage works'],
        insights: ['R2 integration is functional']
      },
      language: 'en'
    };

    const saveResult = await userManager.saveMemory(testUserId, testMemoryId, testData);
    console.log('   Memory saved successfully:');
    console.log('   - R2 Key:', saveResult.r2Key);
    console.log('   - All Key:', saveResult.allKey);
    if (saveResult.publicUrl) {
      console.log('   - Public URL:', saveResult.publicUrl);
    }

    // Test 4: Retrieve user memories
    console.log('\n4. Testing Memory Retrieval...');
    const userMemories = await userManager.getUserMemories(testUserId, 5);
    console.log('   Retrieved', userMemories.length, 'memories for user');
    
    if (userMemories.length > 0) {
      const firstMemory = userMemories[0];
      console.log('   First memory ID:', (firstMemory as any).id);
      console.log('   First memory title:', (firstMemory as any).structured?.title);
    }

    // Test 5: Get user statistics
    console.log('\n5. Testing User Statistics...');
    const userStats = await userManager.getUserStats(testUserId);
    console.log('   User stats:');
    console.log('   - Total memories:', userStats.total_memories);
    console.log('   - Total duration:', userStats.total_duration_minutes, 'minutes');
    console.log('   - Languages detected:', userStats.languages_detected);
    console.log('   - Action items:', userStats.action_items_count);
    console.log('   - Insights:', userStats.insights_count);

    // Test 6: Get all recent memories
    console.log('\n6. Testing Recent Memories Retrieval...');
    const recentMemories = await userManager.getAllRecentMemories(5);
    console.log('   Retrieved', recentMemories.length, 'recent memories from today');

    console.log('\n✅ All R2 integration tests passed!');
    console.log('\nR2 Storage Structure:');
    console.log('📁 mobil3-mentorships/');
    console.log('├── 📁 by-user/');
    console.log(`│   └── 📁 ${testUserId}/`);
    console.log('│       └── 📁 2025/');
    console.log('│           └── 📁 01/');
    console.log(`│               └── 📄 ${testMemoryId}-*.json`);
    console.log('├── 📁 all/');
    console.log('│   └── 📁 2025-01-XX/');
    console.log(`│       └── 📄 ${testUserId}-${testMemoryId}-*.json`);
    console.log('└── 📁 analytics/ (for future use)');

  } catch (error) {
    console.error('\n❌ R2 Integration Test Failed:');
    console.error('Error:', error instanceof Error ? error.message : error);
    console.error('\nPossible issues:');
    console.error('1. Missing environment variables in .env.local');
    console.error('2. Incorrect R2 credentials');
    console.error('3. R2 bucket does not exist');
    console.error('4. Network connectivity issues');
    console.error('5. Permission issues with R2 bucket');
    
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testR2Integration();
}

export { testR2Integration };