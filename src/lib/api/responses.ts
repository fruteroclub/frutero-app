import { NextResponse } from 'next/server'

/**
 * Standardized API response format for success cases
 */
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  message?: string
}

/**
 * Standardized API response format for error cases
 */
export interface ApiErrorResponse {
  success: false
  error: string
  details?: any
}

/**
 * Standardized API response format for paginated data
 */
export interface ApiPaginatedResponse<T = any> {
  success: true
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  }
  return NextResponse.json(response, { status })
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: any
): NextResponse {
  const response: ApiErrorResponse = {
    success: false,
    error,
    ...(details && process.env.NODE_ENV === 'development' && { details }),
  }
  return NextResponse.json(response, { status })
}

/**
 * Create a paginated API response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  const response: ApiPaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
  }
  return NextResponse.json(response)
}

/**
 * Create a 201 Created response
 */
export function createdResponse<T>(data: T, message?: string): NextResponse {
  return successResponse(data, message, 201)
}

/**
 * Create a 204 No Content response
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Create a 400 Bad Request response
 */
export function badRequestResponse(error: string, details?: any): NextResponse {
  return errorResponse(error, 400, details)
}

/**
 * Create a 401 Unauthorized response
 */
export function unauthorizedResponse(error: string = 'Unauthorized'): NextResponse {
  return errorResponse(error, 401)
}

/**
 * Create a 403 Forbidden response
 */
export function forbiddenResponse(error: string = 'Forbidden'): NextResponse {
  return errorResponse(error, 403)
}

/**
 * Create a 404 Not Found response
 */
export function notFoundResponse(error: string = 'Resource not found'): NextResponse {
  return errorResponse(error, 404)
}

/**
 * Create a 409 Conflict response
 */
export function conflictResponse(error: string, details?: any): NextResponse {
  return errorResponse(error, 409, details)
}

/**
 * Create a 429 Too Many Requests response
 */
export function tooManyRequestsResponse(error: string = 'Rate limit exceeded'): NextResponse {
  return errorResponse(error, 429)
}
