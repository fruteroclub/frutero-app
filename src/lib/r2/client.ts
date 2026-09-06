import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { RetryHelper, CircuitBreaker } from './retry-client'

export class R2StorageClient {
  private client: S3Client
  private bucketName: string
  private circuitBreaker: CircuitBreaker

  constructor() {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
      throw new Error('Missing required R2 environment variables')
    }

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
    this.bucketName = process.env.R2_BUCKET_NAME
    this.circuitBreaker = new CircuitBreaker(5, 60000) // 5 failures, 1 minute timeout
  }

  async uploadMentorshipLog(userId: string, memoryId: string, data: Record<string, unknown>): Promise<string> {
    return await this.circuitBreaker.execute(async () => {
      return await RetryHelper.withConditionalRetry(async () => {
        const timestamp = Date.now()
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        
        const key = `mobil3-mentorships/by-user/${userId}/${year}/${month}/${memoryId}-${timestamp}.json`
        
        await this.client.send(new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: JSON.stringify(data, null, 2),
          ContentType: 'application/json',
          Metadata: {
            userId,
            memoryId,
            timestamp: timestamp.toString(),
            type: 'mentorship-log'
          }
        }))
        
        return key
      }, {
        maxRetries: 3,
        baseDelay: 1000
      })
    })
  }

  async uploadToAllFolder(userId: string, memoryId: string, data: Record<string, unknown>): Promise<string> {
    return await this.circuitBreaker.execute(async () => {
      return await RetryHelper.withConditionalRetry(async () => {
        const timestamp = Date.now()
        const date = new Date().toISOString().split('T')[0]
        
        const key = `mobil3-mentorships/all/${date}/${userId}-${memoryId}-${timestamp}.json`
        
        await this.client.send(new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: JSON.stringify(data, null, 2),
          ContentType: 'application/json',
          Metadata: {
            userId,
            memoryId,
            timestamp: timestamp.toString(),
            type: 'mentorship-log-all'
          }
        }))
        
        return key
      }, {
        maxRetries: 2,
        baseDelay: 500
      })
    })
  }

  async getMentorshipLogs(userId: string, limit: number = 20): Promise<Array<Record<string, unknown>>> {
    return await this.circuitBreaker.execute(async () => {
      return await RetryHelper.withConditionalRetry(async () => {
        const prefix = `mobil3-mentorships/by-user/${userId}/`
        
        const response = await this.client.send(new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          MaxKeys: limit,
        }))
        
        const logs: Array<Record<string, unknown>> = []
        
        if (response.Contents) {
          // Sort by LastModified descending to get most recent first
          const sortedContents = response.Contents
            .filter(object => object.Key && object.LastModified)
            .sort((a, b) => (b.LastModified!.getTime() - a.LastModified!.getTime()))
          
          for (const object of sortedContents) {
            try {
              const data = await this.getObject(object.Key!)
              logs.push(JSON.parse(data))
            } catch (error) {
              console.error(`Error parsing object ${object.Key}:`, error)
              // Continue with other objects
            }
          }
        }
        
        return logs
      }, {
        maxRetries: 2,
        baseDelay: 500
      })
    })
  }

  async getAllRecentLogs(limit: number = 20): Promise<Array<Record<string, unknown>>> {
    return await this.circuitBreaker.execute(async () => {
      return await RetryHelper.withConditionalRetry(async () => {
        const today = new Date().toISOString().split('T')[0]
        const prefix = `mobil3-mentorships/all/${today}/`
        
        const response = await this.client.send(new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
          MaxKeys: limit,
        }))
        
        const logs: Array<Record<string, unknown>> = []
        
        if (response.Contents) {
          // Sort by LastModified descending to get most recent first
          const sortedContents = response.Contents
            .filter(object => object.Key && object.LastModified)
            .sort((a, b) => (b.LastModified!.getTime() - a.LastModified!.getTime()))
          
          for (const object of sortedContents) {
            try {
              const data = await this.getObject(object.Key!)
              logs.push(JSON.parse(data))
            } catch (error) {
              console.error(`Error parsing object ${object.Key}:`, error)
              // Continue with other objects
            }
          }
        }
        
        return logs
      }, {
        maxRetries: 2,
        baseDelay: 500
      })
    })
  }

  private async getObject(key: string): Promise<string> {
    return await RetryHelper.withConditionalRetry(async () => {
      const response = await this.client.send(new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }))
      
      if (!response.Body) {
        throw new Error('Empty response body')
      }
      
      return await response.Body.transformToString()
    }, {
      maxRetries: 2,
      baseDelay: 300
    })
  }

  // Health check and monitoring methods
  getCircuitBreakerState(): string {
    return this.circuitBreaker.getState()
  }

  getCircuitBreakerFailureCount(): number {
    return this.circuitBreaker.getFailureCount()
  }
}