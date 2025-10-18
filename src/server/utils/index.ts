import { ErrorDetails } from '@/types/api-v1'

export class AppError extends Error {
  statusCode: number
  details?: ErrorDetails

  constructor(message: string, statusCode = 500, details?: ErrorDetails) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.details = details
  }
}
