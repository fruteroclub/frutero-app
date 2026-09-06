// Omi Integration Type Definitions

export enum SessionContext {
  CONFERENCE = 'conference',
  MENTORSHIP = 'mentorship',
  MEETING = 'meeting',
  CASUAL = 'casual',
}

export interface OmiTranscript {
  raw_text: string;
  language: string;
  confidence: number;
}

export interface SessionMetadata {
  context: SessionContext;
  duration_seconds: number;
  participants?: string[];
}

export interface PromptResult {
  extracted_topics?: string[];
  summary?: string;
  action_items?: string[];
}

export interface OmiWebhookPayload {
  memory_id: string;
  user_id: string;
  timestamp: string;
  session_metadata?: SessionMetadata;
  transcript?: OmiTranscript;
  // Alternative field names that Omi might use
  raw_transcript?: string;
  text?: string;
  prompt_result?: PromptResult;
}

export interface ProcessedWordFrequency {
  word: string;
  count: number;
  percentage?: number;
}

export interface OmiSession {
  id: string;
  memoryId: string;
  userId: string;
  context?: SessionContext;
  timestamp: string;
  duration?: number;
  transcript: string;
  wordFrequency: ProcessedWordFrequency[];
  topics?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OmiLogEntry {
  timestamp: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  wordFrequency?: ProcessedWordFrequency[];
}