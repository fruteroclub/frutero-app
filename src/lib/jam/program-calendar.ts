/**
 * Program Calendar Utilities
 * Calculate program weeks and schedule
 */

/**
 * Calculate current week number of a program
 * @param startDate Program start date
 * @param currentDate Current date (defaults to now)
 * @returns Week number (1-indexed) or null if program hasn't started
 */
export function getCurrentProgramWeek(
  startDate: Date,
  currentDate: Date = new Date()
): number | null {
  const start = new Date(startDate)
  const current = new Date(currentDate)

  // Program hasn't started yet
  if (current < start) {
    return null
  }

  // Calculate milliseconds difference
  const diffMs = current.getTime() - start.getTime()

  // Calculate weeks (7 days = 1 week)
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))

  // Return 1-indexed week number
  return diffWeeks + 1
}

/**
 * Get week number for a specific date in a program
 * @param startDate Program start date
 * @param targetDate Target date to calculate week for
 * @returns Week number (1-indexed) or null if before program start
 */
export function getProgramWeekForDate(
  startDate: Date,
  targetDate: Date
): number | null {
  return getCurrentProgramWeek(startDate, targetDate)
}

/**
 * Check if a program is currently active
 * @param startDate Program start date
 * @param endDate Program end date
 * @param currentDate Current date (defaults to now)
 * @returns True if program is active
 */
export function isProgramActive(
  startDate: Date,
  endDate: Date | null,
  currentDate: Date = new Date()
): boolean {
  const current = new Date(currentDate)
  const start = new Date(startDate)

  // Check if started
  if (current < start) {
    return false
  }

  // If no end date, program is ongoing
  if (!endDate) {
    return true
  }

  const end = new Date(endDate)
  return current <= end
}

/**
 * Calculate total weeks in a program
 * @param startDate Program start date
 * @param endDate Program end date
 * @returns Total number of weeks or null if no end date
 */
export function getTotalProgramWeeks(
  startDate: Date,
  endDate: Date | null
): number | null {
  if (!endDate) {
    return null
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  const diffMs = end.getTime() - start.getTime()
  const diffWeeks = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7))

  return Math.max(1, diffWeeks)
}
