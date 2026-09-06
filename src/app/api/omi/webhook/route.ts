import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { OmiWebhookPayload, ProcessedWordFrequency } from '@/lib/omi/types';
import { R2UserManager } from '@/lib/omi/r2-user-manager';
import { UserManager } from '@/lib/omi/user-manager';

// Helper function to process word frequency
function processWordFrequency(text: string): ProcessedWordFrequency[] {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 
    'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 
    'would', 'could', 'should', 'may', 'might', 'must', 'can', 'could',
    'to', 'of', 'in', 'for', 'with', 'by', 'from', 'about', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'under', 'again', 'further', 'then', 'once', 'there', 'when', 'where',
    'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'this', 'that', 'these', 'those', 'i', 'you',
    'he', 'she', 'it', 'we', 'they', 'them', 'their', 'what', 'which',
    'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
    'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for',
    'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
    'then', 'once'
  ]);

  // Process text
  const words = text
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '') // Keep Spanish characters
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Count frequencies
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Calculate total for percentages
  const total = words.length;

  // Convert to array and sort
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({
      word,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
}

// Helper function to save logs
async function saveLog(headers: Record<string, string>, body: Record<string, unknown>) {
  try {
    const logDir = path.join(process.cwd(), 'omi-logs');
    await fs.mkdir(logDir, { recursive: true });

    // Generate timestamp-based filename
    const timestamp = new Date().toISOString();
    const filename = `omi-${Date.now()}.json`;
    const filepath = path.join(logDir, filename);

    // Save log data
    const logData = {
      timestamp,
      headers,
      body,
      processedAt: timestamp
    };

    await fs.writeFile(filepath, JSON.stringify(logData, null, 2));

    // Implement log rotation - keep only last 100 files
    const files = await fs.readdir(logDir);
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    // Delete older files if we have more than 100
    if (jsonFiles.length > 100) {
      const filesToDelete = jsonFiles.slice(100);
      for (const file of filesToDelete) {
        await fs.unlink(path.join(logDir, file));
      }
    }

    return filename;
  } catch (error) {
    console.error('Error saving log:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  console.log('=== OMI REAL-TIME TRANSCRIPT WEBHOOK RECEIVED ===');
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

    // Parse request body
    const body = await request.json() as Partial<OmiWebhookPayload>;
    
    // Extract headers for logging
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Log to console
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Body:', JSON.stringify(body, null, 2));

    // Extract text from various possible fields
    const text = body.transcript?.raw_text || 
                 body.raw_transcript || 
                 body.text || 
                 '';

    // Process word frequency if we have text
    let wordFrequency: ProcessedWordFrequency[] = [];
    if (text) {
      wordFrequency = processWordFrequency(text);
      console.log(`Processed ${wordFrequency.length} unique words`);
    }

    // Create transcript data object
    const transcriptData = {
      ...body,
      uid: sanitizedUid,
      headers,
      text,
      text_length: text.length,
      word_frequency: wordFrequency,
      unique_words: wordFrequency.length,
      top_words: wordFrequency.slice(0, 10),
      type: 'real-time-transcript',
      processed_at: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime
    };

    // Save to R2 storage (with fallback to file system if R2 fails)
    console.log('Saving transcript to R2 storage...');
    let storage: { r2Key: string; allKey: string; publicUrl?: string } | { userPath: string; allPath: string };
    let storageType = 'r2';
    let logFile: string | null = null;

    try {
      if (sanitizedUid) {
        const r2UserManager = new R2UserManager();
        
        // Test R2 connection first
        const r2Available = await r2UserManager.testConnection();
        
        if (r2Available) {
          const memoryId = body.memory_id || `transcript-${Date.now()}`;
          storage = await r2UserManager.saveMemory(
            sanitizedUid,
            memoryId,
            transcriptData
          );
          console.log('Successfully saved transcript to R2:', storage);
        } else {
          throw new Error('R2 connection test failed');
        }
      } else {
        throw new Error('No valid user ID provided');
      }
    } catch (r2Error) {
      console.warn('R2 storage failed, falling back to file system:', r2Error);
      storageType = 'filesystem';
      
      // Fallback to file system
      logFile = await saveLog(headers, transcriptData);
      storage = { userPath: logFile || 'unknown', allPath: logFile || 'unknown' };
    }

    // Prepare response
    const response = {
      success: true,
      message: 'Real-time transcript webhook received and processed',
      received_at: new Date().toISOString(),
      memory_id: body.memory_id || 'unknown',
      user_id: sanitizedUid,
      text_length: text.length,
      unique_words: wordFrequency.length,
      top_words: wordFrequency.slice(0, 10),
      storage: {
        type: storageType,
        ...(storageType === 'r2' && 'r2Key' in storage 
          ? { r2Key: storage.r2Key, publicUrl: storage.publicUrl } 
          : { file: logFile }
        )
      },
      processing_time_ms: Date.now() - startTime
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    console.log('=== REAL-TIME TRANSCRIPT WEBHOOK PROCESSING COMPLETE ===\n');

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('=== REAL-TIME TRANSCRIPT WEBHOOK ERROR ===');
    console.error('Error processing webhook:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process real-time transcript webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
        processing_time_ms: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}

// Handle other methods
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
        stats = { total_memories: 0, note: 'R2 unavailable, filesystem logs not counted' };
      }
    } catch (error) {
      console.warn('Error getting stats:', error);
      stats = { total_memories: 0, error: 'Unable to retrieve stats' };
    }
    
    return NextResponse.json({
      success: true,
      message: 'Omi real-time transcript webhook endpoint is active',
      endpoint: '/api/omi/webhook',
      user_id: sanitizedUid,
      storage_type: storageType,
      user_stats: stats,
      timestamp: new Date().toISOString(),
      usage: 'POST with JSON body containing real-time transcript data'
    });
  }

  return NextResponse.json(
    { 
      success: true,
      message: 'Omi real-time transcript webhook endpoint is active',
      endpoint: '/api/omi/webhook',
      timestamp: new Date().toISOString(),
      method: 'POST',
      usage: 'POST /api/omi/webhook?uid=YOUR_USER_ID',
      description: 'Processes real-time transcript data with R2 storage and filesystem fallback',
      features: [
        'Real-time transcript processing',
        'Word frequency analysis',
        'R2 cloud storage with fallback',
        'User-organized storage',
        'Circuit breaker protection'
      ]
    },
    { status: 200 }
  );
}