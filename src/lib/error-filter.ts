'use client'

// Suppress specific React DOM warnings from third-party libraries
if (typeof window !== 'undefined') {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    const errorString = args.join(' ')

    // Suppress SVG attribute warnings from Privy's internal components
    if (
      (errorString.includes('fill-rule') && errorString.includes('fillRule')) ||
      (errorString.includes('clip-rule') && errorString.includes('clipRule')) ||
      (errorString.includes('stroke-width') && errorString.includes('strokeWidth')) ||
      (errorString.includes('stroke-linecap') && errorString.includes('strokeLinecap')) ||
      (errorString.includes('stroke-linejoin') && errorString.includes('strokeLinejoin'))
    ) {
      return
    }

    originalError.apply(console, args)
  }
}

const errorFilterConfig = {}
export default errorFilterConfig
