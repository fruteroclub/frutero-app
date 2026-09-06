import { NextRequest, NextResponse } from 'next/server';
import { MemoryCreation, MemoryWebhookResponse, ProcessedMemory } from '@/lib/omi/memory-types';
import { MemoryProcessor } from '@/lib/omi/memory-processor';
import { R2UserManager } from '@/lib/omi/r2-user-manager';
import { UserManager } from '@/lib/omi/user-manager';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  console.log('=== OMI MEMORY CREATION WEBHOOK RECEIVED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  try {
    // Extract user ID from query parameter
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');
    const sanitizedUid = UserManager.sanitizeUserId(uid);

    console.log('Raw UID:', uid);
    console.log('Sanitized UID:', sanitizedUid);

    // Validate user ID is provided
    if (!uid) {
      console.error('Missing uid parameter');
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required uid parameter',
          message: 'Please provide uid as query parameter: ?uid=YOUR_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json() as MemoryCreation;
    console.log('Memory ID:', body.id);
    console.log('Language:', body.language);
    console.log('Title:', body.structured?.title);
    console.log('Segments:', body.transcript_segments?.length || 0);

    // Validate required fields
    if (!body.id || !body.created_at || !body.transcript_segments) {
      console.error('Missing required fields');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields in memory data',
          required: ['id', 'created_at', 'transcript_segments']
        },
        { status: 400 }
      );
    }

    // Process the memory for word frequency and analytics
    console.log('Processing memory for word frequency...');
    const processed = MemoryProcessor.processMemory(body);
    
    console.log(`Processed ${processed.total_words} words, ${processed.unique_words} unique`);
    console.log(`Found ${processed.speaker_stats.length} speakers`);

    // Calculate conversation duration
    const startTime = new Date(body.started_at).getTime();
    const endTime = new Date(body.finished_at).getTime();
    const durationSeconds = Math.round((endTime - startTime) / 1000);

    console.log(`Conversation duration: ${durationSeconds} seconds`);

    // Extract topics
    const topics = MemoryProcessor.extractTopics(body);
    console.log('Extracted topics:', topics);

    // Create processed memory object
    const processedMemory: ProcessedMemory = {
      ...body,
      uid: sanitizedUid,
      word_frequency: processed.word_frequency,
      total_words: processed.total_words,
      unique_words: processed.unique_words,
      conversation_duration: durationSeconds,
      speaker_stats: processed.speaker_stats,
      processed_at: new Date().toISOString(),
      file_path: '' // Will be set after saving
    };

    // Save to R2 storage (with fallback to file system if R2 fails)
    console.log('Saving memory to R2 storage...');
    let storage: { r2Key: string; allKey: string; publicUrl?: string } | { userPath: string; allPath: string };
    let storageType = 'r2';

    try {
      const r2UserManager = new R2UserManager();
      
      // Test R2 connection first
      const r2Available = await r2UserManager.testConnection();
      
      if (r2Available) {
        storage = await r2UserManager.saveMemory(
          sanitizedUid,
          body.id,
          {
            memory: body,
            processed: processedMemory,
            analytics: {
              total_words: processed.total_words,
              unique_words: processed.unique_words,
              top_words: processed.word_frequency.slice(0, 10),
              duration_seconds: durationSeconds,
              speakers: processed.speaker_stats.length,
              topics
            },
            webhook_received_at: new Date().toISOString(),
            processing_time_ms: Date.now() - startTime
          }
        );
        console.log('Successfully saved to R2:', storage);
      } else {
        throw new Error('R2 connection test failed');
      }
    } catch (r2Error) {
      console.warn('R2 storage failed, falling back to file system:', r2Error);
      storageType = 'filesystem';
      
      storage = await UserManager.saveMemory(
        sanitizedUid,
        body.id,
        {
          memory: body,
          processed: processedMemory,
          analytics: {
            total_words: processed.total_words,
            unique_words: processed.unique_words,
            top_words: processed.word_frequency.slice(0, 10),
            duration_seconds: durationSeconds,
            speakers: processed.speaker_stats.length,
            topics
          },
          webhook_received_at: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        }
      );
    }

    console.log('Saved to paths:', storage);

    // Get user statistics (try R2 first, fallback to file system)
    let userStats;
    try {
      if (storageType === 'r2') {
        const r2UserManager = new R2UserManager();
        userStats = await r2UserManager.getUserStats(sanitizedUid);
      } else {
        userStats = await UserManager.getUserStats(sanitizedUid);
      }
    } catch (statsError) {
      console.warn('Failed to get user stats, using defaults:', statsError);
      userStats = {
        total_memories: 1,
        total_duration_minutes: 0,
        avg_duration_minutes: 0,
        languages_detected: [],
        most_active_day: '',
        transcript_word_count: 0,
        action_items_count: 0,
        insights_count: 0
      };
    }
    console.log('User stats:', userStats);

    // Prepare response
    const response: MemoryWebhookResponse = {
      success: true,
      memory_id: body.id,
      user_id: sanitizedUid,
      analytics: {
        total_words: processed.total_words,
        unique_words: processed.unique_words,
        top_words: processed.word_frequency.slice(0, 10),
        duration_seconds: durationSeconds,
        speakers: processed.speaker_stats.length
      },
      storage: {
        type: storageType,
        ...(storageType === 'r2' && 'r2Key' in storage 
          ? { r2Key: storage.r2Key, publicUrl: storage.publicUrl } 
          : { file: (storage as { userPath: string }).userPath }
        ),
        user_total_memories: userStats.total_memories
      }
    };

    console.log('Processing completed in:', Date.now() - startTime, 'ms');
    console.log('=== MEMORY CREATION WEBHOOK COMPLETE ===\n');

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('=== MEMORY CREATION WEBHOOK ERROR ===');
    console.error('Error processing Memory Creation:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process Memory Creation webhook',
        message: errorMessage,
        processing_time_ms: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}

// Handle GET method for endpoint info
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const uid = searchParams.get('uid');

  if (uid) {
    // Return user-specific info (try R2 first, fallback to file system)
    const sanitizedUid = UserManager.sanitizeUserId(uid);
    let stats;
    let storageType = 'filesystem';
    
    try {
      const r2UserManager = new R2UserManager();
      const r2Available = await r2UserManager.testConnection();
      
      if (r2Available) {
        stats = await r2UserManager.getUserStats(sanitizedUid);
        storageType = 'r2';
      } else {
        stats = await UserManager.getUserStats(sanitizedUid);
      }
    } catch (error) {
      console.warn('Error getting stats, trying fallback:', error);
      try {
        stats = await UserManager.getUserStats(sanitizedUid);
      } catch (fallbackError) {
        console.error('Both R2 and file system failed:', fallbackError);
        stats = { total_memories: 0, error: 'Unable to retrieve stats' };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Omi Memory Creation endpoint is active',
      endpoint: '/api/omi/memory',
      user_id: sanitizedUid,
      storage_type: storageType,
      user_stats: stats,
      timestamp: new Date().toISOString(),
      usage: 'POST with JSON body containing Memory Creation data'
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Omi Memory Creation endpoint is active',
    endpoint: '/api/omi/memory',
    timestamp: new Date().toISOString(),
    usage: 'POST /api/omi/memory?uid=YOUR_USER_ID',
    required_fields: ['id', 'created_at', 'transcript_segments'],
    supported_features: [
      'Multi-language word frequency analysis',
      'Speaker-based statistics',
      'User-organized storage',
      'Topic extraction',
      'Action item parsing'
    ]
  });
}