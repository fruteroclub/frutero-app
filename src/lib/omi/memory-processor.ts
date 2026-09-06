import { 
  MemoryCreation, 
  ProcessedWordFrequency, 
  SpeakerStatistics,
  TranscriptSegment 
} from './memory-types';

// Stop words for multiple languages
const STOP_WORDS = {
  en: new Set([
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
    'who', 'whom', 'am', 'be', 'been', 'being', 'but', 'if', 'or',
    'because', 'until', 'while', 'up', 'down', 'out', 'off', 'over',
    'under', 'here', 'there', 'just', 'now', 'also', 'well', 'even',
    'back', 'still', 'way', 'our', 'us', 'your', 'its', 'my', 'his',
    'her', 'any', 'every', 'another', 'much', 'many', 'come', 'go',
    'get', 'make', 'know', 'think', 'take', 'see', 'want', 'use',
    'find', 'give', 'tell', 'ask', 'work', 'seem', 'feel', 'try',
    'leave', 'call', 'good', 'first', 'last', 'long', 'great', 'little',
    'old', 'big', 'high', 'different', 'small', 'large', 'next', 'early',
    'young', 'important', 'public', 'bad', 'same', 'able'
  ]),
  es: new Set([
    'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se',
    'no', 'haber', 'estar', 'tener', 'los', 'con', 'para', 'como',
    'por', 'su', 'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o',
    'poder', 'decir', 'este', 'ese', 'ir', 'otro', 'ese', 'si',
    'me', 'ya', 'ver', 'porque', 'dar', 'cuando', 'muy', 'sin',
    'vez', 'mucho', 'saber', 'qué', 'sobre', 'mi', 'alguno', 'mismo',
    'yo', 'también', 'hasta', 'año', 'dos', 'querer', 'entre', 'así',
    'primero', 'desde', 'grande', 'eso', 'ni', 'nos', 'llegar', 'pasar',
    'tiempo', 'ella', 'sí', 'día', 'uno', 'bien', 'poco', 'deber',
    'entonces', 'poner', 'cosa', 'tanto', 'hombre', 'parecer', 'nuestro',
    'tan', 'donde', 'ahora', 'parte', 'después', 'vida', 'quedar',
    'siempre', 'creer', 'hablar', 'llevar', 'dejar', 'nada', 'cada',
    'seguir', 'menos', 'nuevo', 'encontrar'
  ])
};

// Category-specific stop words
const CATEGORY_STOP_WORDS: Record<string, Set<string>> = {
  meeting: new Set(['agenda', 'item', 'discuss', 'meeting', 'minutes']),
  conference: new Set(['presentation', 'slide', 'question', 'speaker']),
  mentorship: new Set(['mentor', 'mentee', 'advice', 'guidance']),
  casual: new Set(['yeah', 'okay', 'like', 'um', 'uh', 'right'])
};

export class MemoryProcessor {
  /**
   * Process a Memory Creation webhook to extract word frequencies
   */
  static processMemory(memory: MemoryCreation): {
    word_frequency: ProcessedWordFrequency[];
    total_words: number;
    unique_words: number;
    speaker_stats: SpeakerStatistics[];
  } {
    // Combine all transcript segments
    const allText = memory.transcript_segments
      .map(segment => segment.text)
      .join(' ');

    // Detect language (default to English)
    const language = this.detectLanguage(allText, memory.language);
    
    // Get appropriate stop words
    const stopWords = this.getStopWords(language, memory.structured?.category);

    // Process overall word frequency
    const wordFrequency = this.calculateWordFrequency(allText, stopWords);

    // Process speaker statistics
    const speakerStats = this.calculateSpeakerStats(memory.transcript_segments, stopWords);

    // Calculate total words (excluding stop words)
    const totalWords = allText
      .toLowerCase()
      .replace(/[^\w\sáéíóúñü]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .length;

    return {
      word_frequency: wordFrequency,
      total_words: totalWords,
      unique_words: wordFrequency.length,
      speaker_stats: speakerStats
    };
  }

  /**
   * Calculate word frequency from text
   */
  private static calculateWordFrequency(
    text: string, 
    stopWords: Set<string>
  ): ProcessedWordFrequency[] {
    // Clean and split text
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
      .slice(0, 100) // Top 100 words
      .map(([word, count]) => ({
        word,
        count,
        percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(2)) : 0
      }));
  }

  /**
   * Calculate statistics per speaker
   */
  private static calculateSpeakerStats(
    segments: TranscriptSegment[],
    stopWords: Set<string>
  ): SpeakerStatistics[] {
    const speakerMap = new Map<number, {
      speaker: string;
      text: string;
      duration: number;
    }>();

    // Group segments by speaker
    segments.forEach(segment => {
      const existing = speakerMap.get(segment.speakerId) || {
        speaker: segment.speaker,
        text: '',
        duration: 0
      };

      existing.text += ' ' + segment.text;
      existing.duration += (segment.end - segment.start);
      
      speakerMap.set(segment.speakerId, existing);
    });

    // Calculate stats for each speaker
    const stats: SpeakerStatistics[] = [];
    
    speakerMap.forEach((data, speakerId) => {
      const words = data.text
        .toLowerCase()
        .replace(/[^\w\sáéíóúñü]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));

      const frequency: Record<string, number> = {};
      words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
      });

      const topWords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({
          word,
          count,
          percentage: words.length > 0 ? parseFloat(((count / words.length) * 100).toFixed(2)) : 0
        }));

      stats.push({
        speakerId,
        speaker: data.speaker,
        wordCount: words.length,
        duration: data.duration,
        topWords
      });
    });

    return stats;
  }

  /**
   * Detect language from text
   */
  private static detectLanguage(text: string, hint?: string): 'en' | 'es' {
    // Use hint if provided
    if (hint === 'es' || hint === 'spanish') return 'es';
    if (hint === 'en' || hint === 'english') return 'en';

    // Simple heuristic: count Spanish-specific characters and words
    const spanishIndicators = (text.match(/[áéíóúñü]/gi) || []).length;
    const spanishWords = ['que', 'de', 'la', 'el', 'en', 'y', 'los', 'del', 'se', 'las'];
    const spanishWordCount = spanishWords.filter(word => 
      text.toLowerCase().includes(` ${word} `)
    ).length;

    // If we find Spanish indicators, assume Spanish
    if (spanishIndicators > 5 || spanishWordCount > 3) {
      return 'es';
    }

    return 'en'; // Default to English
  }

  /**
   * Get combined stop words for language and category
   */
  private static getStopWords(language: 'en' | 'es', category?: string): Set<string> {
    const baseStopWords = STOP_WORDS[language] || STOP_WORDS.en;
    
    if (category && CATEGORY_STOP_WORDS[category]) {
      return new Set([...baseStopWords, ...CATEGORY_STOP_WORDS[category]]);
    }

    return baseStopWords;
  }

  /**
   * Extract key topics from memory
   */
  static extractTopics(memory: MemoryCreation): string[] {
    const topics: string[] = [];

    // Add category as topic
    if (memory.structured?.category) {
      topics.push(memory.structured.category);
    }

    // Extract topics from title
    if (memory.structured?.title) {
      const titleWords = memory.structured.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 4); // Longer words are more likely to be topics
      
      topics.push(...titleWords.slice(0, 2));
    }

    // Extract from action items
    if (memory.structured?.action_items) {
      memory.structured.action_items.forEach(item => {
        const keywords = item.description
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 5)
          .slice(0, 1);
        topics.push(...keywords);
      });
    }

    // Return unique topics
    return [...new Set(topics)].slice(0, 5);
  }
}