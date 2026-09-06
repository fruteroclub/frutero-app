import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ProcessedWordFrequency } from '@/lib/omi/types';

// Simple word frequency processor for testing
function processWords(text: string): ProcessedWordFrequency[] {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are',
    'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'to', 'of', 'in', 'for', 'with', 'by',
    'from', 'about', 'into', 'through', 'during', 'before', 'after',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them', 'their',
    'this', 'that', 'these', 'those', 'be', 'been', 'being', 'but',
    'if', 'or', 'because', 'as', 'until', 'while', 'up', 'down', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
  ]);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\sáéíóúñü]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  const total = words.length;
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word, count]) => ({ 
      word, 
      count,
      percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(2)) : 0
    }));
}

export async function POST(request: NextRequest) {
  try {
    // Accept any JSON payload for testing flexibility
    const body = await request.json();
    
    // Log everything for debugging
    console.log('=== OMI TEST WEBHOOK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Body:', JSON.stringify(body, null, 2));
    
    // Save to local file for analysis
    const logDir = path.join(process.cwd(), 'omi-logs');
    await fs.mkdir(logDir, { recursive: true });
    
    const filename = `omi-test-${Date.now()}.json`;
    const logData = {
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries()),
      body,
      endpoint: 'test'
    };
    
    await fs.writeFile(
      path.join(logDir, filename),
      JSON.stringify(logData, null, 2)
    );
    
    // Try to extract text from various possible field names
    const possibleTextFields = [
      'transcript',
      'raw_transcript',
      'text',
      'content',
      'message',
      'transcription',
      'speech_to_text',
      'audio_transcript'
    ];
    
    let extractedText = '';
    
    // Check nested transcript object
    if (body.transcript && typeof body.transcript === 'object') {
      extractedText = body.transcript.raw_text || body.transcript.text || '';
    }
    
    // Check direct fields
    if (!extractedText) {
      for (const field of possibleTextFields) {
        if (body[field] && typeof body[field] === 'string') {
          extractedText = body[field];
          console.log(`Text extracted from field: ${field}`);
          break;
        }
      }
    }
    
    // Process word frequency if text found
    let wordFrequency: ProcessedWordFrequency[] = [];
    if (extractedText) {
      wordFrequency = processWords(extractedText);
      console.log(`Processed ${wordFrequency.length} unique words from ${extractedText.length} characters`);
    } else {
      console.log('No text content found in payload');
    }
    
    // Return comprehensive test response
    const response = {
      success: true,
      message: 'Test webhook processed successfully',
      received_at: new Date().toISOString(),
      data_received: {
        fields: Object.keys(body),
        text_found: extractedText.length > 0,
        text_length: extractedText.length
      },
      word_analysis: {
        unique_words: wordFrequency.length,
        top_10_words: wordFrequency.slice(0, 10)
      },
      debug_info: {
        log_file: filename,
        extracted_from: extractedText ? 'Found text content' : 'No text found',
        payload_size: JSON.stringify(body).length
      }
    };
    
    console.log('Response:', JSON.stringify(response, null, 2));
    console.log('=== TEST WEBHOOK COMPLETE ===\n');
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process test webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing connectivity
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Omi test endpoint is ready',
    timestamp: new Date().toISOString(),
    instructions: 'Send a POST request with JSON body containing transcript/text field',
    example_payload: {
      transcript: "This is a sample conversation text",
      memory_id: "test-123",
      context: "meeting"
    }
  });
}