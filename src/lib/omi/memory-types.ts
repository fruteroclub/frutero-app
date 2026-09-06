// Omi Memory Creation Types
// Based on official Omi documentation for Memory Creation Triggers

export interface TranscriptSegment {
  text: string;
  speaker: string;
  speakerId: number;
  is_user: boolean;
  start: number;
  end: number;
}

export interface ActionItem {
  description: string;
  completed: boolean;
}

export interface StructuredData {
  title: string;
  overview: string;
  emoji: string;
  category: string;
  action_items: ActionItem[];
  events: unknown[];
}

export interface Geolocation {
  google_place_id?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  location_type?: string;
}

export interface MemoryCreation {
  id: string;
  created_at: string;
  started_at: string;
  finished_at: string;
  source: string;
  language: string;
  structured: StructuredData;
  transcript_segments: TranscriptSegment[];
  geolocation?: Geolocation;
  photos: string[];
  plugins_results?: unknown[];
  external_data?: unknown;
  discarded: boolean;
  deleted?: boolean;
  visibility?: string;
  processing_memory_id?: string | null;
  status: string;
}

// Enhanced types for processing
export interface ProcessedWordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface SpeakerStatistics {
  speakerId: number;
  speaker: string;
  wordCount: number;
  duration: number;
  topWords: ProcessedWordFrequency[];
}

export interface ProcessedMemory extends MemoryCreation {
  uid: string;
  word_frequency: ProcessedWordFrequency[];
  total_words: number;
  unique_words: number;
  conversation_duration: number;
  speaker_stats: SpeakerStatistics[];
  processed_at: string;
  file_path: string;
}

export interface MemoryWebhookResponse {
  success: boolean;
  memory_id: string;
  user_id: string;
  analytics: {
    total_words: number;
    unique_words: number;
    top_words: ProcessedWordFrequency[];
    duration_seconds: number;
    speakers: number;
  };
  storage: {
    type?: string;
    file?: string;
    r2Key?: string;
    publicUrl?: string;
    user_total_memories: number;
  };
}

export interface UserStatistics {
  uid: string;
  total_memories: number;
  total_duration_seconds: number;
  total_words: number;
  top_words: ProcessedWordFrequency[];
  categories: Record<string, number>;
  first_memory: string;
  last_memory: string;
}