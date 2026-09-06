interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2
};

export class RetryHelper {
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on the last attempt
        if (attempt === config.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
          config.maxDelay
        );

        console.warn(`Retry attempt ${attempt + 1}/${config.maxRetries} failed:`, lastError.message);
        console.warn(`Retrying in ${delay}ms...`);

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Operation failed after all retry attempts');
  }

  static isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'network',
      'timeout',
      'connection',
      'econnreset',
      'enotfound',
      '503',
      '502',
      '500',
      'throttled'
    ];

    const errorMessage = error.message.toLowerCase();
    return retryableMessages.some(msg => errorMessage.includes(msg));
  }

  static async withConditionalRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    return this.withRetry(async () => {
      try {
        return await operation();
      } catch (error) {
        if (error instanceof Error && !this.isRetryableError(error)) {
          // Don't retry non-retryable errors
          throw error;
        }
        throw error;
      }
    }, options);
  }
}

export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly timeout: number;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(failureThreshold = 5, timeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.timeout = timeout;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN - operation blocked');
      }
    }

    try {
      const result = await operation();
      
      if (this.state === 'half-open') {
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
      console.warn(`Circuit breaker opened after ${this.failureCount} failures`);
    }
  }

  private reset(): void {
    this.failureCount = 0;
    this.state = 'closed';
    console.info('Circuit breaker reset to CLOSED state');
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}