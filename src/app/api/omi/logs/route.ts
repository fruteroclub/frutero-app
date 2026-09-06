import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { OmiLogEntry, ProcessedWordFrequency } from '@/lib/omi/types';
import { R2UserManager } from '@/lib/omi/r2-user-manager';

function getTopWords(text: string): ProcessedWordFrequency[] {
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
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

async function readMemoryLogs(limit: number = 20): Promise<Array<Record<string, unknown>>> {
  const memoryDir = path.join(process.cwd(), 'omi-logs', 'memory', 'all');
  const logs: Array<Record<string, unknown>> = [];
  
  try {
    await fs.access(memoryDir);
    const files = await fs.readdir(memoryDir);
    const jsonFiles = files
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, limit);

    for (const file of jsonFiles) {
      try {
        const content = await fs.readFile(path.join(memoryDir, file), 'utf-8');
        const data = JSON.parse(content);
        
        // Mark as memory type and add metadata
        data.type = 'memory';
        data.filename = file;
        
        logs.push(data);
      } catch {
        console.error(`Error reading memory file ${file}`);
      }
    }
  } catch {
    // Memory directory doesn't exist yet
  }
  
  return logs;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source'); // 'r2', 'filesystem', or 'auto'
    
    // Try R2 first (unless explicitly requesting filesystem)
    let logs: Array<Record<string, unknown>> = [];
    let storageType = 'filesystem';
    let errorMessage = '';
    
    if (source !== 'filesystem') {
      try {
        const r2UserManager = new R2UserManager();
        const r2Available = await r2UserManager.testConnection();
        
        if (r2Available) {
          if (userId) {
            logs = await r2UserManager.getUserMemories(userId, limit);
          } else {
            logs = await r2UserManager.getAllRecentMemories(limit);
          }
          storageType = 'r2';
          
          // Add metadata to logs
          logs.forEach(log => {
            const logTyped = log as Record<string, unknown>;
            logTyped.type = 'memory';
            logTyped.storage_source = 'r2';
          });
        } else {
          throw new Error('R2 connection test failed');
        }
      } catch (r2Error) {
        console.warn('R2 failed, trying filesystem fallback:', r2Error);
        errorMessage = `R2 error: ${r2Error instanceof Error ? r2Error.message : 'Unknown error'}`;
      }
    }
    
    // Fallback to filesystem if R2 failed or was explicitly requested
    if (logs.length === 0 && source !== 'r2') {
      try {
        const logDir = path.join(process.cwd(), 'omi-logs');
        
        // Check if directory exists
        try {
          await fs.access(logDir);
        } catch {
          // Directory doesn't exist, return empty logs
          return NextResponse.json({ 
            success: true,
            logs: [],
            storage_type: 'filesystem',
            message: 'No logs found yet - directory does not exist'
          });
        }
        
        // Read transcript logs (existing)
        const transcriptLogs: OmiLogEntry[] = [];
        const files = await fs.readdir(logDir);
        const jsonFiles = files
          .filter(file => file.endsWith('.json'))
          .sort()
          .reverse(); // Most recent first
        
        // Process transcript logs
        for (const file of jsonFiles.slice(0, Math.floor(limit / 2))) {
          try {
            const content = await fs.readFile(path.join(logDir, file), 'utf-8');
            const data = JSON.parse(content);
            
            // Try to extract text from various possible fields
            let text = '';
            if (data.body) {
              if (data.body.transcript?.raw_text) {
                text = data.body.transcript.raw_text;
              } else if (data.body.raw_transcript) {
                text = data.body.raw_transcript;
              } else if (data.body.text) {
                text = data.body.text;
              } else if (data.body.content) {
                text = data.body.content;
              } else if (data.body.transcription) {
                text = data.body.transcription;
              }
            }
            
            // Process word frequency if text exists
            if (text) {
              data.wordFrequency = getTopWords(text);
              data.textLength = text.length;
            }
            
            // Mark as transcript type
            data.type = 'transcript';
            data.filename = file;
            data.storage_source = 'filesystem';
            
            transcriptLogs.push(data as OmiLogEntry);
          } catch (error) {
            console.error(`Error reading log file ${file}:`, error);
          }
        }
        
        // Read memory logs (new)
        const memoryLogs = await readMemoryLogs(Math.floor(limit / 2));
        memoryLogs.forEach(log => {
          const logTyped = log as Record<string, unknown>;
          logTyped.storage_source = 'filesystem';
        });
        
        // Combine and sort by timestamp
        const allLogs = [...transcriptLogs, ...memoryLogs];
        allLogs.sort((a, b) => {
          const aTyped = a as Record<string, unknown>;
          const bTyped = b as Record<string, unknown>;
          const timeA = new Date((aTyped.timestamp as string) || (aTyped.webhook_received_at as string) || 0).getTime();
          const timeB = new Date((bTyped.timestamp as string) || (bTyped.webhook_received_at as string) || 0).getTime();
          return timeB - timeA; // Most recent first
        });
        
        logs = allLogs.slice(0, limit) as Array<Record<string, unknown>>;
        
      } catch (filesystemError) {
        console.error('Filesystem also failed:', filesystemError);
        return NextResponse.json({
          success: false,
          error: 'Both R2 and filesystem failed',
          r2_error: errorMessage,
          filesystem_error: filesystemError instanceof Error ? filesystemError.message : 'Unknown error',
          logs: []
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      logs,
      storage_type: storageType,
      total: logs.length,
      source_requested: source || 'auto',
      user_id: userId,
      limit,
      message: `Retrieved ${logs.length} logs from ${storageType}${errorMessage ? ` (with R2 error: ${errorMessage})` : ''}`
    });
    
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to read logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear logs (useful for testing)
export async function DELETE() {
  try {
    const logDir = path.join(process.cwd(), 'omi-logs');
    
    try {
      await fs.access(logDir);
      const files = await fs.readdir(logDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          await fs.unlink(path.join(logDir, file));
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Cleared ${files.length} log files`
      });
    } catch {
      return NextResponse.json({
        success: true,
        message: 'No logs to clear'
      });
    }
  } catch {
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to clear logs'
      },
      { status: 500 }
    );
  }
}