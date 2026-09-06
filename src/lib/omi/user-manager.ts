import fs from 'fs/promises';
import path from 'path';

export class UserManager {
  private static readonly BASE_DIR = path.join(process.cwd(), 'omi-logs', 'memory');
  private static readonly MAX_USER_ID_LENGTH = 50;

  /**
   * Sanitize user ID for safe file system usage
   */
  static sanitizeUserId(uid: string | null | undefined): string {
    if (!uid || uid.trim() === '') {
      return 'anonymous';
    }

    // Truncate if too long
    let sanitized = uid.slice(0, this.MAX_USER_ID_LENGTH);

    // Replace unsafe characters
    sanitized = sanitized
      .toLowerCase()
      .replace(/[@]/g, 'at_')  // @ -> at_
      .replace(/[^a-z0-9_\-]/g, '_') // Replace other special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores

    // If empty after sanitization, use anonymous
    return sanitized || 'anonymous';
  }

  /**
   * Get user directory path
   */
  static getUserDir(uid: string): string {
    const sanitizedId = this.sanitizeUserId(uid);
    return path.join(this.BASE_DIR, 'by-user', sanitizedId);
  }

  /**
   * Ensure user directory exists
   */
  static async ensureUserDir(uid: string): Promise<string> {
    const userDir = this.getUserDir(uid);
    await fs.mkdir(userDir, { recursive: true });
    
    // Also ensure the 'all' directory exists
    const allDir = path.join(this.BASE_DIR, 'all');
    await fs.mkdir(allDir, { recursive: true });
    
    return userDir;
  }

  /**
   * Save memory for a user
   */
  static async saveMemory(
    uid: string,
    memoryId: string,
    data: Record<string, unknown>
  ): Promise<{ userPath: string; allPath: string }> {
    const sanitizedId = this.sanitizeUserId(uid);
    const userDir = await this.ensureUserDir(uid);

    // Generate filename
    const timestamp = Date.now();
    const filename = `memory-${memoryId}-${timestamp}.json`;

    // Save to user directory
    const userPath = path.join(userDir, filename);
    await fs.writeFile(userPath, JSON.stringify(data, null, 2));

    // Also save to 'all' directory for easy access
    const allPath = path.join(this.BASE_DIR, 'all', `${sanitizedId}-${filename}`);
    await fs.writeFile(allPath, JSON.stringify(data, null, 2));

    // Implement rotation - keep only last 100 memories per user
    await this.rotateUserMemories(uid);

    return { userPath, allPath };
  }

  /**
   * Rotate user memories to prevent unlimited growth
   */
  private static async rotateUserMemories(uid: string): Promise<void> {
    const userDir = this.getUserDir(uid);
    
    try {
      const files = await fs.readdir(userDir);
      const jsonFiles = files
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse(); // Most recent first

      // Keep only last 100 files
      if (jsonFiles.length > 100) {
        const filesToDelete = jsonFiles.slice(100);
        for (const file of filesToDelete) {
          await fs.unlink(path.join(userDir, file));
        }
      }
    } catch {
      // Directory might not exist yet, ignore
    }
  }

  /**
   * Get all memories for a user
   */
  static async getUserMemories(uid: string, limit: number = 20): Promise<Array<Record<string, unknown>>> {
    const userDir = this.getUserDir(uid);
    const memories: Array<Record<string, unknown>> = [];

    try {
      const files = await fs.readdir(userDir);
      const jsonFiles = files
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse() // Most recent first
        .slice(0, limit);

      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(path.join(userDir, file), 'utf-8');
          const data = JSON.parse(content);
          memories.push(data);
        } catch {
          console.error(`Error reading memory file ${file}`);
        }
      }
    } catch {
      // User directory might not exist yet
      console.log(`No memories found for user ${uid}`);
    }

    return memories;
  }

  /**
   * Get list of all users
   */
  static async getAllUsers(): Promise<string[]> {
    const byUserDir = path.join(this.BASE_DIR, 'by-user');
    
    try {
      await fs.mkdir(byUserDir, { recursive: true });
      const dirs = await fs.readdir(byUserDir);
      
      // Filter out non-directories
      const users: string[] = [];
      for (const dir of dirs) {
        const stat = await fs.stat(path.join(byUserDir, dir));
        if (stat.isDirectory()) {
          users.push(dir);
        }
      }
      
      return users;
    } catch {
      return [];
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(uid: string): Promise<{
    total_memories: number;
    total_words: number;
    total_duration: number;
    categories: Record<string, number>;
    first_memory?: string;
    last_memory?: string;
  }> {
    const memories = await this.getUserMemories(uid, 1000); // Get more for stats
    
    let totalWords = 0;
    let totalDuration = 0;
    const categories: Record<string, number> = {};
    let firstMemory: string | undefined;
    let lastMemory: string | undefined;

    memories.forEach((memory, index) => {
      const memoryData = memory as Record<string, unknown>;
      if (memoryData.analytics) {
        const analytics = memoryData.analytics as Record<string, unknown>;
        totalWords += (analytics.total_words as number) || 0;
        totalDuration += (analytics.duration_seconds as number) || 0;
      }

      const memoryInfo = memoryData.memory as Record<string, unknown>;
      if (memoryInfo?.structured) {
        const structured = memoryInfo.structured as Record<string, unknown>;
        if (structured.category) {
          const category = structured.category as string;
          categories[category] = (categories[category] || 0) + 1;
        }
      }

      if (index === 0 && memoryInfo?.created_at) {
        lastMemory = memoryInfo.created_at as string;
      }
      if (index === memories.length - 1 && memoryInfo?.created_at) {
        firstMemory = memoryInfo.created_at as string;
      }
    });

    return {
      total_memories: memories.length,
      total_words: totalWords,
      total_duration: totalDuration,
      categories,
      first_memory: firstMemory,
      last_memory: lastMemory
    };
  }

  /**
   * Clear all memories for a user
   */
  static async clearUserMemories(uid: string): Promise<number> {
    const userDir = this.getUserDir(uid);
    let deleted = 0;

    try {
      const files = await fs.readdir(userDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          await fs.unlink(path.join(userDir, file));
          deleted++;
        }
      }
    } catch (error) {
      console.error(`Error clearing memories for user ${uid}:`, error);
    }

    return deleted;
  }
}