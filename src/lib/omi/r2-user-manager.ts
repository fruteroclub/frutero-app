import { R2StorageClient } from '@/lib/r2/client'

export class R2UserManager {
  private r2Client: R2StorageClient

  constructor() {
    this.r2Client = new R2StorageClient()
  }

  async saveMemory(
    uid: string,
    memoryId: string,
    data: Record<string, unknown>
  ): Promise<{ r2Key: string; allKey: string; publicUrl?: string }> {
    try {
      // Save to user-specific folder
      const r2Key = await this.r2Client.uploadMentorshipLog(uid, memoryId, data)
      
      // Also save a copy to "all" folder for daily aggregation
      const allKey = await this.r2Client.uploadToAllFolder(uid, memoryId, data)
      
      // Generate public URL if bucket is public
      const publicUrl = process.env.R2_PUBLIC_URL 
        ? `${process.env.R2_PUBLIC_URL}/${r2Key}`
        : undefined
      
      return { r2Key, allKey, publicUrl }
    } catch (error) {
      console.error('Error saving memory to R2:', error)
      throw new Error(`Failed to save memory: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getUserMemories(uid: string, limit: number = 20): Promise<Array<Record<string, unknown>>> {
    try {
      return await this.r2Client.getMentorshipLogs(uid, limit)
    } catch (error) {
      console.error('Error getting user memories:', error)
      throw new Error(`Failed to get user memories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAllRecentMemories(limit: number = 20): Promise<Array<Record<string, unknown>>> {
    try {
      return await this.r2Client.getAllRecentLogs(limit)
    } catch (error) {
      console.error('Error getting all recent memories:', error)
      throw new Error(`Failed to get recent memories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getUserStats(uid: string): Promise<{
    total_memories: number
    total_duration_minutes: number
    avg_duration_minutes: number
    languages_detected: string[]
    most_active_day: string
    transcript_word_count: number
    action_items_count: number
    insights_count: number
  }> {
    try {
      const memories = await this.getUserMemories(uid, 1000) // Get more for accurate stats
      
      if (memories.length === 0) {
        return {
          total_memories: 0,
          total_duration_minutes: 0,
          avg_duration_minutes: 0,
          languages_detected: [],
          most_active_day: '',
          transcript_word_count: 0,
          action_items_count: 0,
          insights_count: 0
        }
      }

      // Calculate statistics
      const totalDuration = memories.reduce((sum, memory) => {
        const duration = typeof memory.duration === 'number' ? memory.duration : 0
        return sum + duration
      }, 0)

      const avgDuration = memories.length > 0 ? totalDuration / memories.length : 0

      // Extract languages
      const languages = new Set<string>()
      memories.forEach(memory => {
        if (memory.language && typeof memory.language === 'string') {
          languages.add(memory.language)
        }
      })

      // Find most active day (simplified - would need proper date grouping for production)
      const dates: Record<string, number> = {}
      memories.forEach(memory => {
        if (memory.created_at && typeof memory.created_at === 'string') {
          const date = memory.created_at.split('T')[0]
          dates[date] = (dates[date] || 0) + 1
        }
      })
      const mostActiveDay = Object.keys(dates).reduce((a, b) => dates[a] > dates[b] ? a : b, '')

      // Count transcript words
      const totalWords = memories.reduce((sum, memory) => {
        if (memory.transcript_segments && Array.isArray(memory.transcript_segments)) {
          const segments = memory.transcript_segments as Array<{ text: string }>
          const wordCount = segments.reduce((segSum, segment) => {
            return segSum + (segment.text ? segment.text.split(/\s+/).length : 0)
          }, 0)
          return sum + wordCount
        }
        return sum
      }, 0)

      // Count action items and insights
      let actionItemsCount = 0
      let insightsCount = 0
      
      memories.forEach(memory => {
        if (memory.structured && typeof memory.structured === 'object') {
          const structured = memory.structured as Record<string, unknown>
          if (structured.action_items && Array.isArray(structured.action_items)) {
            actionItemsCount += structured.action_items.length
          }
          if (structured.insights && Array.isArray(structured.insights)) {
            insightsCount += structured.insights.length
          }
        }
      })

      return {
        total_memories: memories.length,
        total_duration_minutes: Math.round(totalDuration / 60), // Convert seconds to minutes
        avg_duration_minutes: Math.round(avgDuration / 60),
        languages_detected: Array.from(languages),
        most_active_day: mostActiveDay,
        transcript_word_count: totalWords,
        action_items_count: actionItemsCount,
        insights_count: insightsCount
      }
    } catch (error) {
      console.error('Error calculating user stats:', error)
      throw new Error(`Failed to calculate user stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Method to check if R2 is properly configured
  async testConnection(): Promise<boolean> {
    try {
      // Try to list objects with a very small limit to test connection
      await this.r2Client.getAllRecentLogs(1)
      return true
    } catch (error) {
      console.error('R2 connection test failed:', error)
      return false
    }
  }
}