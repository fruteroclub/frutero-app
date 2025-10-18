import { ServiceResponse } from '@/types/api-v1'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomNumber(range: number) {
  return Math.floor(Math.random() * range)
}

export function truncateString(str: string | undefined, start = 6, end = 4) {
  if (!str) return 'Could not format address...'
  return `${str.slice(0, start)}...${str.slice(0 - end)}`
}

export function copyToClipboard(entryText: string) {
  void navigator.clipboard.writeText(entryText)
}

export async function handleResponse<T>(
  response: Response,
): Promise<ServiceResponse<T>> {
  const data = await response.json()
  if (!response.ok) {
    const errorMessage = data.error || `HTTP error! status: ${response.status}`
    console.error('API Error:', errorMessage)
    return {
      success: false,
      error: new Error(errorMessage),
      errorMsg: errorMessage,
      data: undefined,
    }
  }
  return { success: true, data: data.data as T }
}
